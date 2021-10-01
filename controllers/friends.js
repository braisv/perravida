const database = require('../lib/db');
const southerUsersApi = require('../services/southernUsersApi');
const apiResponse = require('../lib/apiResponse');

const getUserFriends = async (req, res) => {
	const db = await database.getClient();
	console.log('/friends/:id = GET USER FRIENDS');
	console.log('METHOD: ', req.method);
	console.log('PATH: ', req.originalUrl);
	console.log('PARAMS: ', req.params);
	console.log('BODY: ', req.body);
	try {
		const id = req.params.id
		if (isNaN(+id)) return apiResponse.validationFailure(res, 'El parámetro de id introducido debe ser un número entero.')
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

const getUserFriendsCount = async (req, res) => {
	const db = await database.getClient();
	console.log('/friends/:id/count = GET USER FRIENDS');
	console.log('METHOD: ', req.method);
	console.log('PATH: ', req.originalUrl);
	console.log('PARAMS: ', req.params);
	console.log('BODY: ', req.body);
	try {
		const id = req.params.id
		if (isNaN(+id)) return apiResponse.validationFailure(res, 'El parámetro de id introducido debe ser un número entero.')
		const sql = `
			SELECT COUNT(*) count
			FROM friends f
			JOIN users u
			ON u.id = f.userId1
			WHERE f.userId2 = ${id}
			UNION
			SELECT COUNT(*) count
			FROM friends f
			JOIN users u
			ON u.id = f.userId2
			WHERE f.userId1 = ${id}
		`;
		const response = await db.all(sql);
		console.log({ northUsers: response });
		if (!response) return apiResponse.notFound(res, 'La API no ha podido completar su petición. Por favor, inténtelo de nuevo más tarde.')
		const southApiResponse = await southerUsersApi.getUserFriendsCount(id);
		console.log({ southUsers: southApiResponse })
		let friends = (southApiResponse || 0) + response.reduce((a,b) => a + b.count, 0) 
		console.log({ friends });
		//if (!response || !southApiResponse) return res.status(424).json(friends);
		return apiResponse.success(res, 'Operación realizada con éxito.', friends || 0)
	} catch (err) {
		console.error('CATCH GET USER FRIENDS', err);
		return apiResponse.failure(res, 'Error en la comunicación con la API.', err);
	}
};

module.exports = {
	getUserFriends,
	getUserFriendsCount
  };