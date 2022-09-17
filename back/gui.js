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

		let algo = await this.login("RONALDO", "10413");
		console.log(algo);
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
		let res = await client.query("SELECT * FROM info_clientes");
		
		let datos = res.rows;

		for (let i = 0; i < datos.length; i++)
		{
			if (datos[i].nombre == user)
			{

				await return "User already taken";
			}

		}

		await client.query("INSERT INTO(id_cliente, nombre, apellido) VALUE()");

		await client.end();
		return "User not found";
	}

	async login(user, pass)
	{
		let client = new Client
		({
			user: "postgres",
			host: "localhost",
			password: "123",
			database: "tutorial",
			port: 5432
		});

		console.log("xd");
		await client.connect()
		let res = await client.query("SELECT * FROM info_clientes");
		let datos = res.rows;

		for (let i = 0; i < datos.length; i++)
		{
			if (datos[i].nombre == user)
			{
				if (datos[i].id_cliente == pass)
				{
					// Save user data
					this.user.username = user;
					this.user.password = pass;
					this.user.id = datos[i].id_cliente;
					this.user.loggedIn = true;
					
					console.log(this.user);
					
					await client.end();
					return datos[i].id_cliente;
				}
				else
				{
					await client.end();
					return "Invalid pass";
				}
			}
		}

		await client.end();
		return "User not found";
	}
};

//Instala linux ugu
module.exports = GUI;