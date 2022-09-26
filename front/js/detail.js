const {ipcRenderer} = require("electron");

// Retrieve clicked book data
let isbn = localStorage.getItem("ISBN");
let bookData = ipcRenderer.sendSync("customQuery", `SELECT * FROM BOOK WHERE ISBN = ${isbn};`);

// Select image
let bookImage = document.getElementById("book_image");

// Set image only if it exists on DB
if (bookData[0].image_front)
	bookImage.src = URL.createObjectURL(new Blob([bookData[0].image_front], {type: "image/jpg"}));
else
	bookImage.src = "../res/default.jpg";
