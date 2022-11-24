const mongoose = require('mongoose')
const StatusCode = require('../utils/StatusCode')

module.exports = (collection) => {
  return async (req, res, next) => {
    const { id } = req.params
    const { userId, userRole } = req

    const resultCollection = await mongoose.connection.db.collection(collection)

    const dataRecived = await resultCollection.findOne({
      _id: mongoose.Types.ObjectId(id)
    })

    if (!dataRecived) {
      return next({ status: StatusCode.NOT_FOUND, message: 'data not found' })
    }
    switch (userRole) {
      case 'admin':
        return next()

      case 'user':
        if (dataRecived.userId.toString() !== userId) {
          return next({
            status: StatusCode.FORBIDEN,
            message: 'Forbiden: not allowed to do this action'
          })
        }
        return next()

      default:
        return next({
          status: StatusCode.FORBIDEN,
          message: 'Forbiden: not allowed to do this action'
        })
    }
  }
}
