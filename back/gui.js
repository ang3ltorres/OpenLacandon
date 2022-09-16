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

};

//Instala linux
module.exports = GUI;