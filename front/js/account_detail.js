const {BrowserWindow, getCurrentWindow, getGlobal} = require("@electron/remote");
let gui = getGlobal("gui");

let first_name = document.getElementById("first_name");
let last_name = document.getElementById("last_name");
let tel = document.getElementById("tel");
let address = document.getElementById("address");
let city = document.getElementById("city");
let zip = document.getElementById("zip");
let country = document.getElementById("country");

// Set current user data on fields
async function setUserData()
{
	let userData = (await gui.customQuery(`SELECT * FROM CLIENT WHERE ID = ${gui.accountInfo.id};`))[0];
	
	first_name.value = userData.first_name;
	last_name.value = userData.last_name;
	tel.value = userData.tel;
	address.value = userData.address;
	city.value = userData.city;
	zip.value = userData.zip;
	country.value = userData.country;
}
setUserData();


document.getElementById("button_cancel").addEventListener("click", () =>
{
	getCurrentWindow().close();
});

document.getElementById("button_ok").addEventListener("click", async () =>
{
	let query = "UPDATE CLIENT SET";
	query += " FIRST_NAME = " + ((first_name.value == '') ? "DEFAULT" : `'${first_name.value}'`);
	query += ", LAST_NAME = " + ((last_name.value == '') ? "DEFAULT" : `'${last_name.value}'`);
	query += ", TEL = " + ((tel.value == '') ? "DEFAULT" : `${tel.value}`);
	query += ", ADDRESS = " + ((address.value == '') ? "DEFAULT" : `'${address.value}'`);
	query += ", CITY = " + ((city.value == '') ? "DEFAULT" : `'${city.value}'`);
	query += ", ZIP = " + ((zip.value == '') ? "DEFAULT" : `${zip.value}`);
	query += ", COUNTRY = " + ((country.value == '') ? "DEFAULT" : `'${country.value}'`);
	query += ` WHERE ID = ${gui.accountInfo.id};`;

	console.log(query);
	await gui.customQuery(query);
	getCurrentWindow().close();
});