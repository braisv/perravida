const database = require('../../lib/db');
const southerUsersApi = require('../../services/southernUsersApi');
const apiResponse = require('../../lib/apiResponse');

const getUserById = async (req, res) => {
	console.log('/users/:id = GET ONE USER');
	console.log('METHOD: ', req.method);
	console.log('PATH: ', req.originalUrl);
	console.log('PARAMS: ', req.params);
	console.log('BODY: ', req.body);
	const db = await database.getClient();
	const id = req.params.id;
	if (isNaN(+id)) return apiResponse.validationFailure(res, 'El parámetro de id introducido debe ser un número entero.');
	try {
		const sql = `
			SELECT * 
			FROM users u
			WHERE u.id = ${id}
		`;
        const northUser = await db.all(sql);
		console.log({ northUser });
		const southUser = await southerUsersApi.getUser(id);
		console.log({ southUser });
		if ((!northUser || northUser.length < 1) && !southUser) return apiResponse.notFound(res, 'No existe ningún usuario con la id proporcionada.');
		const user = northUser[0] || southUser;
		return apiResponse.success(res, 'Operación realizada con éxito.', user);
	} catch (err) {
		console.log('CATCH GET ONE USER', err)
		return apiResponse.failure(res, 'Error en la comunicación con la API.', err);
	}
};

module.exports = {
	getUserById
};