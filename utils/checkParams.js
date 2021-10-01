const checkString = (str) => !!str && /^(?=.*[a-zA-Z0-9])/.test(str);
const checkNumber = (num) => !!num && !isNaN(num);

const validation = (params) => {
	const { username, email, password, language, longitude, latitude } = params;
	return checkString(username) && 
		checkString(email) && 
		checkString(password) && 
		checkString(language) && 
		checkNumber(longitude) && 
		checkNumber(latitude)
}

module.exports = {
	validation
   };
  
