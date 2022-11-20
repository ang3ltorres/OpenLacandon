const {ipcRenderer} = require("electron");

// Account info
let accountInfo = ipcRenderer.sendSync("getAccountInfo");

// Retrieve clicked book data
let isbn = localStorage.getItem("ISBN");
let bookData = ipcRenderer.sendSync("customQuery", `SELECT * FROM BOOK WHERE ISBN = ${isbn};`)[0];
let formatData = ipcRenderer.sendSync("customQuery", `SELECT * FROM FORMAT WHERE ISBN = ${isbn};`);

// Select book details
let bookImage = document.getElementById("book_image");
let bookTitle = document.getElementById("title");
let bookReleaseDate = document.getElementById("release_date");
let bookSynopsis = document.getElementById("synopsis");
let bookAuthor = document.getElementById("author");
let bookRating = document.getElementById("rating");

// Set image only if it exists on DB
if (bookData.image_front)
	bookImage.src = URL.createObjectURL(new Blob([bookData.image_front], {type: "image/jpg"}));
else
	bookImage.src = "../res/default.jpg";

// Set book details
bookTitle.innerHTML = bookData.title;
bookReleaseDate.innerHTML = bookData.release_date;
bookSynopsis.innerHTML = bookData.synopsis;
bookAuthor.innerHTML = bookData.author;

// Set the corresponding number of stars
let rating = bookData.rating;
for (let i = 0; i < 5; i++)
{
	let img = document.createElement("img");
	img.alt = "star";

	// Full star
	if (rating >= 2)
	{
		img.src = "../res/star1.svg";
		rating -= 2;
	}
	// Half star
	else if (rating == 1)
	{
		img.src = "../res/star2.svg";
		rating -= 1;
	}
	// Empty star
	else
		img.src = "../res/star3.svg";
	
	
	bookRating.append(img);
}

// Add formats
for (let i = 0; i < formatData.length; i++)
{
	let copy = document.getElementById("template_format").content.cloneNode(true);
	
	copy.querySelector(".format").dataset.id_format = formatData[i].id;
	copy.querySelector(".format_type").innerHTML = formatData[i].type;
	copy.querySelector(".format_price").innerHTML = `$${formatData[i].price_list}`;
	
	document.getElementById("formats_container").appendChild(copy);
}

// Format clicked event
document.getElementById("formats_container").addEventListener("click", (event) =>
{
	if (event.target.matches(".format, .format *"))
	{
		if (accountInfo.loggedIn)
		{
			let format = event.target.closest(".format");
			console.log("ID Clicked format: %s", format.dataset.id_format);
			localStorage.setItem("ID_FORMAT", format.dataset.id_format)
			ipcRenderer.sendSync("createAddToCartWindow");
		}
		else
			alert("Por favor inicie sesión");
	}
});
