// eslint-disable-next-line no-unused-vars
const errMiddleware = (err, _req, res, _next) => {
	const { status, message } = err
	_next()
	return res.status(status).json({ message })
}

module.exports = errMiddleware
