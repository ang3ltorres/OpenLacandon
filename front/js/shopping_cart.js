const {ipcRenderer} = require("electron");

let accountInfo = ipcRenderer.sendSync("getAccountInfo");
let user_info = document.getElementById("user_info");

user_info.querySelector("#username").innerHTML = accountInfo.username;