const {ipcRenderer} = require("electron");

let button_enter = document.getElementById("button_enter");
let button_backup = document.getElementById("button_backup");
let password = document.getElementById("password");

button_backup.addEventListener("click", () => {ipcRenderer.sendSync("createBackupWindow", password.value);});
button_enter.addEventListener("click", () => {ipcRenderer.sendSync("createHomeWindow");});
