const StatusCode = require('../utils/StatusCode')
const { tokenValidator } = require('../validation/tokenValidator')
module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    console.error('acesso negado')
    return res
      .status(StatusCode.INVALID_FIELD)
      .json({ msg: 'Missing Auth Token!' })
  }

  try {
    const decodedToken = tokenValidator(token)
    req.userId = decodedToken._id
    req.userRole = decodedToken.role
    next()
  } catch (error) {
    res.status(StatusCode.INVALID_FIELD).json({ msg: 'jwt malformed' })
  }
}
