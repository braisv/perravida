const database = require('../../lib/db');
const southerUsersApi = require('../../services/southernUsersApi');
const apiResponse = require('../../lib/apiResponse');
const checkParams = require('../../utils/checkParams');
const geoLocation = require('../../utils/geoLocation');

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

module.exports = {
	addUser
};