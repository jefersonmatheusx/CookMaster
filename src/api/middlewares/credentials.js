const StatusCode = require('../utils/StatusCode')
const { tokenValidator } = require('../validation/tokenValidator')
module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token)
    next({
      status: StatusCode.INVALID_FIELD,
      message: 'Missing auth token!'
    })

  try {
    const decodedToken = tokenValidator(token)
    req.userId = decodedToken._id
    req.userRole = decodedToken.role
    next()
  } catch (error) {
    next({ message: 'jwt malformed', status: StatusCode.INVALID_FIELD })
  }
}
