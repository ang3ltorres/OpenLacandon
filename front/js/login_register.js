const {ipcRenderer} = require("electron");

/* Forms */
let login_form = document.getElementById("login");
let register_form = document.getElementById("register");

/* Login */
let login_button = document.getElementById("login_button");
let login_new_account = document.getElementById("login_new_account");

let login_username = document.getElementById("login_username");
let login_password = document.getElementById("login_password");

login_button.addEventListener("click", () => {ipcRenderer.sendSync("userLogin", login_username.value, login_password.value);});
login_new_account.addEventListener("click", () => {login_form.style.display="none"; register_form.style.display="block";});

/* Register */
let register_button = document.getElementById("register_button");
let register_login_instead = document.getElementById("register_login_instead");

let register_username = document.getElementById("register_username");
let register_email = document.getElementById("register_email");
let register_password = document.getElementById("register_password");
let register_password_confirmation = document.getElementById("register_password_confirmation");

register_button.addEventListener("click", () => {ipcRenderer.sendSync("userRegister", register_username.value, register_email.value, register_password.value, register_password_confirmation.value);});
register_login_instead.addEventListener("click", () => {login_form.style.display="block"; register_form.style.display="none";});
