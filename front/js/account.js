const {ipcRenderer} = require("electron");

let months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

let accountInfo = ipcRenderer.sendSync("getAccountInfo");
let user_info = document.getElementById("user_info");

// Set the user name and wallet balance
user_info.querySelector("#username").innerHTML = `${accountInfo.username}`;
user_info.querySelector("#wallet_balance").innerHTML = `Cartera $${accountInfo.wallet_balance}`;

// Refresh all oders and order details using the DB
async function refreshOrder()
{
	// Get orders from specific client
	let order = ipcRenderer.sendSync("customQuery", `SELECT * FROM ORD WHERE ID_CLIENT = ${accountInfo.id};`);

	// For every order set..
	for (let i = 0; i < order.length; i++)
	{
		// Get HTML order template
		let orderInstance = document.getElementById("template_order").content.cloneNode(true);

		// Set purchase id
		orderInstance.querySelector(".id").innerHTML = `ID: ${order[i].id}`;

		// Set order date
		orderInstance.querySelector(".date_order").innerHTML =
		`Fecha pedido: ${order[i].date_order.getDate()}
		de ${months[order[i].date_order.getMonth()]} 
		${order[i].date_order.getFullYear()}`;

		// Set delivery date
		orderInstance.querySelector(".date_delivery").innerHTML =
		`Fecha entrega: ${order[i].date_delivery.getDate()}
		de ${months[order[i].date_delivery.getMonth()]} 
		${order[i].date_delivery.getFullYear()}`;

		// Get all the purchase details from order
		let detail = ipcRenderer.sendSync("customQuery", `SELECT * FROM ORD_DETAIL WHERE ID_ORDER = ${order[i].id};`);
		
		// For every purchase detail, part of order
		for (let j = 0; j < detail.length; j++)
		{
			// Get HTML order_detail template
			let detailInstance = document.getElementById("template_order_detail").content.cloneNode(true);

			// Set amount of items
			detailInstance.querySelector(".amount").innerHTML = `Cantidad: ${detail[j].amount}`;

			// Set title of book
			let bookTitle = ipcRenderer.sendSync("customQuery", `SELECT TITLE FROM BOOK WHERE ISBN = (SELECT ISBN FROM FORMAT WHERE ID = (SELECT ID_FORMAT FROM ORD_DETAIL WHERE ID = ${detail[j].id}));`)[0].title;
			detailInstance.querySelector(".book_title").innerHTML = `Titulo: ${bookTitle}`;
			
			// Set format type
			let formatType = ipcRenderer.sendSync("customQuery", `SELECT TYPE FROM FORMAT WHERE ID = (SELECT ID_FORMAT FROM ORD_DETAIL WHERE ID = ${detail[j].id});`)[0].type;
			detailInstance.querySelector(".format_type").innerHTML = `Formato: ${formatType}`;

			// Set the amount
			detailInstance.querySelector(".total").innerHTML = `Total: $${detail[j].amount * detail[j].price_sold}`;

			// Add to the order HTML as child
			orderInstance.querySelector(".order").appendChild(detailInstance);
		}

		// Add to the order main container
		document.getElementById("order_container").appendChild(orderInstance);
	}
}
refreshOrder();