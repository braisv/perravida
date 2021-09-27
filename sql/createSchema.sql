CREATE TABLE "friends" (
	"id"	INTEGER,
	"userId"	INTEGER NOT NULL,
	"friendId"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);

create table if not exists "users" (
	"id"	INTEGER,
	"username"	TEXT NOT NULL,
	"email"	TEXT NOT NULL UNIQUE,
	"password"	TEXT NOT NULL,
	"friendIds"	INTEGER,
	FOREIGN KEY("friendIds") REFERENCES "friends"("userId"),
	PRIMARY KEY("id" AUTOINCREMENT)
);


insert into friends values (1, 1, 2), (2, 1, 3), (3, 2, 3), (4, 3, 2), (5, 2, 1), (6, 3, 1);
insert into users values (1, 'user', 'ee', 'ee', 1), (2, 'user2', 'rr', 'rr', 2), (3, 'user3', 'ff', 'ff', 3);