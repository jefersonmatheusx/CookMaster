const jwt = require('jsonwebtoken')
const secret = require('../utils/secret')


const checkAdminPermission = async (req, res, next) => {
  const { authorization } = req.headers
  const {
    data: { role }
  } = jwt.verify(authorization, secret)
  if (!authorization || role !== 'admin') {
    return next({ status: 403, message: 'Only admins can register new admins' })
  }

  return next()
}

module.exports = checkAdminPermission
