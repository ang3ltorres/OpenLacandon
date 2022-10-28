const {ipcRenderer} = require("electron");

let id_format = localStorage.getItem("ID_FORMAT");

let button_no = document.getElementById("button_no");
button_no.addEventListener("click", (event) =>
{
	ipcRenderer.sendSync("buttonAddToCartWindow", "no", id_format);
});

let button_yes = document.getElementById("button_yes");
button_yes.addEventListener("click", (event) =>
{
	let message = ipcRenderer.sendSync("buttonAddToCartWindow", "yes", id_format);
	if (message != 0)
		alert(message);
});
