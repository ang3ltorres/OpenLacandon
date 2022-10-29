const {ipcRenderer} = require("electron");

// Get id format from detail window
let id_format = localStorage.getItem("ID_FORMAT");

// No button click event
let button_no = document.getElementById("button_no");
button_no.addEventListener("click", (event) =>
{
	// Call main process
	ipcRenderer.sendSync("buttonAddToCartWindow", "no", id_format);
});

// Yes button click event
let button_yes = document.getElementById("button_yes");
button_yes.addEventListener("click", (event) =>
{
	// Call main process
	ipcRenderer.sendSync("buttonAddToCartWindow", "yes", id_format);
});
