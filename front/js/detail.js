const {ipcRenderer} = require("electron");

// Retrieve clicked book data
let isbn = localStorage.getItem("ISBN");
let bookData = ipcRenderer.sendSync("customQuery", `SELECT * FROM BOOK WHERE ISBN = ${isbn};`);

// Select book details
let bookImage = document.getElementById("book_image");
let bookTitle = document.getElementById("title");
let bookSynopsis = document.getElementById("synopsis");
let bookAuthor = document.getElementById("author");
let bookRating = document.getElementById("rating");

// Set image only if it exists on DB
if (bookData[0].image_front)
	bookImage.src = URL.createObjectURL(new Blob([bookData[0].image_front], {type: "image/jpg"}));
else
	bookImage.src = "../res/default.jpg";

// Set book details
bookTitle.innerHTML = bookData[0].title;
bookSynopsis.innerHTML = bookData[0].synopsis;
bookAuthor.innerHTML = bookData[0].author;

// Set the corresponding number of stars
let rating = bookData[0].rating;
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


