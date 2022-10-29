const {ipcRenderer} = require("electron");

let accountInfo = ipcRenderer.sendSync("getAccountInfo");
let shoppingCart = ipcRenderer.sendSync("getShoppingCart");

async function refreshShoppingItems()
{
	let currentIDFormat = -1;
	let count = 0;

	for (let i = 0; i < shoppingCart.length; i++)
	{
		let itemInstance = document.getElementById("template_item").content.cloneNode(true);

		itemInstance.querySelector(".book_title").innerHTML
		= ipcRenderer.sendSync("customQuery", `SELECT TITLE FROM BOOK WHERE ISBN = (SELECT ISBN FROM FORMAT WHERE ID = ${shoppingCart[i]});`)[0].title;

		itemInstance.querySelector(".format_type").innerHTML
		= ipcRenderer.sendSync("customQuery", `SELECT TYPE FROM FORMAT WHERE ID = ${shoppingCart[i]};`)[0].type;

		document.getElementById("container").appendChild(itemInstance);
	}
}
refreshShoppingItems();