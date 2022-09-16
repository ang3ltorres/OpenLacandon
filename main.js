const {Client} = require("pg");

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
	const fields = res.fields.map(field => field.name);
	console.log(fields);
	await client.end();
})();

// Temp async function (lambda)
//(async() => {})();