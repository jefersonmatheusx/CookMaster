const StatusCode = require('../utils/StatusCode')

var ObjectId = require('mongoose').Types.ObjectId

module.exports = (req, res, next) => {
  const { id } = req.params

  const validId = ObjectId.isValid(id)
  if (!validId) {
    next({ status: StatusCode.BAD_REQUEST, message:'Bad request.'})
  }
  next()
}
