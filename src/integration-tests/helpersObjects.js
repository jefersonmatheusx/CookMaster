const newUser = {
	name: 'Jeferson Matheus M. M. Vieira',
	email: 'jeferson.matheus1@gmail.com',
	password: '3142',
}

const otherUser = {
	name: 'Conceição',
	email: 'conceicao@email.com',
	password: '111213',
}

const otherUserLogin = {
	email: 'conceicao@email.com',
	password: '111213',
}

const userWithoutName = {
	email: 'jeferson.matheus1@gmail.com',
	password: '3142',
}
const userWithoutEmail = {
	name: 'Jeferson Matheus M. M. Vieira',
	password: '3142',
}
const userWithoutPassW = {
	name: 'Jeferson Matheus M. M. Vieira',
	email: 'jeferson.matheus1@gmail.com',
}
const loginWithoutEmail = {
	password: '3142',
}

const loginWithoutPassW = {
	email: 'jeferson.matheus1@gmail.com',
}

const incorretLogin = {
	email: 'jeferson.matheus2@gmail.com',
	password: '3142',
}

const correctLogin = {
	email: 'jeferson.matheus1@gmail.com',
	password: '3142',
}

const recipe = {
	name: 'Torta vegetariana',
	ingredients: 'Panequeca, Brocolis, Alho, FakeCheddar',
	preparation: '2 horas',
}

const recipeWithoutName = {
	ingredients: 'Panequeca, Brocolis, Alho, FakeCheddar',
	preparation: '2 horas',
}
const recipeWithoutIngredients = {
	name: 'Torta vegetariana',
	preparation: '2 horas',
}
const recipeWithoutPreparation = {
	name: 'Torta vegetariana',
	ingredients: 'Panequeca, Brocolis, Alho, FakeCheddar',
}

const adminUser = { email: 'root@email.com', password: 'admin' }
const newAdminUser = {
	...adminUser,
	name: 'admin',
	role: 'admin',
}

const newAdmin = {
	name: 'New Admin',
	email: 'newadm@email.com',
	password: 'newAdmin',
}

module.exports = {
	newUser,
	loginWithoutEmail,
	loginWithoutPassW,
	incorretLogin,
	correctLogin,
	userWithoutEmail,
	userWithoutName,
	userWithoutPassW,
	recipe,
	recipeWithoutName,
	recipeWithoutIngredients,
	recipeWithoutPreparation,
	adminUser,
	newAdminUser,
	newAdmin,
	otherUser,
	otherUserLogin,
}
