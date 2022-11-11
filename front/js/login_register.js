const {getCurrentWindow, getGlobal} = require("@electron/remote");
let gui = getGlobal("gui");

//*** Error field ***//
let error_field_login = document.getElementById("error_field_login");
let error_field_register = document.getElementById("error_field_register");

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

// Set button event
login_button.addEventListener("click", async () =>
{
	let res = await gui.login(login_username.value, login_password.value);

	switch (res)
	{
		case -1: error_field_login.innerHTML = "Contraseña incorrecta"; break;
		case -2: error_field_login.innerHTML = "Usuario no existente"; break;
		default: gui.window.main.webContents.reloadIgnoringCache(); getCurrentWindow().close(); break;
	}
});

login_new_account.addEventListener("click", () => {login_form.style.display="none"; register_form.style.display="block";});

//***  Register ***//

// Get Buttons
let register_button = document.getElementById("register_button");
let register_login_instead = document.getElementById("register_login_instead");

// Get Fields
let register_username = document.getElementById("register_username");
let register_email = document.getElementById("register_email");
let register_password = document.getElementById("register_password");
let register_password_confirmation = document.getElementById("register_password_confirmation");

// Set button event
register_button.addEventListener("click", async () =>
{
	let res = await gui.register(register_username.value, register_email.value, register_password.value, register_password_confirmation.value);

	switch (res)
	{
		case -1: error_field_register.innerHTML = "Usuario ya registrado"; break;
		case -2: error_field_register.innerHTML = "Contraseñas diferentes"; break;
		default: gui.window.main.webContents.reloadIgnoringCache(); getCurrentWindow().close(); break;
	}
	
});
register_login_instead.addEventListener("click", () => {login_form.style.display="block"; register_form.style.display="none";});
