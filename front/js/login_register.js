const {ipcRenderer} = require("electron");

//*** Forms ***//
let login_form = document.getElementById("login");
let register_form = document.getElementById("register");

//*** Login ***//

// Get Buttons
let login_button = document.getElementById("login_button");
let login_new_account = document.getElementById("login_new_account");

// Get Fields
let login_username = document.getElementById("login_username");
let login_password = document.getElementById("login_password");

// Set Buttons
login_button.addEventListener("click", () => {ipcRenderer.sendSync("userLogin", login_username.value, login_password.value);});
login_new_account.addEventListener("click", () => {login_form.style.display="none"; register_form.style.display="block";});

// Set Fields
let login = (event) => {if (event.key == "Enter") {ipcRenderer.sendSync("userLogin", login_username.value, login_password.value);}};
login_username.addEventListener("keyup", login);
login_password.addEventListener("keyup", login);

//***  Register ***//

// Get Buttons
let register_button = document.getElementById("register_button");
let register_login_instead = document.getElementById("register_login_instead");

// Get Fields
let register_username = document.getElementById("register_username");
let register_email = document.getElementById("register_email");
let register_password = document.getElementById("register_password");
let register_password_confirmation = document.getElementById("register_password_confirmation");

// Set Buttons
register_button.addEventListener("click", () => {ipcRenderer.sendSync("userRegister", register_username.value, register_email.value, register_password.value, register_password_confirmation.value);});
register_login_instead.addEventListener("click", () => {login_form.style.display="block"; register_form.style.display="none";});

// Set Fields
let register = (event) => {if (event.key == "Enter") {ipcRenderer.sendSync("userRegister", register_username.value, register_email.value, register_password.value, register_password_confirmation.value);}};
register_username.addEventListener("keyup", register);
register_email.addEventListener("keyup", register);
register_password.addEventListener("keyup", register);
register_password_confirmation.addEventListener("keyup", register);
