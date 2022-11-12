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
	if (accountInfo.wallet_balance < total)
	{
		gui.alertMessage(getCurrentWindow(), {title: "Error", message: "No cuenta con suficiente saldo en la cartera", type: "error"});
		return;
	}

/* 	// New wallet balance
	await gui.customQuery(`UPDATE CLIENT SET WALLET_BALANCE = ${accountInfo.wallet_balance - total} WHERE ID = ${accountInfo.id};`)

	// New format stock
	for (let i = 0; i < shoppingCart.length; i++)
	{
		let currentStock = (await gui.customQuery(`SELECT STOCK FROM FORMAT WHERE ID = ${shoppingCart[i].id}`))[0].stock;
		await gui.customQuery(`UPDATE FORMAT SET STOCK = ${currentStock - shoppingCart[i].amount} WHERE ID = ${shoppingCart[i].id};`)
	}
 */
	// Create purchase and purchase detail

	// Refresh account info
	gui.refreshAccountInfo();
	accountInfo = gui.accountInfo;
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