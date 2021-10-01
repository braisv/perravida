const success = (res, msg, data) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	const response = {
		status: 0,
		message: msg,
		...data && { data },
	};
	console.log({ response })
	return res.status(data ? 200 : 204).json(response);
};

const failure = (res, msg, data) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	const response = {
		status: 1,
		message: msg,
		...data && { data },
	};
	return res.status(500).json(response);
};

const notFound = (res, msg, data) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	const response = {
		status: 2,
		message: msg,
		...data && { data },
	};
	return res.status(404).json(response);
};

const validationFailure = (res, msg, data) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	const response = {
		status: 0,
		message: msg,
		...data && { data },
	};
	return res.status(400).json(response);
};

module.exports = {
	success,
	failure,
	notFound,
	validationFailure
};