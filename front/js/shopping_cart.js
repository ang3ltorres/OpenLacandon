const {getCurrentWindow, getGlobal} = require("@electron/remote");
let gui = getGlobal("gui");

let shoppingCart = gui.shoppingCart;
let accountInfo = gui.accountInfo;
let total = 0.0;

// Refresh the items using the shopping array id_format and get the info from DB
async function refreshShoppingItems()
{
	total = 0.0;

	for (let i = 0; i < shoppingCart.length; i++)
	{
		let itemInstance = document.getElementById("template_item").content.cloneNode(true);

		itemInstance.querySelector(".item").dataset.id = shoppingCart[i].id;

		// VISTA formato/titulo/isbn etc
		itemInstance.querySelector(".book_title").innerHTML
		= (await gui.customQuery(`SELECT TITLE FROM BOOK_TITLE_FORMAT WHERE ID = ${shoppingCart[i].id};`))[0].title;

		itemInstance.querySelector(".format_type").innerHTML
		= (await gui.customQuery(`SELECT TYPE FROM FORMAT WHERE ID = ${shoppingCart[i].id};`))[0].type;

		itemInstance.querySelector(".amount").innerHTML
		= shoppingCart[i].amount;

		let totalTemp = (await gui.customQuery(`SELECT PRICE_LIST FROM FORMAT WHERE ID = ${shoppingCart[i].id};`))[0].price_list * shoppingCart[i].amount;
		itemInstance.querySelector(".total").innerHTML
		= totalTemp

		total += totalTemp;

		document.getElementById("content_item").appendChild(itemInstance);
	}
	
	// Set items total cost
	document.getElementById("total").innerHTML = total;
}
refreshShoppingItems();

// Buy items button
document.getElementById("button_buy").addEventListener("click", async (event) =>
{
	// Not enough money
	if (accountInfo.wallet_balance < total)
	{
		gui.alertMessage(getCurrentWindow(), {title: "Error", message: "No cuenta con suficiente saldo en la cartera", type: "error"});
		return;
	}

	// Empty shopping cart
	if (shoppingCart.length == 0)
	{
		gui.alertMessage(getCurrentWindow(), {title: "Error", message: "El carrito está vacío", type: "error"});
		return;
	}

	// New wallet balance: Auto
	// New format stock: Auto

	///* Create purchase and purchase detail *///

	// Random date delivery
	let dateDelivery = new Date();
	dateDelivery.setDate(dateDelivery.getDate() + (Math.floor(1000 * Math.random()) % 6 +1));
	dateDelivery = dateDelivery.toISOString().split('T')[0];

	await gui.customQuery(`INSERT INTO ORD VALUES(DEFAULT, ${accountInfo.id}, DEFAULT, '${dateDelivery}');`);
	let idOrder = (await gui.customQuery(`SELECT ID FROM ORD WHERE ID = (SELECT MAX(ID) FROM ORD);`))[0].id;

	for (let i = 0; i < shoppingCart.length; i++)
		await gui.customQuery(`INSERT INTO ORD_DETAIL VALUES(DEFAULT, ${idOrder}, ${shoppingCart[i].id}, (SELECT PRICE_LIST FROM FORMAT WHERE ID = ${shoppingCart[i].id}), ${shoppingCart[i].amount});`);

	// Refresh
	accountInfo = gui.refreshAccountInfo();
	shoppingCart = [];
	gui.setShoppingCart(shoppingCart);

	// Close window and show window alert
	gui.alertMessage(getCurrentWindow(), {title: "Compra exitosa", message: "Su compra se ha realizado con exito", type: "info"});
	getCurrentWindow().close();
});

// Remove button click event
let content_item = document.getElementById("content_item");
content_item.addEventListener("click", (event) =>
{
	if (event.target.matches(".item .button_remove"))
	{
		// Get the clicked item (".item")
		let item = event.target.closest(".item");
		console.log("FORMAT ID REMOVED: %s", item.dataset.id);

		// Find the id_format in our shopping cart array
		for (let i = 0; i < shoppingCart.length; i++)
			if (shoppingCart[i].id == item.dataset.id)
			{
				// Delete id_format from array
				shoppingCart.splice(i, 1);
				gui.setShoppingCart(shoppingCart);

				// Clear contents of shopping items container
				while (content_item.firstChild)
					content_item.removeChild(content_item.firstChild);

				// Refresh shopping items
				refreshShoppingItems();

				return;
			}
	}
});