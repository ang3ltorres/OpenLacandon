const {app, BrowserWindow} = require("electron");

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
			username: null,
			password: null
		};

		app.whenReady().then(this.init.bind(this));
		app.on('window-all-closed', app.quit);
	}

	init()
	{
		this.createMainWindow();
	}
	
	createMainWindow()
	{
		this.window.main = new BrowserWindow
		({
			width: 800,
			height: 600,
			webPreferences:
			{
				nodeIntegration: true,
				contextIsolation: false
			}
		});

		this.window.main.loadFile("./front/html/index.html");
		this.window.main.setMenu(null);
	}

	login(user, pass)
	{
		const client = new Client
		({
			user: "postgres",
			host: "localhost",
			password: "123",
			database: "tutorial",
			port: 5432
		});

		(async() =>
		{
			await client.connect()
			const res = await client.query("SELECT * FROM info_clientes");
			
			let datos = res.row;
			for (let i = 0; i < datos.lenght; i++)
				console.log(datos[i]);
			
			await client.end();
		}
	}
};

module.exports = GUI;