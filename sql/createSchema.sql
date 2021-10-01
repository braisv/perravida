create table if not exists "users" (
  "id"	INTEGER,
	"username"	TEXT NOT NULL,
	"email"	TEXT NOT NULL UNIQUE,
	"password"	TEXT NOT NULL,
	"language"	TEXT NOT NULL,
	"longitude"	REAL NOT NULL,
	"latitude"	REAL NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE `friends` (
  `userId1` INTEGER NOT NULL,
  `userId2` INTEGER NOT NULL,
  PRIMARY KEY (`userId1`,`userId2`),
  FOREIGN KEY (`userId1`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  FOREIGN KEY (`userId2`) REFERENCES `users` (`id`) ON UPDATE CASCADE
);

insert into users values 
(1, 'Pedro', 'pedro@email.com', '123456', 'es-ES', -8.71245, 42.2314), 
(2, 'Helena', 'helena@email.com', '123456', 'es-ES', -6.3452, 32.4232), 
(3, 'Eve', 'eve@gmail.com', '123456', 'en-EN', 1.2423, 15.3563),
(4, 'Gerard', 'gerard@email.com', '123456', 'fr-FR', 1.71245, 28.2314), 
(5, 'Annie', 'annie@email.com', '123456', 'de-DE', 26.3452, 22.4232), 
(6, 'Tim', 'tim@gmail.com', '123456', 'en-EN', -118.2423, 34.3563),
(7, 'Paula', 'paula@email.com', '123456', 'es-ES', -8.71245, 42.2314), 
(8, 'Pepita', 'pepitaa@email.com', '123456', 'es-ES', -6.3452, 32.4232), 
(9, 'Arnold', 'arnold@gmail.com', '123456', 'en-EN', 1.2423, 15.3563),
(10, 'Jean Claude', 'jclaude@email.com', '123456', 'fr-FR', 1.71245, 28.2314), 
(11, 'Bert', 'bert@email.com', '123456', 'de-DE', 26.3452, 22.4232), 
(12, 'Melissa', 'melissa@gmail.com', '123456', 'en-EN', -118.2423, 34.3563);

insert into friends values 
(1, 2), 
(1, 3),
(1, 5),
(2, 5),
(2, 10),
(3, 12),
(3, 9),
(3, 7),
(3, 8),
(4, 8),
(4, 11),
(5, 6),
(6, 10),
(6, 12),
(7, 9);