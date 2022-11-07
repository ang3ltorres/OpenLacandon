const {ipcRenderer} = require("electron");

let shoppingCart = ipcRenderer.sendSync("getShoppingCart");
let accountInfo = ipcRenderer.sendSync("getAccountInfo");
let total = 0.0;

// Refresh the items using the shopping array id_format and get the info from DB
async function refreshShoppingItems()
{
	for (let i = 0; i < shoppingCart.length; i++)
	{
		let itemInstance = document.getElementById("template_item").content.cloneNode(true);

		itemInstance.querySelector(".item").dataset.id = shoppingCart[i].id;

		itemInstance.querySelector(".book_title").innerHTML
		= ipcRenderer.sendSync("customQuery", `SELECT TITLE FROM BOOK WHERE ISBN = (SELECT ISBN FROM FORMAT WHERE ID = ${shoppingCart[i].id});`)[0].title;

		itemInstance.querySelector(".format_type").innerHTML
		= ipcRenderer.sendSync("customQuery", `SELECT TYPE FROM FORMAT WHERE ID = ${shoppingCart[i].id};`)[0].type;

		itemInstance.querySelector(".amount").innerHTML
		= shoppingCart[i].amount;

		let totalTemp = ipcRenderer.sendSync("customQuery", `SELECT PRICE_LIST FROM FORMAT WHERE ID = ${shoppingCart[i].id};`)[0].price_list * shoppingCart[i].amount;
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
document.getElementById("button_buy").addEventListener("click", (event) =>
{
	if (accountInfo.wallet_balance < total)
	{
		alert("No cuenta con suficiente saldo en la cartera");
		return;
	}

	// New wallet balance
	ipcRenderer.sendSync("customQuery", `UPDATE CLIENT SET WALLET_BALANCE = ${accountInfo.wallet_balance - total} WHERE ID = ${accountInfo.id};`)

	// New format stock
	for (let i = 0; i < shoppingCart.length; i++)
	{
		let currentStock = ipcRenderer.sendSync("customQuery", `SELECT STOCK FROM FORMAT WHERE ID = ${shoppingCart[i].id}`)[0].stock;
		ipcRenderer.sendSync("customQuery", `UPDATE FORMAT SET STOCK = ${currentStock - shoppingCart[i].amount} WHERE ID = ${shoppingCart[i].id};`)

	}

	// Create purchase and purchase detail

	// Get new user data
	ipcRenderer.sendSync("refreshAccountInfo");
	accountInfo = ipcRenderer.sendSync("getAccountInfo");
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

				// Set the new array on the main process
				ipcRenderer.sendSync("setShoppingCart", shoppingCart)

				// Clear contents of shopping items container
				while (content_item.firstChild)
					content_item.removeChild(content_item.firstChild);

				// Refresh shopping items
				refreshShoppingItems();

				return;
			}
	}
});