const { MongoClient } = require('mongodb')
const chai = require('chai')
const server = require('../api/app')
const { statusCode, usersMessages } = require('../api/utils/StatusCode')
const { newUser, userWithoutEmail, userWithoutName, userWithoutPassW } = require('./helpersObjects')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const { expect } = chai
const mongoDbUrl = `mongodb://${process.env.HOST || 'mongodb'}:27017/Cookmaster`

describe('Valida a rota post /users', () => {
	let connection
	let db
	before(async () => {
		connection = await MongoClient.connect(mongoDbUrl, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		db = connection.db('Cookmaster')
	})

	before(async () => {
		await db.collection('users').deleteMany({})
		await db.collection('recipes').deleteMany({})
	})

	after(async () => {
		await connection.close()
	})

	describe('Cadastro de usuário realizado com sucesso', () => {
		let response

		before(async () => {
			response = await chai.request(server).post('/users').send({
				name: 'Jeferson Matheus M. M. Vieira',
				email: 'jeferson.matheus1@gmail.com',
				password: '3142',
			})
		})
		after(async () => {
			await db.collection('users').deleteOne({
				email: 'jeferson.matheus1@gmail.com',
			})
		})
		it('Espera que o retorno em body seja um objeto com a propriedade "user"', (done) => {
			expect(response.body).to.be.an('object')
			expect(response.body).to.be.property('user')
			done()
		})
		it('Espera que o objeto "user" tenha a propriedade "name"', (done) => {
			expect(response.body.user).to.be.property('name')
			expect(response.body.user['name']).to.be.a('string')
			expect(response.body.user.name).to.be.equal(newUser.name)
			done()
		})
		it('Espera que o objeto "user" tenha a propriedade "email"', (done) => {
			expect(response.body.user).to.be.property('email')
			expect(response.body.user['email']).to.be.a('string')
			expect(response.body.user.email).to.be.equal('jeferson.matheus1@gmail.com')
			done()
		})
		it('Espera que o objeto "user" tenha a propriedade "_id"', (done) => {
			expect(response.body.user).to.be.property('_id')
			expect(response.body.user['_id']).to.be.a('string')
			done()
		})
		it('Espera que o objeto "user" tenha a propriedade "role"', (done) => {
			expect(response.body.user).to.be.property('role')
			expect(response.body.user['role']).to.be.a('string')
			expect(response.body.user.role).to.be.equal('user')
			done()
		})
		it('Espera que o status seja 201, create', (done) => {
			expect(response).to.have.status(statusCode.CREATED)
			done()
		})
	})

	describe('Erro no cadastro de usuário', () => {
		describe('Valida se o email, password e name são obrigatórios', () => {
			let response

			before(async () => {
				response = await chai.request(server).post('/users').send({})
			})

			it('verifica se retorna status "400"', (done) => {
				expect(response).to.have.status(statusCode.BAD_REQUEST)
				done()
			})
			it('verifica se "message" corresponde a "Invalid entries. Try again."', (done) => {
				expect(response.body.message).to.be.equals(usersMessages.invalidEntries)
				done()
			})
		})
		describe('Valida o campo email', () => {
			let response

			before(async () => {
				response = await chai.request(server).post('/users').send(userWithoutEmail)
			})

			it('Retorna status 400 se o body não possui email', (done) => {
				expect(response).to.have.status(statusCode.BAD_REQUEST)
				done()
			})
			it('Retorna propriedade message com mensagem "Invalid entries. Try again."', (done) => {
				expect(response.body).to.have.property('message')
				expect(response.body.message).to.be.equal(usersMessages.invalidEntries)
				done()
			})
		})
		describe('Valida o campo password', () => {
			let response

			before(async () => {
				response = await chai.request(server).post('/users').send(userWithoutPassW)
			})

			it('Retorna status 400 se o body não possui password', (done) => {
				expect(response).to.have.status(statusCode.BAD_REQUEST)
				done()
			})
			it('Retorna propriedade message com mensagem "Invalid entries. Try again."', (done) => {
				expect(response.body).to.have.property('message')
				expect(response.body.message).to.be.equal(usersMessages.invalidEntries)
				done()
			})
		})
		describe('Valida o campo name', () => {
			let response

			before(async () => {
				response = await chai.request(server).post('/users').send(userWithoutName)
			})
			it('Retorna status 400 se o body não possui name', (done) => {
				expect(response).to.have.status(statusCode.BAD_REQUEST)
				done()
			})
			it('Retorna propriedade message com mensagem "Invalid entries. Try again."', (done) => {
				expect(response.body).to.have.property('message')
				expect(response.body.message).to.be.equal(usersMessages.invalidEntries)
				done()
			})
		})
		describe('Verifica que não é possível criar um usuário com email existente no banco de dados', () => {
			let response
			before(async () => {
				await chai.request(server).post('/users').send(newUser)

				response = await chai.request(server).post('/users').send(newUser)
			})

			after(async () => {
				await db.collection('users').deleteOne({
					email: 'jeferson.matheus1@gmail.com',
				})
			})

			it('Retorna status 409 se o email já existe no banco de dados', (done) => {
				expect(response).to.have.status(statusCode.CONFLICT)
				done()
			})
			it('Retorna propriedade message com mensagem "Email already registered"', (done) => {
				expect(response.body.message).to.be.equals(usersMessages.emailNotUnic)
				done()
			})
		})
	})
})
