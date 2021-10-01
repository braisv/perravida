const database = require('../lib/db');
const southerUsersApi = require('../services/southernUsersApi');
const apiResponse = require('../lib/apiResponse');
const checkParams = require('../utils/checkParams');
const geoLocation = require('../utils/geoLocation')

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

const getUserById = async (req, res) => {
	console.log('/users/:id = GET ONE USER');
	console.log('METHOD: ', req.method);
	console.log('PATH: ', req.originalUrl);
	console.log('PARAMS: ', req.params);
	console.log('BODY: ', req.body);
	const db = await database.getClient();
	const id = req.params.id;
	if (isNaN(+id)) return apiResponse.validationFailure(res, 'El parámetro de id introducido debe ser un número entero.')
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

const addUser = async (req, res) => {
	console.log('/users/ = ADD USER');
	console.log('METHOD: ', req.method);
	console.log('PATH: ', req.originalUrl);
	console.log('PARAMS: ', req.params);
	console.log('BODY: ', req.body);
	const db = await database.getClient();
	try {
		if (!checkParams.validation(req.body)) 
			return apiResponse.validationFailure(res, 'Es obligatoria la inserción correcta de los parámetros username, email, password, language, longitude y latitude.');
		const { username, email, password, language, longitude, latitude } = req.body
		const sql = `
			INSERT INTO users (username, email, password, language, longitude, latitude) 
			VALUES (?, ?, ?, ?, ?, ?);
		`;
		const values = [username, email, password, language, longitude, latitude];
		const userGeoLocation = await geoLocation.isSouthOrNorth(latitude, longitude);
        const newUser = userGeoLocation === 'N' ? 
			await db.run(sql, values) :
			await southerUsersApi.insertUser(req.body);
		if (!newUser) return apiResponse.failure(res, 'Error en la comunicación con la API.', err);
		console.log({ response: newUser })
		console.log({ newUser: { ...req.body, geoLocation: userGeoLocation } })
		return apiResponse.success(res, 'Operación realizada con éxito.');
	} catch (err) {
		console.log('CATCH ADD USER', err)
		if (err.errno === 19) return apiResponse.validationFailure(res, 'El email introducido ya existe en nuesta base de datos.', err);
		return apiResponse.failure(res, 'Error en la comunicación con la API.', err);
	}
};

const updateUser = async (req, res) => {
	console.log('/users/ = POST USER');
	console.log('METHOD: ', req.method);
	console.log('PATH: ', req.originalUrl);
	console.log('PARAMS: ', req.params);
	console.log('BODY: ', req.body);
	const db = await database.getClient();
	try {
		const { id, username, email, password, language, longitude, latitude } = req.body
		if (!checkParams.validation(req.body) || isNaN(+id)) 
			return apiResponse.validationFailure(res, 'Es obligatoria la inserción correcta de los parámetros id, username, email, password, language, longitude y latitude.');
		const sql = `
			UPDATE users
			SET username = ?, email = ?, password = ?, language = ?, longitude = ?, latitude = ?
			WHERE id = ?;
		`;
		const values = [username, email, password, language, longitude, latitude, id];
		const userGeoLocation = await geoLocation.isSouthOrNorth(latitude, longitude);
        const updateUser = userGeoLocation === 'N' ? 
			await db.run(sql, values) :
			await southerUsersApi.updateUser(req.body);
		if (!updateUser) return apiResponse.failure(res, 'Error en la comunicación con la API.', err);
		if (updateUser.changes === 0) return apiResponse.notFound(res, 'No existe ningún usuario con la id proporcionada.');
		console.log({ response: updateUser })
		console.log({ updateUser: { ...req.body, geoLocation: userGeoLocation } })
		return apiResponse.success(res, 'Operación realizada con éxito.');
	} catch (err) {
		console.log('CATCH UPDATE USER', err)
		return apiResponse.failure(res, 'Error en la comunicación con la API.', err);
	}
};

const deleteUser = async (req, res) => {
	const db = await database.getClient();
	res.setHeader("Access-Control-Allow-Origin", "*");
	console.log('DELETE 1 USER')
	try {
		const id = req.params.id
		const sql = `
		DELETE 
		FROM users
		WHERE id = ${id};`;
		// const values = [username, email, password, id];
        const query = await db.run(sql);
		console.log({ userDeleted: query })
		res.json(query);
	} catch (err) {
		console.log('CATCH DELETE USER')
		return console.error(err.message);
	}
};

module.exports = {
	getAllUsers,
	getUserById,
	addUser,
	updateUser,
	deleteUser
  };