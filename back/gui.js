const {app, BrowserWindow, Menu} = require("electron");
const {Client} = require("pg");
const configIpcMain = require("./async_comms");

class GUI
{
	constructor()
	{
		this.window =
		{
			welcome: null,
			backup: null,
			main: null,
			login: null,
			detail: null,
			account: null,
			addToCart: null,
			shoppingCart: null
		};

		this.adminPassword = "123";
		this.connected = false;

		this.client = null;
		this.bookData = null;

		this.accountInfo =
		{
			loggedIn: false,
			username: null,
			password: null,
			wallet_balance: null,
			id: null
		};

		this.shoppingCart = [];

		delete process.env.ELECTRON_ENABLE_SECURITY_WARNINGS;
		process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

		app.whenReady().then(this.init.bind(this));
		app.on("window-all-closed", this.quit.bind(this));
	}

	async init()
	{
		await this.createWelcomeWindow();
		await configIpcMain(this);
	}

	async quit()
	{
		//localStorage.clear();
		if (this.connected)
		{
			console.log("DISCONNECTING");
			await this.client.end();
		}

		app.quit();
	}

	async createWelcomeWindow()
	{
		this.window.welcome = new BrowserWindow
		({
			width: 550,
			height: 400,
			fullscreen: false,
			webPreferences:
			{
				nodeIntegration: true,
				contextIsolation: false,
				webSecurity: false
			}
		});

		this.window.welcome.loadFile("./front/html/welcome.html");
		this.window.welcome.setMenu(null);
		//this.window.welcome.openDevTools();
	}

	async createMainWindow()
	{
		this.window.main = new BrowserWindow
		({
			width: 1280,
			height: 720,
			fullscreen: false,
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

	async createBackupWindow()
	{
		this.window.backup = new BrowserWindow
		({
			width: 350,
			height: 220,
			fullscreen: false,
			webPreferences:
			{
				nodeIntegration: true,
				contextIsolation: false,
				webSecurity: false
			}
		});

		this.window.backup.loadFile("./front/html/backup.html");
		this.window.backup.setMenu(null);
		//this.window.backup.openDevTools();
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

	async createLoginWindow()
	{
		this.window.login = new BrowserWindow
		({
			parent: this.window.main,
			modal: true,
			show: false,
			width: 500,
			height: 500,
			fullscreen: false,
			webPreferences:
			{
				nodeIntegration: true,
				contextIsolation: false,
				webSecurity: false
			}
		});

		this.window.login.loadFile("./front/html/login_register.html");
		this.window.login.setMenu(null);
		this.window.login.openDevTools();
		this.window.login.once("ready-to-show", () => {this.window.login.show();})
	}

	async createShoppingCartWindow()
	{
		this.window.shoppingCart = new BrowserWindow
		({
			parent: this.window.main,
			modal: true,
			show: false,
			width: 500,
			height: 500,
			fullscreen: false,
			webPreferences:
			{
				nodeIntegration: true,
				contextIsolation: false,
				webSecurity: false
			}
		});

		this.window.shoppingCart.loadFile("./front/html/shopping_cart.html");
		this.window.shoppingCart.setMenu(null);
		this.window.shoppingCart.openDevTools();
		this.window.shoppingCart.once("ready-to-show", () => {this.window.shoppingCart.show();})
	}

	async createAccountWindow()
	{
		this.window.account = new BrowserWindow
		({
			parent: this.window.main,
			modal: true,
			show: false,
			width: 500,
			height: 500,
			fullscreen: false,
			webPreferences:
			{
				nodeIntegration: true,
				contextIsolation: false,
				webSecurity: false
			}
		});

		this.window.account.loadFile("./front/html/account.html");
		this.window.account.setMenu(null);
		this.window.account.openDevTools();
		this.window.account.once("ready-to-show", () => {this.window.account.show();})
	}

	async createAddToCartWindow()
	{
		this.window.addToCart = new BrowserWindow
		({
			parent: this.window.detail,
			modal: true,
			show: false,
			width: 300,
			height: 300,
			fullscreen: false,
			webPreferences:
			{
				nodeIntegration: true,
				contextIsolation: false,
				webSecurity: false
			}
		});

		this.window.addToCart.loadFile("./front/html/add_to_cart.html");
		this.window.addToCart.setMenu(null);
		//this.window.addToCart.openDevTools();
		this.window.addToCart.once("ready-to-show", () => {this.window.addToCart.show();})
	}

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
		this.accountInfo.wallet_balance = 0;
		this.accountInfo.id = id;

		// Close window
		this.window.login.close();
		this.window.main.webContents.reloadIgnoringCache();

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
				this.accountInfo.loggedIn = true;
				this.accountInfo.username = user.username;
				this.accountInfo.password = user.password;
				this.accountInfo.wallet_balance = user.wallet_balance;
				this.accountInfo.id = id;

				// Close window
				this.window.login.close();
				this.window.main.webContents.reloadIgnoringCache();
				//this.window.main.reload();

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

	async connectDB()
	{
		this.client = new Client
		({
			user: "postgres",
			host: "localhost",
			password: this.adminPassword,
			database: "openlacandon",
			port: 5432
		});

		try {console.log("CONNECTING"); await this.client.connect(); console.log("CONNECTED"); this.connected = true;}
		catch (error) {console.log(error); await this.quit();}
	}
};

module.exports = GUI;
