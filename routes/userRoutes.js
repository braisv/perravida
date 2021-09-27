const express = require('express');
const database = require('../lib/db')
const router  = express.Router();

router.get('/', async (req, res) => {
	const db = await database.getClient();
	console.log('GET ALL USERS')
	try {
		const sql = 'SELECT * FROM users';
        const query = await db.all(sql);
		console.log({ users: query })
		res.json(query);
	} catch (err) {
		console.log('CATCH GET ALL USERS')
		return console.error(err.message);
	}
});

router.get('/:id', async (req, res) => {
	const db = await database.getClient();
	const id = req.params.id
	console.log('GET 1 USER')
	try {
		const sql = `
			SELECT * 
			FROM users u
			JOIN friends f
			ON u.friendIds = f.userId
			WHERE u.id = ${id}
		`;
        const query = await db.all(sql);
		console.log({ user: query })
		res.json(query);
	} catch (err) {
		console.log('CATCH GET ALL USERS')
		return console.error(err.message);
	}
});

module.exports = router;