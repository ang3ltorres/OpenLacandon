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

//Set book details
bookTitle.innerHTML = bookData[0].title;
bookSynopsis.innerHTML = bookData[0].synopsis;
bookAuthor.innerHTML = bookData[0].author;
bookRating.innerHTML = bookData[0].rating;

