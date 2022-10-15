-- DATABASE
CREATE DATABASE OPENLACANDON
	WITH
	OWNER = postgres
	ENCODING = 'UTF8'
	LC_COLLATE = 'en_US.utf8'
	LC_CTYPE = 'en_US.utf8'
	TABLESPACE = pg_default
	CONNECTION LIMIT = -1
	TEMPLATE template0;


-- CLIENT TABLE
CREATE TABLE CLIENT
(
	-- PRIMARY KEY
	ID SMALLSERIAL PRIMARY KEY NOT NULL,

	-- ACCOUNT INFO
	USERNAME VARCHAR(64) UNIQUE NOT NULL,
	PASSWORD VARCHAR(64) NOT NULL,
	EMAIL VARCHAR(64) UNIQUE NOT NULL,
	PLUS BOOL DEFAULT FALSE,
	WALLET_BALANCE INTEGER DEFAULT 0,

	-- USER INFO
	FIRST_NAME VARCHAR(64) DEFAULT NULL,
	LAST_NAME VARCHAR(64) DEFAULT NULL,
	TEL BIGINT DEFAULT NULL,

	-- ADDRESS INFO
	ADDRESS VARCHAR(128) DEFAULT NULL,
	CITY VARCHAR(64) DEFAULT NULL,
	ZIP INTEGER DEFAULT NULL,
	COUNTRY VARCHAR(64) DEFAULT NULL
);

-- CLIENT EXAMPLES
INSERT INTO CLIENT VALUES(DEFAULT, 'ANGEL', '123', 'angel.storres@alumnos.udg.mx');
INSERT INTO CLIENT VALUES(DEFAULT, 'CHRISTIAN', '678', 'christian.delacruz1289@alumnos.udg.mx');
INSERT INTO CLIENT VALUES(DEFAULT, 'DAMIAN', '567', 'angel.garcia9106@alumnos.udg.mx');
INSERT INTO CLIENT VALUES(DEFAULT, 'STALIN', '123', 'stalin.mendoza7428@alumnos.udg.mx');

-- BOOK TABLE
CREATE TABLE BOOK
(
	-- PRIMARY KEY
	ISBN SMALLSERIAL PRIMARY KEY NOT NULL,

	-- BOOK INFO
	TITLE VARCHAR(64) NOT NULL,
	AUTHOR VARCHAR(64) NOT NULL,
	GENRE VARCHAR(64) DEFAULT NULL,
	SYNOPSIS VARCHAR(2048) DEFAULT NULL,
	RATING SMALLINT DEFAULT 0 NOT NULL,
	IMAGE_FRONT BYTEA DEFAULT NULL,
	IMAGE_BACK BYTEA DEFAULT NULL
);

-- BOOK EXAMPLES
INSERT INTO BOOK VALUES(DEFAULT, 'The Martian Chronicles', 'Ray Bradbury', 'Ciencia ficción', 'In The Martian Chronicles, Ray Bradbury, Americas preeminent storyteller, imagines a place of hope, dreams, and metaphor-- of crystal pillars and fossil seas--where a fine dust settles on the great empty cities of a vanished, devastated civilization. Earthmen conquer Mars and then are conquered by it, lulled by dangerous lies of comfort and familiarity, and enchanted by the lingering glamour of an ancient, mysterious native race. In this classic work of fiction, Bradbury exposes our ambitions, weaknesses, and ignorance in a strange and breathtaking world where man does not belong.', 7);

INSERT INTO BOOK VALUES(DEFAULT, 'Fairy Tale', 'Stephen King', 'Terror', 'Legendary storyteller Stephen King goes into the deepest well of his imagination in this spellbinding novel about a seventeen-year-old boy who inherits the keys to a parallel world where good and evil are at war, and the stakes could not be higher--for that world or ours.<br>Charlie Reade looks like a regular high school kid, great at baseball and football, a decent student. But he carries a heavy load. His mom was killed in a hit-and-run accident when he was seven, and grief drove his dad to drink. Charlie learned how to take care of himself--and his dad. When Charlie is seventeen, he meets a dog named Radar and her aging master, Howard Bowditch, a recluse in a big house at the top of a big hill, with a locked shed in the backyard. Sometimes strange sounds emerge from it.<br>Charlie starts doing jobs for Mr. Bowditch and loses his heart to Radar. Then, when Bowditch dies, he leaves Charlie a cassette tape telling a story no one would believe. What Bowditch knows, and has kept secret all his long life, is that inside the shed is a portal to another world.<br>Kings storytelling in Fairy Tale soars. This is a magnificent and terrifying tale in which good is pitted against overwhelming evil, and a heroic boy--and his dog--must lead the battle.<br>Early in the Pandemic, King asked himself: What could you write that would make you happy?<br>As if my imagination had been waiting for the question to be asked, I saw a vast deserted city--deserted but alive. I saw the empty streets, the haunted buildings, a gargoyle head lying overturned in the street. I saw smashed statues (of what I didnt know, but I eventually found out). I saw a huge, sprawling palace with glass towers so high their tips pierced the clouds. Those images released the story I wanted to tell.', 6);

INSERT INTO BOOK VALUES(DEFAULT, 'Harry Potter and the Sorcerers Stone', 'J.K Rowling');
INSERT INTO BOOK VALUES(DEFAULT, 'The Divine Comedy', 'Dante Alighieri');

-- FORMAT TABLE
CREATE TABLE FORMAT
(
	-- PRIMARY KEY
	ID SMALLSERIAL PRIMARY KEY NOT NULL,

	-- FOREIGN KEY
	ISBN SMALLINT REFERENCES BOOK(ISBN) NOT NULL,

	-- INFO
	PRICE_LIST MONEY DEFAULT 0 NOT NULL,
	TYPE VARCHAR(64) DEFAULT 'Kindle' NOT NULL,
	PAGES SMALLINT DEFAULT 0 NOT NULL,
	STOCK SMALLINT DEFAULT -1 NOT NULL
);

-- FORMAT EXAMPLES
INSERT INTO FORMAT VALUES(DEFAULT, 1, 90, 'Kindle', 140, -1);
INSERT INTO FORMAT VALUES(DEFAULT, 1, 265, 'Pasta blanda', 120, 55);
INSERT INTO FORMAT VALUES(DEFAULT, 1, 640, 'Pasta dura', 175, 30);
INSERT INTO FORMAT VALUES(DEFAULT, 2, 250, 'Kindle', 234, -1);
INSERT INTO FORMAT VALUES(DEFAULT, 2, 460, 'Pasta blanda', 340, 70);
INSERT INTO FORMAT VALUES(DEFAULT, 2, 620, 'Pasta dura', 280, 45);
INSERT INTO FORMAT VALUES(DEFAULT, 3, 370, 'Pasta dura', 490, 90);
INSERT INTO FORMAT VALUES(DEFAULT, 4, 120, 'Kindle', 385, -1);

-- ORDER TABLE
CREATE TABLE ORD
(
	-- PRIMARY KEY
	ID SMALLSERIAL PRIMARY KEY NOT NULL,

	-- FOREIGN KEY
	ID_CLIENT SMALLINT REFERENCES CLIENT(ID) NOT NULL,

	-- INFO
	DATE_ORDER DATE DEFAULT NOW() NOT NULL,
	DATE_DELIVERY DATE NOT NULL
);

-- ORDER EXAMPLES
INSERT INTO ORD VALUES(DEFAULT, 1, DEFAULT, '2022-09-29');
