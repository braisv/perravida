const database = require('../../lib/db');
const southerUsersApi = require('../../services/southernUsersApi');
const apiResponse = require('../../lib/apiResponse');

const getAllUsers = async (req, res) => {
	console.log('/users = GET ALL USERS');
	console.log('METHOD: ', req.method);
	console.log('PATH: ', req.originalUrl);
	console.log('PARAMS: ', req.params);
	console.log('BODY: ', req.body);
	const db = await database.getClient();
	try {
		const sql = `
		SELECT * 
		FROM users
		`;
        const northUsers = await db.all(sql);
		if (!northUsers) return apiResponse.notFound(res, 'La API no ha podido completar su petición. Por favor, inténtelo de nuevo más tarde.');
		console.log({ northUsers });
		const southUsers = await southerUsersApi.getAllUsers();
		console.log({ southUsers });
		let users = [
			...northUsers ||[],
			...southUsers || []
		]
		return apiResponse.success(res, 'Operación realizada con éxito.', users);
	} catch (err) {
		console.log('CATCH GET ALL USERS', err)
		return apiResponse.failure(res, 'Error en la comunicación con la API.', err);
	}
};

module.exports = {
	getAllUsers
};
