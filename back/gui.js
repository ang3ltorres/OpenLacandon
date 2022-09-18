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
		app.on("window-all-closed", app.quit);
	}

	async init()
	{
		await this.createMainWindow();
		await this.configIpcMain();

		//let algo = await this.login("RONALDO", "10413");
		//console.log(algo);

		//let algo2 = await this.register("RONALDO", "email", "10413", "10413");
		//console.log(algo2);
	}

	async configIpcMain()
	{
		ipcMain.on("userLogin", async (event, username_email, password) =>
		{
			event.returnValue = await this.login(username_email, password);
		});

		ipcMain.on("userRegister", async (event, username, email, password, passwordConfirmation) =>
		{
			console.log({username, email, password, passwordConfirmation});
			let ugu = await this.register(username, email, password, passwordConfirmation);
			event.returnValue = ugu;
			console.log(ugu);
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

	async register(user, email, pass, pass2)
	{
		let client = new Client
		({
			user: "postgres",
			host: "189.166.255.100",
			password: "123",
			database: "openlacandon",
			port: 5432
		});

		console.log("xd");
		await client.connect()
		let reg = await client.query("SELECT * FROM CLIENT");

		let checkUser = await client.query(`SELECT * FROM CLIENT WHERE USERNAME = '${user}';`);
		let checkEmail = await client.query(`SELECT * FROM CLIENT WHERE EMAIL = '${email}';`);
		
		if (checkUser.rows[0] || checkEmail.rows[0])
			return -1;

		let input = null;
		
		if (pass == pass2)
		{
			input = await client.query(`INSERT INTO CLIENT VALUES(DEFAULT,'${user}', '${pass}', '${email}');`);
			console.log(input);
			let xd = await client.query(`SELECT * CLIENT WHERE USERNAME = '${user}';`).rows[0].id;

			await client.end();
			return xd;
		}
		

		await client.end();
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
		let client = new Client
		({
			user: "postgres",
			host: "189.166.255.100",
			password: "123",
			database: "openlacandon",
			port: 5432
		});

		await client.connect()

		// Check user password (if found)
		let checkUser = async (user) =>
		{
			if (user.password == password)
			{
				await client.end();
				return parseInt(user.id);
			}
			else
			{
				await client.end();
				return -1;
			}
		};
		
		let user = null;

		// Try using USERNAME
		user = await client.query(`SELECT * FROM CLIENT WHERE USERNAME = '${username_email}';`);
		if (user.rows[0])
			return await checkUser(user.rows[0]);

		// Try using EMAIL
		user = await client.query(`SELECT * FROM CLIENT WHERE EMAIL = '${username_email}';`);
		if (user.rows[0])
			return await checkUser(user.rows[0]);

		// User not found
		return -2;
	}
};

module.exports = GUI;
