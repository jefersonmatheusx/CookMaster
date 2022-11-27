const { MongoClient } = require('mongodb')
const chai = require('chai')
const server = require('../api/app')
const { statusCode } = require('../api/utils/StatusCode')

const { newUser, correctLogin, recipe } = require('./helpersObjects')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const mongoDbUrl = `mongodb://${process.env.HOST || 'mongodb'}:27017/Cookmaster`

const { expect } = chai
let connection
let db
describe('Teste da rota DELETE /recipes', () => {
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
		await db.collection('recipes').deleteMany({})
		await db.collection('users').deleteMany({})
		await connection.close()
	})

	describe('Teste de sucesso de DELETE /recipes', () => {
		let response
		before(async () => {
			await chai.request(server).post('/users').send(newUser)
			const {
				body: { token },
			} = await chai.request(server).post('/login').send(correctLogin)
			const {
				body: {
					recipe: { _id },
				},
			} = await chai
				.request(server)
				.post('/recipes')
				.set('Authorization', token)
				.send(recipe)

			const recipeId = _id
			response = await chai
				.request(server)
				.delete(`/recipes/${recipeId}`)
				.set('Authorization', token)
		})
		it('Retorna status 204', (done) => {
			expect(response).to.have.status(statusCode.NO_CONTENT)
			done()
		})
	})
	describe('Testas caso de erros em DELETE /recipes, sem id', () => {
		let response
		before(async () => {
			const {
				body: { token },
			} = await chai.request(server).post('/login').send(correctLogin)
			const {
				body: { recipe: _id },
			} = await chai
				.request(server)
				.post('/recipes')
				.set('Authorization', token)
				.send(recipe)

			response = await chai
				.request(server)
				.delete(`/recipes/`)
				.set('Authorization', token)
		})
		it('Retorna status 404', (done) => {
			expect(response).to.have.status(statusCode.NOT_FOUND)
			done()
		})
	})
})
