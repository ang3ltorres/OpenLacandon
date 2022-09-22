const {ipcRenderer} = require("electron");
const {Client} = require("pg");
const fs = require("fs");

let defaultImage = fs.readFileSync(__dirname + "/../res/default.jpg", null);

function addBook(image, title, author, format, price)
{
	let copy = document.getElementById("template_book").content.cloneNode(true);
	
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
			(data[i].image_front ? data[i].image_front.buffer : defaultImage.buffer),
			data[i].title,
			data[i].author,
			"test",
			"100"
		);
	}

	//console.log(data);
}

refreshData();


// Test
/*
addBook
(
	"https://m.media-amazon.com/images/I/811kjwhnjcS._AC_UY654_FMwebp_QL65_.jpg",
	"TITULO",
	"AUTOR UWU",
	"PASTA BLANDA",
	"34"
);
*/
