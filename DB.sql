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
INSERT INTO BOOK VALUES(DEFAULT, 'Don Quijote de la Mancha', 'Miguel de Cervantes', 1605, 'Sátira', 'Hace diez años la Asociación de Academias de la Lengua Española pensó este Quijote para todos. Hoy se reedita -en edición limitada- para conmemorar los 400 años de la muerte de su autor. Como ocurrió hace más de una década, las Academias de la Lengua Española y el sello Alfaguara se unen a esta celebración con la reedición de este clásico universal, que llevaba siete años fuera de las librerías. Esta edición reproduce el texto crítico y las notas de Francisco Rico, a la vez que suma un prólogo de Darío Villanueva, director de la Real Academia Española, escrito mente para la ocasión. Los años 2015 y 2016 conforman un bienio de aniversarios cervantinos. A la celebración del IV Centenario de la publicación de la segunda parte de Don Quijote (2015), le sigue, en 2016, la conmemoración del IV Centenario de la muerte de su autor, Miguel de Cervantes. Esta edición reproduce el texto crítico y las notas de Francisco Rico, a su vez coordinador del volumen, y se completa con estudios de escritores y filólogos de la talla de Mario Vargas Llosa, Francisco Ayala, Martín de Riquer, José Manuel Blecua, Guillermo Rojo, José Antonio Pascual, Margit Frenk y Claudio Guillén. Como novedad, la presente edición cuenta con un prólogo de Darío Villanueva, director de la Real Academia Española, escrito mente para la ocasión. La crítica ha dicho. "Lo considero un libro para el siglo XXI." -Mario Vargas Llosa- "Uno de los grandes acontecimientos literarios del año." -ABC- "El volumen tiene una sobria y elegante presentación y una cuidadísima realización." -José Andrés Rojo, El País-', 8);
INSERT INTO BOOK VALUES(DEFAULT, 'Alicia en el pais de las maravillas', 'Lewis Carroll', 1865, 'Fantasia', 'Estás a punto de entrar en el mundo de Alicia, el más extraño y asombroso, disparatado e insólito que hayas conocido y que jamás vas a olvidar. En este mundo, los gatos desaparecen sonrientes, las reinas tienen ejércitos de naipes, los conejos visten chaleco y te apremian para que los sigas. Y si los sigues, caerás por el agujero de su madriguera… Hasta el País de las Maravillas.Allí, las reglas que conocemos no funcionan; en el País de las Maravillas todo tiene su propia lógica. La hora del té no acaba nunca, Tiempo es un señor que se enfada si no sigues el compás cuando cantas y las lágrimas pueden llegar a formar un mar si justo en aquel momento tu cuerpo se encoge hasta ser diminuto. Desde su publicación, Alicia en el país de las maravillas ha fascinado a lectores como tú.', 9);
INSERT INTO BOOK VALUES(DEFAULT, 'El señor de los Anillos', 'J. R. R. Tolkien', 1954, 'Fantasia', 'En la adormecida e idílica Comarca, un joven hobbit recibe un encargo: custodiar el Anillo Único y emprender el viaje para su destrucción en la Grieta del Destino. Acompañado por magos, hombres, elfos y enanos, atravesará la Tierra Media y se internará en las sombras de Mordor, perseguido siempre por las huestes de Sauron, el Señor Oscuro, dispuesto a recuperar su creación para establecer el dominio definitivo del Mal.', 7);
INSERT INTO BOOK VALUES(DEFAULT, 'Cien años de soledad', 'Gabriel García Márquez', 1967, 'Novela', 'Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo. Macondo era entonces una aldea de veinte casas de barro y cañabrava construidas a la orilla de un río de aguas diáfanas que se precipitaban por un lecho de piedras pulidas, blancas y enormes como huevos prehistóricos. El mundo era tan reciente, que muchas cosas carecían de nombre, y para mencionarlas había que señalarlas con el dedo.» Mito por derecho propio, saludada por sus lectores como la obra en español más importante después de la Biblia, Cien años de soledad cuenta la saga de la familia Buendía y su maldición, que castiga el matrimonio entre parientes dándoles hijos con cola de cerdo. Como un río desbordante, a lo largo de un siglo se entretejerán sus destinos por medio de sucesos maravillosos en el fantástico pueblo de Macondo, en una narración que es la cumbre indiscutible del realismo mágico y la literatura del boom. Alegoría universal, es también una visión de Latinoamérica y una parábola sobre la historia humana.', 5);
INSERT INTO BOOK VALUES(DEFAULT, 'Lo Que El Viento Se Llevo', 'Margaret Michell', 1936, 'Novela', 'Scarlett O''Hara vive en Tara, una gran plantación del estado sureño de Georgia, y está enamorada de Ashley Wilkes, que en breve contraerá matrimonio con Melanie Hamilton. Estamos en 1861, en los prolegómenos de la guerra de Secesión, y todos los jóvenes sureños muestran entusiasmo por entrar en combate, excepto el atractivo aventurero Rhett Butler. A Butler le gusta Scarlett, pero ésta sigue enamorada de Ashley, que acaba de hacer público su compromiso con Melanie. Despechada, Scarlett acepta la propuesta de matrimonio de Charles, el hermano de Melanie, al que desprecia. Años más tarde, y como consecuencia del final de la guerra, ya viuda, Scarlett debe afrontar situaciones nuevas como el hambre, el dolor y la pérdida e instalarse en Atlanta, donde Melanie espera noticias de Ashley y Butler aparece de nuevo...', 10);

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
INSERT INTO FORMAT VALUES(DEFAULT, 4, 220, 'Pasta blanda', 290, 10);
INSERT INTO FORMAT VALUES(DEFAULT, 4, 310, 'Pasta dura', 210, 15);

INSERT INTO FORMAT VALUES(DEFAULT, 5, 183, 'Kindle', 300, -1);
INSERT INTO FORMAT VALUES(DEFAULT, 5, 296, 'Pasta blanda', 324, 45);
INSERT INTO FORMAT VALUES(DEFAULT, 5, 392, 'Pasta dura', 245, 34);

INSERT INTO FORMAT VALUES(DEFAULT, 6, 583, 'Kindle', 435, -1);
INSERT INTO FORMAT VALUES(DEFAULT, 6, 329, 'Pasta blanda', 212, 65);
INSERT INTO FORMAT VALUES(DEFAULT, 6, 195, 'Pasta dura', 345, 34);

INSERT INTO FORMAT VALUES(DEFAULT, 7, 286, 'Kindle', 537, -1);
INSERT INTO FORMAT VALUES(DEFAULT, 7, 649, 'Pasta blanda', 456, 76);
INSERT INTO FORMAT VALUES(DEFAULT, 7, 359, 'Pasta dura', 348, 34);

INSERT INTO FORMAT VALUES(DEFAULT, 8, 357, 'Kindle', 293, -1);
INSERT INTO FORMAT VALUES(DEFAULT, 8, 453, 'Pasta blanda', 345, 54);
INSERT INTO FORMAT VALUES(DEFAULT, 8, 742, 'Pasta dura', 120, 12);

INSERT INTO FORMAT VALUES(DEFAULT, 9, 456, 'Kindle', 235, -1);
INSERT INTO FORMAT VALUES(DEFAULT, 9, 323, 'Pasta blanda', 192, 5);
INSERT INTO FORMAT VALUES(DEFAULT, 9, 543, 'Pasta dura', 345, 43);

INSERT INTO FORMAT VALUES(DEFAULT, 10, 313, 'Kindle', 192, -1);
INSERT INTO FORMAT VALUES(DEFAULT, 10, 534, 'Pasta blanda', 120, 12);
INSERT INTO FORMAT VALUES(DEFAULT, 10, 187, 'Pasta dura', 90, 65);

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

-- TRIGGERS

--* UPDATE CLIENT WALLET --*
CREATE OR REPLACE FUNCTION update_client_wallet()
	RETURNS trigger AS
$$
DECLARE
	id_client SMALLINT := 0;
BEGIN
	SELECT C.ID
	INTO id_client
	FROM CLIENT C INNER JOIN ORD O
	ON C.ID = O.ID_CLIENT
	INNER JOIN ORD_DETAIL OD
	ON OD.ID_ORDER = O.ID_CLIENT
	WHERE OD.ID = 1
	LIMIT 1;

	UPDATE CLIENT
	SET WALLET_BALANCE = ((SELECT WALLET_BALANCE FROM CLIENT WHERE ID = id_client) - (NEW.AMOUNT * NEW.PRICE_SOLD))
	WHERE ID = id_client;

	IF ((SELECT TYPE FROM FORMAT WHERE ID = NEW.ID_FORMAT) != 'Kindle') THEN
		UPDATE FORMAT
		SET STOCK = ((SELECT STOCK FROM FORMAT WHERE ID = NEW.ID_FORMAT) - (NEW.AMOUNT))
		WHERE ID = NEW.ID_FORMAT;
	END IF;

	RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE TRIGGER t_update_client_wallet
	AFTER INSERT
	ON ORD_DETAIL
	FOR EACH ROW
	EXECUTE PROCEDURE update_client_wallet();

--* UPDATE FORMAT STOCK *--
CREATE OR REPLACE FUNCTION update_format_stock()
	RETURNS trigger AS
$$
DECLARE
	id_format SMALLINT := NEW.ID_FORMAT;
BEGIN

	IF ((SELECT TYPE FROM FORMAT WHERE ID = id_format) != 'Kindle') THEN
		UPDATE FORMAT
		SET STOCK = ((SELECT STOCK FROM FORMAT WHERE ID = id_format) + NEW.AMOUNT)
		WHERE ID = id_format;
	END IF;

	RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE TRIGGER t_update_format_stock
	AFTER INSERT
	ON PURCHASE_DETAIL
	FOR EACH ROW
	EXECUTE PROCEDURE update_format_stock();

--* CLIENT PLUS BONUS *--
CREATE OR REPLACE FUNCTION client_plus_bonus()
	RETURNS trigger AS
$$
DECLARE
	id_client SMALLINT := NEW.ID;
BEGIN

	IF (SELECT PLUS FROM CLIENT WHERE ID = id_client) THEN
		UPDATE CLIENT
		SET WALLET_BALANCE = ((SELECT WALLET_BALANCE FROM CLIENT WHERE ID = id_client) + 3500)
		WHERE ID = id_client;
	END IF;

	RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE TRIGGER t_client_plus_bonus
	AFTER INSERT
	ON CLIENT
	FOR EACH ROW
	EXECUTE PROCEDURE client_plus_bonus();