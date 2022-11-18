const {getCurrentWindow, getGlobal} = require("@electron/remote");
let gui = getGlobal("gui");

// Get shopping cart
let shoppingCart = gui.shoppingCart;

// Get id format from detail window
let id_format = localStorage.getItem("ID_FORMAT");

// No button click event
let button_no = document.getElementById("button_no");
button_no.addEventListener("click", () =>
{
	getCurrentWindow().close();
});

// Yes button click event
let button_yes = document.getElementById("button_yes");
button_yes.addEventListener("click", async () =>
{
	let stock = (await gui.customQuery(`SELECT STOCK FROM FORMAT WHERE ID = ${id_format};`))[0].stock;
			
	// Find if format repeated
	let index = null;
	let repeated = false;

	for (index = 0; index < shoppingCart.length; index++)
	{
		if (shoppingCart[index].id == id_format)
			{repeated = true; break;}
	}
	
	// If repeated add amount
	if (repeated)
	{
		if ((stock == -1) || (stock >= shoppingCart[index].amount+1))
			shoppingCart[index].amount++;
		else
		{
			gui.alertMessage(getCurrentWindow(), {title: "Error", message: "No hay stock suficiente", type: "error"});
			getCurrentWindow().close();
		}

	}

	// Else add new format to shopping cart items
	else
	{
		if ((stock == -1) || (stock >= 1))
			shoppingCart.push(
			{
				id: id_format,
				amount: 1
			});
		else
		{
			gui.alertMessage(getCurrentWindow(), {title: "Error", message: "No hay stock suficiente", type: "error"});
			getCurrentWindow().close();
		}
	}

	gui.setShoppingCart(shoppingCart);
	getCurrentWindow().close();
});
