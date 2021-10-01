const database = require('../../lib/db');
const southerUsersApi = require('../../services/southernUsersApi');
const apiResponse = require('../../lib/apiResponse');

const deleteUser = async (req, res) => {
	console.log('/users/:id = DELETE USER');
	console.log('METHOD: ', req.method);
	console.log('PATH: ', req.originalUrl);
	console.log('PARAMS: ', req.params);
	console.log('BODY: ', req.body);
	const db = await database.getClient();
	const id = req.params.id;
	if (isNaN(+id)) return apiResponse.validationFailure(res, 'El parámetro de id introducido debe ser un número entero.');
	try {
		const sql = `
		DELETE 
		FROM users
		WHERE id = ${id};`;
		const northUserDelete = await db.run(sql);
		console.log({ northUserDelete });
		const southUserDelete = await southerUsersApi.getUser(id);
		console.log({ southUserDelete });
		if ((!northUserDelete || northUserDelete && northUserDelete.changes === 0) && !southUserDelete) return apiResponse.notFound(res, 'No existe ningún usuario con la id proporcionada.');
		const deleteUser = northUserDelete || southUserDelete;
		console.log({ response: deleteUser })
		return apiResponse.success(res, 'Operación realizada con éxito.');
	} catch (err) {
		console.log('CATCH DELETE USER', err)
		return apiResponse.failure(res, 'Error en la comunicación con la API.', err);
	}
};

module.exports = {
	deleteUser
  };