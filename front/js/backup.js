const {ipcRenderer} = require("electron");
const {execSync} = require('child_process');

// Get the 3 buttons
let button_save = document.getElementById("button_save");
let button_load = document.getElementById("button_load");
let button_back = document.getElementById("button_back");

// Save button event
button_save.addEventListener("click", () =>
{
	// Get path from dialog
	let path = ipcRenderer.sendSync("saveFile");

	if (path)
	{
		let adminPassword = ipcRenderer.sendSync("getAdminPassword")

		// Execute the backup psql command
		execSync(`set "PGPASSWORD=${adminPassword}" && pg_dump -h localhost -p 5432 -U postgres -d openlacandon -f "${path}"`);
	}
});

// Load button event
button_load.addEventListener("click", () =>
{
	// Get path from dialog
	let path = ipcRenderer.sendSync("openFile");

	if (path)
	{
		let adminPassword = ipcRenderer.sendSync("getAdminPassword")
		ipcRenderer.sendSync("cleanDB");
		
		// Execute the backup psql command
		execSync(`set "PGPASSWORD=${adminPassword}" && psql -h localhost -U postgres -p5432 -d openlacandon < "${path}"`);
	}
});

// Back button event
button_back.addEventListener("click", () =>
{
	// Call main process
	// Close this window and create the welcome one
	ipcRenderer.sendSync("createWelcomeWindow");
});