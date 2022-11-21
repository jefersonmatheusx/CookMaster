module.exports = async (model, id, userIdReq, userRole) => {
  const modelRecived = await model.getById(id)
  if (!modelRecived) {
     throw new Error('data not found')
  }
  switch (userRole) {
    case 'admin':
      return true
    case 'user':
      if (modelRecived.userId.toString() !== userIdReq) {
        return false
      }
      return true
    default:
      return false
  }
}
