const emailFormat = /^\w+([.-]?\w+)*@\w+([s.-]?\w+)*(\.\w{2,3})+$/
const validateEmail = (email) => emailFormat.test(email)
module.exports = {
	validateEmail,
	emailFormat,
}
