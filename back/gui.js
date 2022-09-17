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

		//let algo2 = await this.register("RONALDO", "10413", "10413");
		//console.log(algo2);
	}

	async configIpcMain()
	{
		ipcMain.on("userLogin", async (event, user, pass) =>
		{
			let res = await this.login(user, pass);
			console.log(res);
			event.returnValue = "Retorno esto en 'ipc.sendSync(...)'";
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

	async register(user, pass, pass2)
	{
		let client = new Client
		({
			user: "postgres",
			host: "189.166.255.100",
			password: "123",
			database: "tutorial",
			port: 5432
		});

		console.log("xd");
		await client.connect()
		let res = await client.query("SELECT * FROM OPENLACANDON");
		
		let datos = res.rows;

		for (let i = 0; i < datos.length; i++)
		{
			if (datos[i].nombre == user)
			{
				return "User already taken";
			}
		}

		
		if (pass == pass2)
		{
			//let sql_query = "INSERT INTO OPENLACANDON VALUES(?,?)";
			console.log(sql_query);
			
			await client.end();
			return "Register successfully completed";
		}
		

		await client.end();
		return "Password does not match, try again";
	}

	/**
	 * Login using an (username / email) and password
	 * @param  {String} username_email Username or email
	 * @param  {String} pass           User password
	 * @return {Number}                User ID, -1 if password is incorrect, -2 if user doesn't exist
	 */
	async login(username_email, password)
	{
		let client = new Client
		({
			user: "postgres",
			host: "localhost",
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
