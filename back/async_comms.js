const {dialog, ipcMain} = require("electron");

async function configIpcMain(GUI)
{
	ipcMain.on("getAdminPassword", async (event) =>
	{
		event.returnValue = GUI.adminPassword;
	});

	ipcMain.on("getAccountInfo", async (event) =>
	{
		event.returnValue = GUI.accountInfo;
	});

	ipcMain.on("userLogin", async (event, username_email, password) =>
	{
		console.log({username_email, password});
		let res = await GUI.login(username_email, password);
		event.returnValue = res;
		console.log(res);
	});

	ipcMain.on("userRegister", async (event, username, email, password, passwordConfirmation) =>
	{
		console.log({username, email, password, passwordConfirmation});
		let res = await GUI.register(username, email, password, passwordConfirmation);
		event.returnValue = res;
		console.log(res);
	});

	ipcMain.on("getBookData", async (event) =>
	{
		event.returnValue = GUI.bookData.rows;
	});

	ipcMain.on("customQuery", async (event, query) => 
	{
		console.log(query);
		let data = (await GUI.client.query(query)).rows;
		event.returnValue = data;
	});

	ipcMain.on("createWelcomeWindow", async (event) => 
	{

		if (GUI.window.backup)
			GUI.window.backup.close();

		GUI.createWelcomeWindow();

		event.returnValue = null;
	});

	ipcMain.on("createHomeWindow", async (event) => 
	{
		// Login
		GUI.connectDB();
		GUI.bookData = await GUI.client.query("SELECT * FROM BOOK;");


		GUI.window.welcome.close();
		GUI.createMainWindow();
		event.returnValue = null;
	});

	ipcMain.on("createBackupWindow", async (event, password) => 
	{
		if (GUI.adminPassword == password)
		{
			GUI.window.welcome.close();
			GUI.createBackupWindow();
		}
		else
			console.log("Invalid pass\n");

		event.returnValue = null;
	});

	ipcMain.on("createDetailWindow", async (event) =>
	{
		GUI.createDetailWindow();
		event.returnValue = 0;
	});

	ipcMain.on("createLoginWindow", async (event) => 
	{
		// If logged in -> logout
		if (GUI.accountInfo.loggedIn)
		{
			GUI.accountInfo.loggedIn = false;
			GUI.window.main.webContents.reloadIgnoringCache();
		}
		else // Open login/register window
		{
			GUI.createLoginWindow();
		}

		event.returnValue = null;
	});

	ipcMain.on("saveFile", async (event) => 
	{
		event.returnValue = dialog.showSaveDialogSync
		({
			filters: [{name: "Psql Dump", extensions: ["dump"]}]
		});
	});

	ipcMain.on("openFile", async (event) => 
	{
		event.returnValue = dialog.showOpenDialogSync
		({
			properties: ['openFile'],
			filters: [{name: "Psql Dump", extensions: ["dump"]}]
		});
	});

	ipcMain.on("cleanDB", async (event) => 
	{
		let postresClient = new Client
		({
			user: "postgres",
			host: "localhost",
			password: GUI.adminPassword,
			database: "postgres",
			port: 5432
		});

		postresClient.connect();
		await postresClient.query("DROP DATABASE IF EXISTS OPENLACANDON;");
		await postresClient.query("CREATE DATABASE OPENLACANDON;");
		await postresClient.end();

		event.returnValue = null;
	});
}

module.exports = configIpcMain;