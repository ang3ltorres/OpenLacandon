const {getCurrentWindow, getGlobal} = require("@electron/remote");
let gui = getGlobal("gui");

let accountInfo = gui.accountInfo;
let inputCardNumber = document.getElementById("input_card_number");
let inputAmount = document.getElementById("input_amount");

document.getElementById("button_cancel").addEventListener("click", () =>
{
	getCurrentWindow().close();
});

document.getElementById("button_add").addEventListener("click", async () =>
{
	let cardNumber = inputCardNumber.value;
	let amount = inputAmount.value;

	if ((amount == "" || isNaN(amount)) ||
	(cardNumber == "" || isNaN(cardNumber)) ||
	(cardNumber.length < 13 || cardNumber.length > 18))
	{
		gui.alertMessage(getCurrentWindow(), {title: "Error", message: "Número invalido", type: "error"});
		return;
	}

	await gui.customQuery(`UPDATE CLIENT SET WALLET_BALANCE = (${accountInfo.wallet_balance} + ${amount}) WHERE ID = ${accountInfo.id};`);
	gui.alertMessage(getCurrentWindow(), {title: "Transacción exitosa", message: "La transacción se ha realizado con éxito", type: "info"});
	gui.refreshAccountInfo();
	getCurrentWindow().getParentWindow().webContents.reloadIgnoringCache();
	getCurrentWindow().close();
});