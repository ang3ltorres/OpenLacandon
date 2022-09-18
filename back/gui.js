const {app, BrowserWindow, ipcMain} = require("electron");
const {Client} = require("pg");

class GUI
{
	constructor()
	{
		this.window =
		{
			main: null,
			about: null
		};

		this.client = null;

		this.user =
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
		await this.client.connect();
	}

	async quit()
	{
		console.log("EXIT");
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
	}
	
	async createMainWindow()
	{
		this.window.main = new BrowserWindow
		({
			width: 800,
			height: 600,
			webPreferences:
			{
				nodeIntegration: true,
				contextIsolation: false,
				webSecurity: false
			}
		});

		this.window.main.loadFile("./front/html/login_register.html");
		this.window.main.setMenu(null);
		//this.window.main.openDevTools();
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
		//Resources and user/email existence confirmation queries
		let checkUser = await this.client.query(`SELECT * FROM CLIENT WHERE USERNAME = '${username}';`);
		let checkEmail = await this.client.query(`SELECT * FROM CLIENT WHERE EMAIL = '${email}';`);
		
		//user/email (if taken)
		if (checkUser.rows[0] || checkEmail.rows[0])
			return -1;
		
		//password (if non coincidences)
		if (password == passwordConfirmation)
		{
			let user = await this.client.query(`INSERT INTO CLIENT VALUES(DEFAULT, '${username}', '${password}', '${email}');`);
			user = await this.client.query(`SELECT * FROM CLIENT WHERE USERNAME = '${username}';`);
			return user.rows[0].id;
		}

		return -2;
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
		let checkUser = (user) =>
		{
			if (user.password == password)
				return parseInt(user.id);
			else
				return -1;
		};
		
		let user = null;

		// Try using USERNAME
		user = await this.client.query(`SELECT * FROM CLIENT WHERE USERNAME = '${username_email}';`);
		if (user.rows[0])
			return checkUser(user.rows[0]);

		// Try using EMAIL
		user = await this.client.query(`SELECT * FROM CLIENT WHERE EMAIL = '${username_email}';`);
		if (user.rows[0])
			return checkUser(user.rows[0]);

		// User not found
		return -2;
	}
};

module.exports = GUI;
