const {ipcRenderer} = require("electron");
const fs = require("fs");

let defaultImage = fs.readFileSync(__dirname + "/../res/default.jpg", null);

function addBook(isbn, image, title, author, format, price)
{
	let copy = document.getElementById("template_book").content.cloneNode(true);
	
	copy.querySelector(".book").dataset.isbn = isbn;
	copy.querySelector("img").src = URL.createObjectURL(new Blob([image], {type: "image/jpg"}));
	copy.querySelector(".title").innerHTML = title;
	copy.querySelector(".author").innerHTML = author;
	copy.querySelector(".format").innerHTML = format;
	copy.querySelector(".price").innerHTML = "$" + price;
	
	document.getElementById("content_book").appendChild(copy);
}

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

document.getElementById("content_book").addEventListener("click", (event) =>
{
	if (event.target.matches(".book, .book *"))
	{
		let book = event.target.closest(".book");
		console.log("ISBN Clicked book: %s", book.dataset.isbn);
		localStorage.setItem("ISBN", book.dataset.isbn)
		ipcRenderer.sendSync("detailWindow");
	}
});
