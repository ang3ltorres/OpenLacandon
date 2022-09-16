const {Client} = require("pg");
const util = require('node:util');

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
	await client.connect();
	let res = await client.query("SELECT * FROM info_clientes");
	
	/*
	// Example access by row name
	let data = res.rows;
	data.forEach(row =>
	{
		console.log(`ID_CLIENTE: ${row.id_cliente}`);
	})
	*/

	// Field names
	let fields = res.fields.map(field => field.name);

	fields.forEach(field =>
	{
		process.stdout.write(util.format("%s%s", field, " ".repeat(16)));
	});
	process.stdout.write("\n");

	// Data
	let data = res.rows;

	for (let i = 0; i < data.length; i++)
	{
		for (let j = 0; j < Object.keys(data[i]).length; j++)
			process.stdout.write(util.format("%s%s", Object.values(data[i])[j], " ".repeat(16)));
			//process.stdout.write(util.format("%s%s", Object.entries(data[i])[j][1], " ".repeat(16))); // Where entries == ({Key: value, Key: value, etc})
		process.stdout.write("\n");
	}

	await client.end();
})();

// Temp async function (lambda)
//(async() => {})();