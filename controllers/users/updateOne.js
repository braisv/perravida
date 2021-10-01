const database = require('../../lib/db');
const southerUsersApi = require('../../services/southernUsersApi');
const apiResponse = require('../../lib/apiResponse');
const checkParams = require('../../utils/checkParams');
const geoLocation = require('../../utils/geoLocation');

const updateUser = async (req, res) => {
	console.log('/users/ = POST USER');
	console.log('METHOD: ', req.method);
	console.log('PATH: ', req.originalUrl);
	console.log('PARAMS: ', req.params);
	console.log('BODY: ', req.body);
	const db = await database.getClient();
	try {
		const { id, username, email, password, language, longitude, latitude } = req.body;
		// VALIDATE PARAMS
		if (!checkParams.validation(req.body) || isNaN(+id)) 
			return apiResponse.validationFailure(res, 'Es obligatoria la inserción correcta de los parámetros id, username, email, password, language, longitude y latitude.');
		// SEARCH USER
		const userToUpdate = await searchUser(db, id);
		if (!userToUpdate) return apiResponse.notFound(res, 'No existe ningún usuario con la id proporcionada.');
		// PARAMS NOT PROVIDED, KEEP OLD VALUE
		const values = [
			username || userToUpdate.username, 
			email || userToUpdate.email, 
			password || userToUpdate.password, 
			language || userToUpdate.language, 
			longitude || userToUpdate.longitude, 
			latitude || userToUpdate.latitude, 
			id
		];
		// CHECK GEOLOCATION CHANGES
		const userToUpdateGeoLocation = await geoLocation.isSouthOrNorth(userToUpdate.latitude, userToUpdate.longitude);
		const currentGeoLocation = await geoLocation.isSouthOrNorth(latitude, longitude);
		console.log({ userToUpdateGeoLocation, currentGeoLocation });
		if (userToUpdateGeoLocation !== currentGeoLocation) {
			// IF IT CHANGES, REMOVE USER FROM PREVIOUS DATABASE
			const userToDelete = await deleteUserFromPreviousDb(db, id, currentGeoLocation); 
			if (!userToDelete) 
				return apiResponse.notFound(res, 'Error al eliminar usuario de una base de datos para actualizarlo en la otra.');
			// AND ADD NEW USER TO THE CURRENT DATABE
			const newUser = await addUserToNewDb(db, values, req, currentGeoLocation);
			if (!newUser) return apiResponse.failure(res, 'Error en la comunicación con la API.', err); 
			return apiResponse.success(res, 'Usuario actualizado en la nueva base de datos.');
		}
		// IF THERE IS NO GEOLOCATION CHANGES, UPDATE USER
		const updateUser = await updateUserDb(db, values, req, currentGeoLocation);
		if (!updateUser) return apiResponse.failure(res, 'Error en la comunicación con la API.', err);
		if (updateUser.changes === 0) return apiResponse.notFound(res, 'No existe ningún usuario con la id proporcionada.');
		console.log({ response: updateUser });
		console.log({ updateUser: { ...req.body, geoLocation: currentGeoLocation } });
		return apiResponse.success(res, 'Usuario actualizado con éxito.');
	} catch (err) {
		console.log('CATCH UPDATE USER', err)
		return apiResponse.failure(res, 'Error en la comunicación con la API.', err);
	}
};

const searchUser = async (db, id) => {
	const sql = `
		SELECT * 
		FROM users u
		WHERE u.id = ${id}
	`;
	const northUser = await db.all(sql);
	const southUser = await southerUsersApi.getUser(id);
	const userToUpdate = northUser && northUser[0] || southUser;
	console.log({ userToUpdate });
	return userToUpdate;
};

const deleteUserFromPreviousDb = async (db, id, currentGeoLocation) => {
	let userToDelete;
	if (currentGeoLocation === 'S') {
		const sql = `
			DELETE 
			FROM users
			WHERE id = ${id};
		`;
		userToDelete = await db.run(sql);
		console.log({ userToDelete });				
		if (!userToDelete || (userToDelete && userToDelete.changes === 0)) 
			return undefined;
	} else {
		const userToDelete = await southerUsersApi.getUser(id);
		console.log({ userToDelete });
		if (!userToDelete) 
			return undefined;
	}
	return userToDelete;
};

const addUserToNewDb = async (db, values, req, currentGeoLocation) => {
	const sql = `
		INSERT INTO users (username, email, password, language, longitude, latitude) 
		VALUES (?, ?, ?, ?, ?, ?);
	`;
	const newUser = currentGeoLocation === 'N' ? 
		await db.run(sql, values) :
		await southerUsersApi.insertUser(req.body);
	if (!newUser) return undefined;
	console.log({ response: newUser })
	console.log({ newUser: { ...req.body, geoLocation: currentGeoLocation } });
	return newUser;
};

const updateUserDb = async (db, values, req, currentGeoLocation) => {
	const sql = `
		UPDATE users
		SET username = ?, email = ?, password = ?, language = ?, longitude = ?, latitude = ?
		WHERE id = ?;
	`;
	const updateUser = currentGeoLocation === 'N' ? 
		await db.run(sql, values) :
		await southerUsersApi.updateUser(req.body);
	return updateUser;
};

module.exports = {
	updateUser
  };