const database = require('../../lib/db');
const southerUsersApi = require('../../services/southernUsersApi');
const apiResponse = require('../../lib/apiResponse');
const { searchUser } = require('../../utils/searchUser');

const getUserFriends = async (req, res) => {
	const db = await database.getClient();
	console.log('/friends/:id = GET USER FRIENDS');
	console.log('METHOD: ', req.method);
	console.log('PATH: ', req.originalUrl);
	console.log('PARAMS: ', req.params);
	console.log('BODY: ', req.body);
	try {
		const id = req.params.id;
		if (isNaN(+id)) return apiResponse.validationFailure(res, 'El parámetro de id introducido debe ser un número entero.');
		const user = await searchUser(db, id);
		if (!user) return apiResponse.notFound(res, 'No existe ningún usuario con la id proporcionada.');
		const sql = `
			SELECT u.username
			FROM friends f
			JOIN users u
			ON u.id = f.userId1
			WHERE f.userId2 = ${id}
			UNION
			SELECT u.username
			FROM friends f
			JOIN users u
			ON u.id = f.userId2
			WHERE f.userId1 = ${id}
		`;
		const response = await db.all(sql);
		console.log({ northUsers: response });
		if (!response) return apiResponse.notFound(res, 'La API no ha podido completar su petición. Por favor, inténtelo de nuevo más tarde.')
		const southApiResponse = await southerUsersApi.getUserFriends(id);
		console.log({ southUsers: southApiResponse })
		let friends = [
			...response && response.map(({ username }) => username) || [],
			...southApiResponse && southApiResponse ||[]
		]
		console.log({ friends });
		//if (!response || !southApiResponse) return res.status(424).json(friends);
		return apiResponse.success(res, 'Operación realizada con éxito.', friends)
	} catch (err) {
		console.error('CATCH GET USER FRIENDS', err);
		return apiResponse.failure(res, 'Error en la comunicación con la API.', err);
	}
};

module.exports = {
	getUserFriends
  };