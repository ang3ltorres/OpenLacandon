const {app, BrowserWindow, ipcMain, Menu} = require("electron");
const {Client} = require("pg");

class GUI
{
	constructor()
	{
		this.window =
		{
			main: null,
			about: null,
			detail: null
		};

		this.client = null;
		this.bookData = null;

		this.accountInfo =
		{
			loggedIn: false,
			username: null,
			password: null,
			id: null
		};

		delete process.env.ELECTRON_ENABLE_SECURITY_WARNINGS;
		process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

		app.whenReady().then(this.init.bind(this));
		app.on("window-all-closed", this.quit.bind(this));
	}

	async init()
	{
		await this.createMainWindow();
		await this.configIpcMain();

		// Login
		this.client = new Client
		({
			user: "postgres",
			host: "localhost",
			password: "123",
			database: "openlacandon",
			port: 5432
		});

		try {console.log("CONNECTING"); await this.client.connect(); console.log("CONNECTED");}
		catch (error) {console.log(error); await this.quit();}

		this.bookData = await this.client.query("SELECT * FROM BOOK;");
	}

	async quit()
	{
		//localStorage.clear();
		console.log("DISCONNECTING");
		await this.client.end();
		app.quit();
	}

	async configIpcMain()
	{
		ipcMain.on("userLogin", async (event, username_email, password) =>
		{
			console.log({username_email, password});
			let res = await this.login(username_email, password);
			event.returnValue = res;
			console.log(res);
		});

		ipcMain.on("userRegister", async (event, username, email, password, passwordConfirmation) =>
		{
			console.log({username, email, password, passwordConfirmation});
			let res = await this.register(username, email, password, passwordConfirmation);
			event.returnValue = res;
			console.log(res);
		});

		ipcMain.on("getBookData", async (event) =>
		{
			console.log("Returning data");
			event.returnValue = this.bookData.rows;
		});

		ipcMain.on("detailWindow", async (event) =>
		{
			this.createDetailWindow();
			event.returnValue = 0;
		});

		ipcMain.on("customQuery", async (event, query) => 
		{
			console.log(query);
			let data = (await this.client.query(query)).rows;
			event.returnValue = data;
		});
	}
	
	async createMainWindow()
	{
		this.window.main = new BrowserWindow
		({
			width: 1280,
			height: 720,
			fullscreen: true,
			webPreferences:
			{
				nodeIntegration: true,
				contextIsolation: false,
				webSecurity: false
			}
		});

		this.window.main.loadFile("./front/html/index.html");

		// Menu
		let menuTemplate =
		[
			{ /* Archivo */
				label: 'Archivo',
				type: 'submenu',
				submenu:
				[
					{
						label: 'Salir',
						role: 'close'
					}
				]
			},

			{ /* Opciones */
				label: 'Opciones',
				type: 'submenu',
				submenu:
				[
					{
						label: 'Pantalla completa',
						role: 'togglefullscreen'
					}
				]
			}
		];
		this.window.main.setMenu(Menu.buildFromTemplate(menuTemplate));
		this.window.main.openDevTools();
	}

	async createDetailWindow()
	{
		this.window.detail = new BrowserWindow
		({
			parent: this.window.main,
			modal: true,
			show: false,
			width: 800,
			height: 600,
			fullscreen: false,
			webPreferences:
			{
				nodeIntegration: true,
				contextIsolation: false,
				webSecurity: false
			}
		});

		this.window.detail.loadFile("./front/html/detail.html");
		this.window.detail.setMenu(null);
		this.window.detail.openDevTools();
		this.window.detail.once("ready-to-show", () => {this.window.detail.show();})
	}

	/**
	 * Register (Function to register new users)
	 * @param  {String} username             Username
	 * @param  {String} email                Email
	 * @param  {String} password             Account password
	 * @param  {String} passwordConfirmation Password confirmation
	 * @return {Number}                      User ID, -1 if username/email already taken,
	 * 							             -2 if password non coincidences
	 */
	async register(username, email, password, passwordConfirmation)
	{
		//password (if non coincidences)
		if (password != passwordConfirmation)
			return -2;

		//Resources and user/email existence confirmation queries
		let checkUser = (await this.client.query(`SELECT * FROM CLIENT WHERE USERNAME = '${username}';`)).rows[0];
		let checkEmail = (await this.client.query(`SELECT * FROM CLIENT WHERE EMAIL = '${email}';`)).rows[0];
		
		//user/email (if taken)
		if (checkUser || checkEmail)
			return -1;
		
		let user = await this.client.query(`INSERT INTO CLIENT VALUES(DEFAULT, '${username}', '${password}', '${email}');`);
		user = (await this.client.query(`SELECT * FROM CLIENT WHERE USERNAME = '${username}';`)).rows[0];
		let id = parseInt(user.id);

		// Save account data locally
		this.accountInfo.loggedIn = true;
		this.accountInfo.username = username;
		this.accountInfo.password = password;
		this.accountInfo.id = id;

		return id;
	}

	/**
	 * Login using an (username / email) and password
	 * @param  {String} username_email Username or email
	 * @param  {String} password       User password
	 * @return {Number}                User ID, -1 if password is incorrect, -2 if user doesn't exist
	 */
	async login(username_email, password)
	{
		// Check user password (if found)
		let checkUser = (user, accountInfo) =>
		{
			if (user.password == password)
			{
				let id = parseInt(user.id);

				// Save account data locally
				accountInfo.loggedIn = true;
				accountInfo.username = user.username;
				accountInfo.password = user.password;
				accountInfo.id = id;

				return id;
			}
			else
				return -1;
		};
		
		let user = null;

		// Try using USERNAME
		user = (await this.client.query(`SELECT * FROM CLIENT WHERE USERNAME = '${username_email}';`)).rows[0];
		if (user)
			return checkUser(user, this.accountInfo);

		// Try using EMAIL
		user = (await this.client.query(`SELECT * FROM CLIENT WHERE EMAIL = '${username_email}';`)).rows[0];
		if (user)
			return checkUser(user, this.accountInfo);

		// User not found
		return -2;
	}
};

module.exports = GUI;
