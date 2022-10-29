const {ipcRenderer} = require("electron");
const fs = require("fs");

// Get the default img bytes to avoid erros
let defaultImage = fs.readFileSync(__dirname + "/../res/default.jpg", null);

// Login icon
let button_login = document.getElementById("button_login");
let accountInfo = ipcRenderer.sendSync("getAccountInfo");

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
	copy.querySelector(".price").innerHTML = "$" + price;
	
	// Add to the content book main container
	document.getElementById("content_book").appendChild(copy);
}

// Refresh all books
function refreshData()
{
	let data = ipcRenderer.sendSync("getBookData");
	
	for (let i = 0; i < data.length; i++)
	{
		addBook
		(
			data[i].isbn,
			(data[i].image_front ? data[i].image_front.buffer : defaultImage.buffer),
			data[i].title,
			data[i].author,
			"test",
			"100"
		);
	}
}

refreshData();

// Book clicked event
document.getElementById("content_book").addEventListener("click", (event) =>
{
	if (event.target.matches(".book, .book *"))
	{
		let book = event.target.closest(".book");
		console.log("ISBN Clicked book: %s", book.dataset.isbn);
		localStorage.setItem("ISBN", book.dataset.isbn)

		// Create detail window
		ipcRenderer.sendSync("createDetailWindow");
	}
});

// User button clicked event
let button_user = document.getElementById("button_user");
button_user.addEventListener("click", (event) =>
{
	if (accountInfo.loggedIn)
		ipcRenderer.sendSync("createAccountWindow");
	else
		alert("Por favor inicie sesión");
})

// shopping cart button clicked event
let button_shopping_cart = document.getElementById("button_shopping_cart");
button_shopping_cart.addEventListener("click", (event) =>
{
	if (accountInfo.loggedIn)
		ipcRenderer.sendSync("createShoppingCartWindow");
	else
		alert("Por favor inicie sesión");
});

// Login button clicked event
document.getElementById("button_login").addEventListener("click", (event) =>
{
	ipcRenderer.sendSync("createLoginWindow");
});
