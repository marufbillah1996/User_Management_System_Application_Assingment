CREATE TABLE "user"(
	userid SERIAL PRIMARY KEY,
	username VARCHAR(40) NOT NULL,
	firstname VARCHAR(30) NOT NULL,
	lastname VARCHAR(30) NOT NULL,
	fullname VARCHAR(50) NOT NULL,
	gender VARCHAR(10) NOT NULL,
	address VARCHAR(200) NOT NULL,
	password VARCHAR(200) NOT NULL,
	dateofbirth DATE NOT NULL,
	email VARCHAR(100) NOT NULL,
	phone VARCHAR(100) NOT NULL,
	picture VARCHAR(200) NULL
)