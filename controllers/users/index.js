const { getAllUsers } = require('./getAll');
const { getUserById } = require('./getOne');
const { addUser } = require('./addOne');
const { updateUser } = require('./updateOne');
const { deleteUser } = require('./deleteOne');

module.exports = {
	getAllUsers,
	getUserById,
	addUser,
	updateUser,
	deleteUser
};