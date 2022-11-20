const fs = require("fs");
const {getCurrentWindow, getGlobal} = require("@electron/remote");
let gui = getGlobal("gui");

// Get the default img bytes to avoid erros
let defaultImage = fs.readFileSync(__dirname + "/../res/default.jpg", null);

// Login icon
let button_login = document.getElementById("button_login");
let accountInfo = gui.accountInfo;

// Set the corresponding icon if we are logged in or not
if (accountInfo.loggedIn)
	button_login.querySelector("img").src = "../res/logout.svg";
else
	button_login.querySelector("img").src = "../res/login.svg";

// Add a book to the DOM
function addBook(isbn, image, title, author, format, price)
{
	// Get HTML template
	let copy = document.getElementById("template_book").content.cloneNode(true);
	
	// Set the corresponding data
	copy.querySelector(".book").dataset.isbn = isbn;
	copy.querySelector("img").src = URL.createObjectURL(new Blob([image], {type: "image/jpg"}));
	copy.querySelector(".title").innerHTML = title;
	copy.querySelector(".author").innerHTML = author;
	copy.querySelector(".format").innerHTML = format;
	copy.querySelector(".price").innerHTML = price;
	
	// Add to the content book main container
	document.getElementById("content_book").appendChild(copy);
}

// Refresh all books
let data = null;
let search_box = document.getElementById("search_box");

async function refreshData()
{
	if (search_box.value == "")
		data = await gui.customQuery(`SELECT * FROM BOOK;`);
	else
		data = await gui.customQuery(`SELECT * FROM BOOK WHERE (LOWER(TITLE) LIKE LOWER('%${search_box.value}%')) OR (LOWER(AUTHOR) LIKE LOWER('%${search_box.value}%'));`);
	
	for (let i = 0; i < data.length; i++)
	{
		// Format (random format found on DB)
		let format = (await gui.customQuery(`SELECT TYPE, PRICE_LIST FROM FORMAT WHERE ISBN = ${data[i].isbn}`));
		let type = "";
		let price_list = "";

		if (format.length >= 1)
		{
			let index = (Math.floor(100000 * Math.random()) % format.length);
			type = format[index].type;
			price_list = `$${format[index].price_list}`;
		}

		addBook
		(
			data[i].isbn,
			(data[i].image_front ? data[i].image_front.buffer : defaultImage.buffer),
			data[i].title,
			data[i].author,

			type,
			price_list
		);
	}
}

refreshData();

// Search
function search()
{
	let content_book = document.getElementById("content_book");

	// Clear current books
	while (content_book.firstChild)
		content_book.removeChild(content_book.firstChild);
	refreshData();
}

document.getElementById("search_button").addEventListener("click", search);
search_box.addEventListener("keyup", (event) =>
{
	if (event.key == "Enter")
		search();
});

// Book clicked event
document.getElementById("content_book").addEventListener("click", async (event) =>
{
	if (event.target.matches(".book, .book *"))
	{
		let book = event.target.closest(".book");
		console.log("ISBN Clicked book: %s", book.dataset.isbn);
		localStorage.setItem("ISBN", book.dataset.isbn)

		// Create detail window
		await gui.createDetailWindow();
	}
});

// User button clicked event
let button_user = document.getElementById("button_user");
button_user.addEventListener("click", async () =>
{
	if (accountInfo.loggedIn)
		await gui.createAccountWindow();
	else
		gui.alertMessage(getCurrentWindow(), {title: "Error", message: "Por favor inicie sesión", type: "error"});
})

// shopping cart button clicked event
let button_shopping_cart = document.getElementById("button_shopping_cart");
button_shopping_cart.addEventListener("click", async () =>
{
	if (accountInfo.loggedIn)
		await gui.createShoppingCartWindow();
	else
		gui.alertMessage(getCurrentWindow(), {title: "Error", message: "Por favor inicie sesión", type: "error"});
});

// Login button clicked event
document.getElementById("button_login").addEventListener("click", async () =>
{
	if (accountInfo.loggedIn)
	{
		gui.logoutUser();
		getCurrentWindow().webContents.reloadIgnoringCache();
	}
	else
		await gui.createLoginWindow();
});
