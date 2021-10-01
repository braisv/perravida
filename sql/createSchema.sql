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
  FOREIGN KEY (`userId1`) REFERENCES `users` (`id`),
  FOREIGN KEY (`userId2`) REFERENCES `users` (`id`)
);

insert into users values (1, 'user', 'ee', 'ee', 'es', 12.4334, 5.3451), (2, 'user2', 'rr', 'rr', 'en', 6.3452, 12.4232), (3, 'user3', 'ff', 'ff', 'gl', 45.2423, 85.3563);
insert into friends values (1, 2), (1, 3);