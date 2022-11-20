const fs = require("fs");
const {Client} = require("pg");

async function main()
{
	let img_front =
	[
		"./book_images/f1.jpg",
		"./book_images/f2.jpg",
		"./book_images/f3.jpg",
		"./book_images/f4.jpg",
		"./book_images/f5.jpg",
		"./book_images/f6.jpg",
		"./book_images/f7.jpg",
		"./book_images/f8.jpg",
		"./book_images/f9.jpg",
		"./book_images/f10.jpg",
	];

	let index = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

	let client = new Client
	({
		user: "postgres",
		host: "localhost",
		password: "123",
		database: "openlacandon",
		port: 5432
	});
	await client.connect();

	/**/
	let data = null;

	for (let i = 0; i < img_front.length; i++)
	{
		data = fs.readFileSync(img_front[i], null).toString("base64");
		await client.query(`UPDATE BOOK SET IMAGE_FRONT = (DECODE('${data}', 'base64')) WHERE ISBN = ${index[i]};`);
	}
	/**/

	await client.end();
}

main();
