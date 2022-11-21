module.exports = async (recipeModel, id, userIdReq, userRole) => {
  const { userId } = await recipeModel.getById(id)
  if (userRole !== 'admin' && userRole == 'user') {
    if (userId.toString() !== userIdReq) {
      return false
    }
  }
  return true
}
