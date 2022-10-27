const {ipcRenderer} = require("electron");

let months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

let accountInfo = ipcRenderer.sendSync("getAccountInfo");
let user_info = document.getElementById("user_info");

user_info.querySelector("#username").innerHTML = `${accountInfo.username}`;
user_info.querySelector("#wallet_balance").innerHTML = `Cartera $${accountInfo.wallet_balance}`;

async function refreshOrder()
{
	let order = ipcRenderer.sendSync("customQuery", `SELECT * FROM ORD WHERE ID_CLIENT = ${accountInfo.id};`);
	//console.log(order);

	for (let i = 0; i < order.length; i++)
	{
		let orderInstance = document.getElementById("template_order").content.cloneNode(true);

		orderInstance.querySelector(".id").innerHTML = `ID: ${order[i].id}`;

		orderInstance.querySelector(".date_order").innerHTML =
		`Fecha pedido: ${order[i].date_order.getDate()}
		de ${months[order[i].date_order.getMonth()]} 
		${order[i].date_order.getFullYear()}`;

		orderInstance.querySelector(".date_delivery").innerHTML =
		`Fecha entrega: ${order[i].date_delivery.getDate()}
		de ${months[order[i].date_delivery.getMonth()]} 
		${order[i].date_delivery.getFullYear()}`;

		// detail
		let detail = ipcRenderer.sendSync("customQuery", `SELECT * FROM ORD_DETAIL WHERE ID_ORDER = ${order[i].id};`);
		console.log(detail)
		for (let j = 0; j < detail.length; j++)
		{
			let detailInstance = document.getElementById("template_order_detail").content.cloneNode(true);

			detailInstance.querySelector(".amount").innerHTML = `Cantidad: ${detail[j].amount}`;

			let bookTitle = ipcRenderer.sendSync("customQuery", `SELECT TITLE FROM BOOK WHERE ISBN = (SELECT ISBN FROM FORMAT WHERE ID = (SELECT ID_FORMAT FROM ORD_DETAIL WHERE ID = ${detail[j].id}));`)[0].title;
			detailInstance.querySelector(".book_title").innerHTML = `Titulo: ${bookTitle}`;
			
			let formatType = ipcRenderer.sendSync("customQuery", `SELECT TYPE FROM FORMAT WHERE ID = (SELECT ID_FORMAT FROM ORD_DETAIL WHERE ID = ${detail[j].id});`)[0].type;
			detailInstance.querySelector(".format_type").innerHTML = `Formato: ${formatType}`;

			detailInstance.querySelector(".total").innerHTML = `Total: $${detail[j].amount * detail[j].price_sold}`;


			orderInstance.querySelector(".order").appendChild(detailInstance);

		}

		document.getElementById("order_container").appendChild(orderInstance);
	}
}
refreshOrder();