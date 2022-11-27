const { MongoClient } = require('mongodb')
const { newUser, correctLogin, recipe } = require('./helpersObjects')
const { statusCode, authMessages } = require('../api/utils/statusCode')
const server = require('../api/app')
const chai = require('chai')

const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const { expect } = chai

const mongoDbUrl = `mongodb://${process.env.HOST || 'mongodb'}:27017/Cookmaster`

describe('Sem token de autenticação, não é possível acessar rotas', () => {
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

	describe('Não é possível acessar a rota POST /recipes sem token', () => {
		let response

		before(async () => {
			response = await chai.request(server).post('/recipes').send(recipe)
		})
		after(async () => {
			await db.collection('users').deleteOne({
				email: 'jeferson.matheus1@gmail.com',
			})
		})

		it('Sem token, retorna status 401', (done) => {
			expect(response).to.have.status(statusCode.INVALID_FIELD)
			done()
		})
		it('Sem token, retorna propriedade message com valor "missing auth token"', (done) => {
			expect(response.body).to.have.property('message')
			expect(response.body.message).to.be.equal(authMessages.missingToken)
			done()
		})
	})

	describe('Não é possível acessar a rota PUT /recipes sem token', () => {
		let response
		before(async () => {
			await chai.request(server).post('/users').send(newUser)
			const {
				body: { token },
			} = await chai.request(server).post('/login').send(correctLogin)
			const {
				body: { recipe: _id },
			} = await chai
				.request(server)
				.post('/recipes')
				.set('Authorization', token || '')
				.send(recipe)

			response = await chai.request(server).put(`/recipes/${_id}`).send({
				name: 'Torta vegetariana deliciosa',
				ingredients: 'Panequeca, Brocolis, Alho, FakeCheddar, queijo de mandioca',
				preparation: '3 horas',
			})
		})
		after(async () => {
			await db.collection('users').deleteOne({
				email: 'jeferson.matheus1@gmail.com',
			})
		})
		it('Sem token, retorna status 401', (done) => {
			expect(response).to.have.status(statusCode.INVALID_FIELD)
			done()
		})
		it('Sem token, retorna propriedade message com valor "missing auth token"', (done) => {
			expect(response.body).to.have.property('message')
			expect(response.body.message).to.be.equal(authMessages.missingToken)
			done()
		})
	})

	describe('Não é possível acessar a rota DELETE /recipes sem token', () => {
		let response
		before(async () => {
			await chai.request(server).post('/users').send(newUser)
			const {
				body: { token },
			} = await chai.request(server).post('/login').send(correctLogin)
			const {
				body: { recipe: _id },
			} = await chai
				.request(server)
				.post('/recipes')
				.set('Authorization', token || '')
				.send(recipe)

			response = await chai.request(server).delete(`/recipes/${_id}`)
		})
		after(async () => {
			await db.collection('users').deleteOne({
				email: 'jeferson.matheus1@gmail.com',
			})
		})
		it('Sem token, retorna status 401', (done) => {
			expect(response).to.have.status(statusCode.INVALID_FIELD)
			done()
		})
		it('Sem token, retorna propriedade message com valor "missing auth token"', (done) => {
			expect(response.body).to.have.property('message')
			expect(response.body.message).to.be.equal(authMessages.missingToken)
			done()
		})
	})
})
