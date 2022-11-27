const { MongoClient } = require('mongodb')
const chai = require('chai')
const sinon = require('sinon')
const server = require('../api/app')
const { statusCode } = require('../api/utils/StatusCode')

const { newUser, correctLogin, recipe } = require('./helpersObjects')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const mongoDbUrl = `mongodb://${process.env.HOST || 'mongodb'}:27017/Cookmaster`

const { expect } = chai
describe('Teste de rota GET /recipes e recipes/:id', () => {
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
		await db.collection('recipes').deleteMany({})
		await db.collection('users').deleteMany({})
		await connection.close()
	})
	describe('Testes da rota GET /recipes', () => {
		describe('testa caso de sucesso em buscar todas as receitas', () => {
			let response

			before(async () => {
				await chai.request(server).post('/users').send(newUser)

				const token = await chai
					.request(server)
					.post('/login')
					.send({
						email: 'jeferson.matheus1@gmail.com',
						password: '3142',
					})
					.then((res) => res.body.token)

				response = await chai.request(server).get('/recipes').set('Authorization', token)
			})

			after(async () => {
				await db.collection('users').deleteOne({
					email: 'jeferson.matheus1@gmail.com',
				})
			})

			it('retorna código de status "200"', (done) => {
				expect(response).to.have.status(200)
				done()
			})
			it('retorna um array no body', (done) => {
				expect(response.body).to.be.an('array')
				done()
			})
		})
	})

	describe('Testa da rota GET recipes/id', () => {
		describe('Testa caso de sucesso em buscar receita por Id com Token', () => {
			let response
			before(async () => {
				await chai.request(server).post('/users').send(newUser)

				const {
					body: { token },
				} = await chai.request(server).post('/login').send(correctLogin)
				const {
					body: { recipe: _id },
				} = await chai.request(server).post('/recipes').set('Authorization', token).send(recipe)
				const { _id: recipeId } = _id
				response = await chai.request(server).get(`/recipes/${recipeId}`).set('Authorization', token)
			})

			it('busca pelas receitas, retorna status 200, e body contem um objeto "', (done) => {
				expect(response).to.have.status(statusCode.OK)
				expect(response.body).to.be.an('object')
				done()
			})
			it('verifica se objeto contém: name', (done) => {
				expect(response.body).to.be.property('name')
				done()
			})
			it('verifica se objeto contém: ingredients', (done) => {
				expect(response.body).to.be.property('ingredients')
				done()
			})
			it('verifica se objeto contém: preparation', (done) => {
				expect(response.body).to.be.property('preparation')
				done()
			})
			it('verifica se objeto "recipe" contém: userId, e _id', (done) => {
				expect(response.body).to.be.property('userId')
				expect(response.body).to.be.property('_id')
				done()
			})
		})
		
		describe('Testa caso de sucesso em buscar receita por Id sem Token', () => {
			let response
			before(async () => {
				await chai.request(server).post('/users').send(newUser)

				const {
					body: { token },
				} = await chai.request(server).post('/login').send(correctLogin)
				const {
					body: { recipe: _id },
				} = await chai.request(server).post('/recipes').set('Authorization', token).send(recipe)
				const { _id: recipeId } = _id
				response = await chai.request(server).get(`/recipes/${recipeId}`)
			})

			it('busca pelas receitas, retorna status 200, e body contem um objeto "', (done) => {
				expect(response).to.have.status(statusCode.OK)
				expect(response.body).to.be.an('object')
				done()
			})
			it('verifica se objeto contém: name', (done) => {
				expect(response.body).to.be.property('name')
				done()
			})
			it('verifica se objeto contém: ingredients', (done) => {
				expect(response.body).to.be.property('ingredients')
				done()
			})
			it('verifica se objeto contém: preparation', (done) => {
				expect(response.body).to.be.property('preparation')
				done()
			})
			it('verifica se objeto "recipe" contém: userId, e _id', (done) => {
				expect(response.body).to.be.property('userId')
				expect(response.body).to.be.property('_id')
				done()
			})
		})
	})
})
