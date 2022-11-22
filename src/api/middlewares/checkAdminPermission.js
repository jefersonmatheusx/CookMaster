const { tokenValidator } = require('../validation/tokenValidator')
const StatusCode = require('../utils/StatusCode')
const checkAdminPermission = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token)
    return next({
      status: StatusCode.INVALID_FIELD,
      message: 'Missing auth token!'
    })

  const { role } = tokenValidator(token)
  if (role !== 'admin') {
    return next({
      status: StatusCode.FORBIDEN,
      message: 'Only admins can register new admins'
    })
  }

  return next()
}

module.exports = checkAdminPermission
