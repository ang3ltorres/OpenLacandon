const {getCurrentWindow, getGlobal} = require("@electron/remote");
let gui = getGlobal("gui");

let button_enter = document.getElementById("button_enter");
let button_backup = document.getElementById("button_backup");
let password = document.getElementById("password");

button_backup.addEventListener("click", async () =>
{

	if (gui.adminPassword == password.value)
	{
		await gui.createBackupWindow();
		getCurrentWindow().close();
	}
	else
		gui.alertMessage(getCurrentWindow(), {title: "Error", message: "Constraseña incorrecta!!", type: "error"});
});

button_enter.addEventListener("click", async () =>
{
	await gui.createMainWindow();
	getCurrentWindow().close();
});
