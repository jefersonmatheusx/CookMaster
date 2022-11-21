module.exports = async (recipeModel, id, userIdReq, userRole) => {
  const user = await recipeModel.getById(id)
  if (!user) {
    return false
  }
  switch (userRole) {
    case 'admin':
      return true
    case 'user':
      if (user.userId.toString() !== userIdReq) {
        return false
      }
      return true
    default:
      return false
  }
}
