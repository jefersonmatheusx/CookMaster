const { MongoClient } = require('mongodb')
const chai = require('chai')
const server = require('../api/app')
const { newUser, loginWithoutEmail, loginWithoutPassW, incorretLogin, correctLogin } = require('./helpersObjects')
const { statusCode, loginMessages, usersMessages } = require('../api/utils/StatusCode')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const { expect } = chai

const mongoDbUrl = `mongodb://${process.env.HOST || 'mongodb'}:27017/Cookmaster`

describe('Valida a rota post /login', () => {
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

	describe('Valida se o email e password são obrigatórios', () => {
		let response

		before(async () => {
			response = await chai.request(server).post('/login').send({})
		})

		it('verifica se retorna status "401", e mensagem correspondente', (done) => {
			expect(response).to.have.status(401)
			done()
		})
		it('verifica se "message" corresponde a "All fields must be filled"', (done) => {
			expect(response.body.message).to.be.equals(loginMessages.invalidData)
			done()
		})
	})
	describe('Valida o campo email', () => {
		let response

		before(async () => {
			await chai.request(server).post('/users').send(newUser)

			response = await chai.request(server).post('/login').send(loginWithoutEmail)
		})

		after(async () => {
			await db.collection('users').deleteOne({
				email: 'jeferson.matheus1@gmail.com',
			})
		})

		it('Retorna status 401 se o body não possui email', (done) => {
			expect(response).to.have.status(statusCode.INVALID_FIELD)
			done()
		})
		it('Retorna propriedade message com mensagem ""Incorrect username or password"', (done) => {
			expect(response.body).to.have.property('message')
			expect(response.body.message).to.be.equal(loginMessages.invalidData)
			done()
		})
	})
	describe('Valida o campo password', () => {
		let response

		before(async () => {
			await chai.request(server).post('/users').send(newUser)

			response = await chai.request(server).post('/login').send(loginWithoutPassW)
		})

		after(async () => {
			await db.collection('users').deleteOne({
				email: 'jeferson.matheus1@gmail.com',
			})
		})

		it('Retorna status 401 se o body não possui password', (done) => {
			expect(response).to.have.status(statusCode.INVALID_FIELD)
			done()
		})
		it('Retorna propriedade message com mensagem ""Incorrect username or password"', (done) => {
			expect(response.body).to.have.property('message')
			expect(response.body.message).to.be.equal(loginMessages.invalidData)
			done()
		})
	})
	describe('Verifica se o login corresponde ao banco de dados', () => {
		let response

		before(async () => {
			await chai.request(server).post('/users').send(newUser)

			response = await chai.request(server).post('/login').send(incorretLogin)
		})

		after(async () => {
			await db.collection('users').deleteOne({
				email: 'jeferson.matheus1@gmail.com',
			})
		})
		it('Retorna status 401, se login não corresponde', (done) => {
			expect(response).to.have.status(statusCode.INVALID_FIELD)
			done()
		})
		it('Retorna propriedade message com mensagem "Incorrect username or password"', (done) => {
			expect(response.body).to.have.property('message')
			expect(response.body.message).to.be.equal(loginMessages.incorretLogin)
			done()
		})
	})
	describe('Login realizado com sucesso', () => {
		let response

		before(async () => {
			await chai.request(server).post('/users').send(newUser)
			response = await chai.request(server).post('/login').send(correctLogin)
		})

		after(async () => {
			await db.collection('users').deleteOne({
				email: 'jeferson.matheus1@gmail.com',
			})
		})

		it('Espera que o status do login realizado seja 200', (done) => {
			expect(response).to.have.status(statusCode.OK)
			done()
		})
		it('Espera que o retorno em body seja um objeto com a propriedade "token"', (done) => {
			expect(response.body).to.have.property('token')
			expect(response.body['token']).to.be.a('string')
			done()
		})
	})
})
