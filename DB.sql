-- DATABASE
CREATE DATABASE OPENLACANDON
	WITH ENCODING='UTF8';

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
INSERT INTO CLIENT VALUES(DEFAULT, 'ANGEL', '123', 'angel.storres@alumnos.udg.mx', true, 2400, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, 'Mexico');
INSERT INTO CLIENT VALUES(DEFAULT, 'CHRISTIAN', '678', 'christian.delacruz1289@alumnos.udg.mx', false, 4300, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, 'Mexico');
INSERT INTO CLIENT VALUES(DEFAULT, 'DAMIAN', '567', 'angel.garcia9106@alumnos.udg.mx', true, 3200, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, 'Mexico');
INSERT INTO CLIENT VALUES(DEFAULT, 'STALIN', '123', 'stalin.mendoza7428@alumnos.udg.mx', true, 1600, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, 'Mexico');
INSERT INTO CLIENT VALUES(DEFAULT, 'MARIA', 'ABC56', 'maria.hernandez62@alumnos.udg.mx', false, 2800, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, 'Mexico');
INSERT INTO CLIENT VALUES(DEFAULT, 'JUAN', 'DFG12', 'juan.ramirez5412@alumnos.udg.mx', true, 5600, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, 'Mexico');
INSERT INTO CLIENT VALUES(DEFAULT, 'CARLA', 'FJS72', 'carla.aguilera34@alumnos.udg.mx', true, 5600, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, 'Mexico');

INSERT INTO CLIENT VALUES(DEFAULT, 'PEPE', 'JF63', 'pepe@alumnos.udg.mx', false, 2400, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, 'Chile');
INSERT INTO CLIENT VALUES(DEFAULT, 'CARLOS', 'SMX7', 'carlos@alumnos.udg.mx', true, 1200, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, 'Chile');
INSERT INTO CLIENT VALUES(DEFAULT, 'BRENDA', '4KD9', 'brenda@alumnos.udg.mx', false, 2300, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, 'Chile');
INSERT INTO CLIENT VALUES(DEFAULT, 'SOFIA', '1LMA', 'sofia@alumnos.udg.mx', true, 4900, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, 'Chile');

INSERT INTO CLIENT VALUES(DEFAULT, 'OMAR', 'DJ28', 'omar@alumnos.udg.mx', true, 7392, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, 'Argentina');
INSERT INTO CLIENT VALUES(DEFAULT, 'RICARDO', '0192', 'ricardo@alumnos.udg.mx', false, 1928, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, 'Argentina');
INSERT INTO CLIENT VALUES(DEFAULT, 'OSCAR', 'SLD8', 'oscar@alumnos.udg.mx', true, 4837, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, 'Argentina');
INSERT INTO CLIENT VALUES(DEFAULT, 'JESSICA', 'F93K', 'jessica@alumnos.udg.mx', true, 3295, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, 'Argentina');

-- BOOK TABLE
CREATE TABLE BOOK
(
	-- PRIMARY KEY
	ISBN SMALLSERIAL PRIMARY KEY NOT NULL,

	-- BOOK INFO
	TITLE VARCHAR(64) NOT NULL,
	AUTHOR VARCHAR(64) NOT NULL,
	RELEASE_DATE INTEGER NOT NULL,
	GENRE VARCHAR(64) DEFAULT NULL,
	SYNOPSIS VARCHAR(2048) DEFAULT NULL,
	RATING INTEGER DEFAULT 0 NOT NULL,
	IMAGE_FRONT BYTEA DEFAULT NULL,
	IMAGE_BACK BYTEA DEFAULT NULL
);

-- BOOK EXAMPLES
INSERT INTO BOOK VALUES(DEFAULT, 'The Martian Chronicles', 'Ray Bradbury', 1950, 'Ciencia ficción', 'Esta colección de relatos recoge la crónica de la colonización de Marte por parte de una humanidad que huye de un mundo al borde de la destrucción. Los colonos llevan consigo sus deseos más íntimos y el sueño de reproducir en el Planeta Rojo una civilización de perritos calientes, cómodos sofás y limonada en el porche al atardecer. Pero su equipaje incluye también los miedos ancestrales, que se traducen en odio a lo diferente, y las enfermedades que diezmarán a los marcianos.<br><br>Conforme a su concepción de lo que debe ser la ciencia ficción, Bradbury se traslada al futuro para iluminar el presente y explorar la naturaleza humana. Escritas en la década de los cuarenta, estas deslumbrantes e intensas historias constituyen un canto contra el racismo, la guerra y la censura, destilando nostalgia e idealismo.', 7);
INSERT INTO BOOK VALUES(DEFAULT, 'Cuento de hadas', 'Stephen King', 2022, 'Fantasia', 'Charlie Reade parece un estudiante de instituto normal y corriente, pero carga con un gran peso sobre los hombros. Cuando él solo tenía diez años, su madre fue víctima de un atropello y la pena empujó a su padre a la bebida. Aunque era demasiado joven, Charlie tuvo que aprender a cuidarse solo... y también a ocuparse de su padre.<br><br>Ahora, con diecisiete años, Charlie encuentra dos amigos inesperados: una perra llamada Radar y Howard Bowditch, su anciano dueño. El señor Bowditch es un ermitaño que vive en una colina enorme, en una casa enorme que tiene un cobertizo cerrado a cal y canto en el patio trasero. A veces, sonidos extraños emergen de él.<br><br>Mientras Charlie se encarga de hacer recados para el señor Bowditch, Radar y él se hacen inseparables. Cuando el anciano fallece, le deja al chico una cinta de casete que contiene una historia increíble y el gran secreto que Bowditch ha guardado durante toda su vida: dentro de su cobertizo existe un portal que conduce a otro mundo.', 6);
INSERT INTO BOOK VALUES(DEFAULT, 'Ubik', 'Philip K. Dick', 1969, 'Ciencia ficción', 'Glen Runciter está muerto. ¿O lo están todos los demás? Lo que es seguro es que alguien ha muerto en una explosión organizada por los competidores de Runciter. De hecho, sus empleados asisten a un funeral. Pero durante el duelo comienzan a recibir mensajes desconcertantes, e incluso morbosos, de su jefe. Y el mundo a su alrededor comienza a desmoronarse de un modo que sugiere que a ellos tampoco les queda mucho tiempo. Esta mordaz comedia metafísica de muerte y salvación (que podrá llevar en un cómodo envase) es un tour de force de amenaza paranoica y comedia absurda, en la cual los muertos ofrecen consejos comerciales, compran su siguiente reencarnación y corren el riesgo continuo de volver a morir.', 8);
INSERT INTO BOOK VALUES(DEFAULT, '¿Sueñan los androides con ovejas eléctricas?', 'Philip K. Dick', 1968, 'Ciencia ficción', 'En el año 2021 la guerra mundial ha exterminado a millones de personas. Los supervivientes codician cualquier criatura viva, y aquellos que no pueden permitirse pagar por ellas se ven obligados a adquirir réplicas increíblemente realistas. Las empresas fabrican incluso seres humanos. Rick Deckard es un cazarrecompensas cuyo trabajo es encontrar androides rebeldes y retirarlos, pero la tarea no será tan sencilla cuando tenga que enfrentarse a los nuevos modelos Nexus-6, prácticamente indistinguibles de los seres humanos.', 9);
INSERT INTO BOOK VALUES(DEFAULT, 'Fahrenheit 451', 'Ray Bradbury', 1953, 'Ciencia ficción', 'Fahrenheit 451. La temperatura a la que el papel se enciende y arde. Como 1984 de George Orwell, como Un mundo feliz de Aldous Huxley, Fahrenheit 451 describe una civilización occidental esclavizada por los media, los tranquilizantes y el conformismo.<br><br>La visión de Bradbury es asombrosamente profética: las pantallas de TV ocupan paredes y exhiben folletines interactivos, unos auriculares transmiten a todas horas una insípida corriente de música y noticias, en las avenidas los coches corren a 150 kilómetros por hora persiguiendo a peatones; y el cuerpo de bomberos auxiliado por el Sabueso Mecánico, rastrea y elimina a los disidentes que conservan y leen libros.', 7);

-- FORMAT TABLE
CREATE TABLE FORMAT
(
	-- PRIMARY KEY
	ID SMALLSERIAL PRIMARY KEY NOT NULL,

	-- FOREIGN KEY
	ISBN SMALLINT NOT NULL REFERENCES BOOK(ISBN)
		ON DELETE CASCADE
		ON UPDATE CASCADE,

	-- INFO
	PRICE_LIST REAL DEFAULT 0 NOT NULL,
	TYPE VARCHAR(64) DEFAULT 'Kindle' NOT NULL,
	PAGES INTEGER DEFAULT 0 NOT NULL,
	STOCK INTEGER DEFAULT -1 NOT NULL
);

-- FORMAT EXAMPLES
INSERT INTO FORMAT VALUES(DEFAULT, 1, 90, 'Kindle', 140, -1);
INSERT INTO FORMAT VALUES(DEFAULT, 1, 265, 'Pasta blanda', 120, 55);
INSERT INTO FORMAT VALUES(DEFAULT, 1, 640, 'Pasta dura', 175, 30);

INSERT INTO FORMAT VALUES(DEFAULT, 2, 140, 'Kindle', 140, -1);
INSERT INTO FORMAT VALUES(DEFAULT, 2, 315, 'Pasta blanda', 145, 35);
INSERT INTO FORMAT VALUES(DEFAULT, 2, 440, 'Pasta dura', 120, 50);

INSERT INTO FORMAT VALUES(DEFAULT, 3, 50, 'Kindle', 140, -1);
INSERT INTO FORMAT VALUES(DEFAULT, 3, 230, 'Pasta blanda', 440, 5);
INSERT INTO FORMAT VALUES(DEFAULT, 3, 375, 'Pasta dura', 320, 15);

INSERT INTO FORMAT VALUES(DEFAULT, 4, 120, 'Kindle', 385, -1);

-- ORDER TABLE
CREATE TABLE ORD
(
	-- PRIMARY KEY
	ID SMALLSERIAL PRIMARY KEY NOT NULL,

	-- FOREIGN KEY
	ID_CLIENT SMALLINT NOT NULL REFERENCES CLIENT(ID)
		ON DELETE CASCADE
		ON UPDATE CASCADE,

	-- INFO
	DATE_ORDER DATE DEFAULT NOW() NOT NULL,
	DATE_DELIVERY DATE NOT NULL
);

-- ORDER EXAMPLES
INSERT INTO ORD VALUES(DEFAULT, 1, DEFAULT, '2022-12-29');
INSERT INTO ORD VALUES(DEFAULT, 1, DEFAULT, '2022-12-29');

-- ORDER_DETAIL TABLE
CREATE TABLE ORD_DETAIL
(
	-- PRIMARY KEY
	ID SMALLSERIAL PRIMARY KEY NOT NULL,

	-- FOREIGN KEY
	ID_ORDER SMALLINT NOT NULL REFERENCES ORD(ID)
		ON DELETE CASCADE
		ON UPDATE CASCADE,

	ID_FORMAT SMALLINT NOT NULL REFERENCES FORMAT(ID)
		ON DELETE CASCADE
		ON UPDATE CASCADE,

	-- INFO
	PRICE_SOLD REAL NOT NULL,
	AMOUNT INTEGER NOT NULL
);

-- ORDER_DETAIL EXAMPLES
INSERT INTO ORD_DETAIL VALUES(DEFAULT, 1, 5, (SELECT PRICE_LIST FROM FORMAT WHERE ID = 5), 2);

-- SUPPLIER TABLE
CREATE TABLE SUPPLIER
(
	-- PRIMARY KEY
	ID SMALLSERIAL PRIMARY KEY NOT NULL,

	-- SUPPLIER INFO
	FIRST_NAME VARCHAR(64) NOT NULL,
	LAST_NAME VARCHAR(64) NOT NULL,
	TEL BIGINT DEFAULT NULL,

	-- ADDRESS INFO
	ADDRESS VARCHAR(128) DEFAULT NULL,
	CITY VARCHAR(64) DEFAULT NULL,
	ZIP INTEGER DEFAULT NULL,
	COUNTRY VARCHAR(64) DEFAULT NULL
);

-- SUPPLIER EXAMPLES
INSERT INTO SUPPLIER VALUES(DEFAULT, 'Juan', 'Perez', 3322554477);

-- PURCHASE TABLE
CREATE TABLE PURCHASE
(
	-- PRIMARY KEY
	ID SMALLSERIAL PRIMARY KEY NOT NULL,

	-- FOREIGN KEY
	ID_SUPPLIER SMALLINT NOT NULL REFERENCES SUPPLIER(ID)
		ON DELETE CASCADE
		ON UPDATE CASCADE,

	-- INFO
	DATE_PURCHASE DATE DEFAULT NOW() NOT NULL
);

-- PURCHASE EXAMPLES
INSERT INTO PURCHASE VALUES(DEFAULT, 1, DEFAULT);

-- PURCHASE_DETAIL TABLE
CREATE TABLE PURCHASE_DETAIL
(
	-- PRIMARY KEY
	ID SMALLSERIAL PRIMARY KEY NOT NULL,

	-- FOREIGN KEY
	ID_PURCHASE SMALLINT NOT NULL REFERENCES PURCHASE(ID)
		ON DELETE CASCADE
		ON UPDATE CASCADE,

	ID_FORMAT SMALLINT NOT NULL REFERENCES FORMAT(ID)
		ON DELETE CASCADE
		ON UPDATE CASCADE,

	-- INFO
	PRICE_PURCHASE REAL NOT NULL,
	AMOUNT INTEGER NOT NULL
);

-- PURCHASE_DETAIL EXAMPLES
INSERT INTO PURCHASE_DETAIL VALUES(DEFAULT, 1, 3, 140, 25);
INSERT INTO PURCHASE_DETAIL VALUES(DEFAULT, 1, 3, 140, 5);

-- VIEWS
CREATE VIEW BOOK_TITLE_FORMAT AS
SELECT B.ISBN, B.TITLE, F.ID
FROM BOOK B INNER JOIN FORMAT F
ON B.ISBN = F.ISBN;

CREATE VIEW BOOK_TITLE_ORDER AS
SELECT B.ISBN, B.TITLE, F.ID AS FORMAT_ID, OD.ID as DETAIL_ID
FROM BOOK B INNER JOIN FORMAT F
ON B.ISBN = F.ISBN
INNER JOIN ORD_DETAIL OD
ON F.ID = OD.ID_FORMAT;

CREATE VIEW FORMAT_TYPE_ORDER AS
SELECT F.ID AS FORMAT_ID, F.TYPE, OD.ID AS DETAIL_ID
FROM FORMAT F INNER JOIN ORD_DETAIL OD
ON F.ID = OD.ID_FORMAT;