const southerUsersApi = require('../services/southernUsersApi');

const searchUser = async (db, id) => {
	const sql = `
		SELECT * 
		FROM users u
		WHERE u.id = ${id}
	`;
	const northUser = await db.all(sql);
	const southUser = await southerUsersApi.getUser(id);
	const user = northUser && northUser[0] || southUser;
	console.log({ user });
	return user;
};

module.exports = {
	searchUser
}