const {ipcRenderer} = require("electron");

let login_button = document.getElementById("login_button");
let login_user = document.getElementById("login_user");
let login_pass = document.getElementById("login_pass");


login_button.addEventListener("click", () => {ipcRenderer.sendSync("userLogin", login_user.value, login_pass.value);});
