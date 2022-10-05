const {ipcRenderer} = require("electron");
const {execSync} = require('child_process');

let button_save = document.getElementById("button_save");
let button_load = document.getElementById("button_load");
let button_back = document.getElementById("button_back");

button_save.addEventListener("click", () =>
{
	let path = ipcRenderer.sendSync("saveFile");
	if (path)
	{
		let adminPassword = ipcRenderer.sendSync("getAdminPassword")
		execSync(`set "PGPASSWORD=${adminPassword}" && pg_dump -h localhost -p 5432 -U postgres -d openlacandon -f "${path}"`).toString();
	}
});

button_load.addEventListener("click", () =>
{
	let path = ipcRenderer.sendSync("openFile");
	if (path)
	{
		let adminPassword = ipcRenderer.sendSync("getAdminPassword")
		ipcRenderer.sendSync("cleanDB");
		
		execSync(`set "PGPASSWORD=${adminPassword}" && psql -h localhost -U postgres -p5432 -d openlacandon < "${path}"`).toString();
	}
});


button_back.addEventListener("click", () =>
{
	ipcRenderer.sendSync("createWelcomeWindow");
});