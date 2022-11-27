const statusCode = {
	OK: 200,
	CREATED: 201,
	NO_CONTENT: 204,
	BAD_REQUEST: 400,
	INVALID_FIELD: 401,
	NOT_FOUND: 404,
	CONFLICT: 409,
	INTERNAL: 500,
	FORBIDEN: 403,
}

const usersMessages = {
	emailNotUnic: 'Email already registered',
	invalidEntries: 'Invalid entries. Try again.',
	onlyAdmin: 'Only admins can register new admins',
	forbiden: 'Forbiden: action not allowed',
}

const loginMessages = {
	invalidData: 'All fields must be filled',
	incorretLogin: 'Incorrect username or password',
}

const authMessages = {
	jwt: 'jwt malformed',
	missingToken: 'missing auth token',
}

const recipesMessages = {
	notFound: 'data not found',
}

module.exports = {
	statusCode,
	usersMessages,
	loginMessages,
	authMessages,
	recipesMessages,
}
