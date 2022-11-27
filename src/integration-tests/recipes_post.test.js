const { MongoClient } = require('mongodb')
const chai = require('chai')
const server = require('../api/app')
const { statusCode, usersMessages } = require('../api/utils/StatusCode')

const { newUser, correctLogin, recipe, recipeWithoutIngredients, recipeWithoutPreparation, recipeWithoutName } = require('./helpersObjects')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const mongoDbUrl = `mongodb://${process.env.HOST || 'mongodb'}:27017/Cookmaster`

const { expect } = chai

describe('Testes da rota POST /recipes', () => {
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
	describe('Testa caso de sucesso em publicar uma receita', () => {
		let response
		before(async () => {
			await chai.request(server).post('/users').send(newUser)
			const {
				body: { token },
			} = await chai.request(server).post('/login').send(correctLogin)
			response = await chai.request(server).post('/recipes').set('Authorization', token).send(recipe)
		})
		after(async () => {
			await db.collection('users').deleteOne({ email: newUser.email })
			await db.collection('recipes').deleteMany({})
		})
		it('adiciona uma receita, retorna status 201, e objeto "recipe"', (done) => {
			expect(response).to.have.status(201)
			expect(response.body).to.be.an('object')
			expect(response.body).to.be.property('recipe')
			done()
		})
		it('verifica se objeto "recipe" contém: name com conteudo correspondete', (done) => {
			expect(response.body.recipe).to.be.property('name')
			expect(response.body.recipe.name).to.be.equal('Torta vegetariana')
			done()
		})
		it('verifica se objeto "recipe" contém: ingredients com conteudo correspondete', (done) => {
			expect(response.body.recipe).to.be.property('ingredients')
			expect(response.body.recipe.ingredients).to.be.equal('Panequeca, Brocolis, Alho, FakeCheddar')
			done()
		})
		it('verifica se objeto "recipe" contém: preparation com conteudo correspondete', (done) => {
			expect(response.body.recipe).to.be.property('preparation')
			expect(response.body.recipe.preparation).to.be.equal('2 horas')
			done()
		})
		it('verifica se objeto "recipe" contém: userId, e _id', (done) => {
			expect(response.body.recipe).to.be.property('userId')
			expect(response.body.recipe).to.be.property('_id')
			done()
		})
	})
	describe('Testa casos de falha em publicar uma receita', () => {
		before(async () => {
			await chai.request(server).post('/users').send(newUser)
		})
		after(async () => {
			await db.collection('users').deleteOne({
				email: 'jeferson.matheus1@gmail.com',
			})
		})

		describe('Erros em POST /recipes, sem name no body', async () => {
			let response

			before(async () => {
				const {
					body: { token },
				} = await chai.request(server).post('/login').send(correctLogin)
				response = await chai.request(server).post('/recipes').set('Authorization', token).send(recipeWithoutName)
			})
			it('verifica body: sem name, retorna status 400', async (done) => {
				expect(response).to.have.status(statusCode.BAD_REQUEST)
				done()
			})
			it('verifica body: sem name, retorna message "Invalid entries. Try again."', async (done) => {
				expect(response.body).to.have.property('message')
				expect(response.body.message).to.be.equal(usersMessages.invalidEntries)
				done()
			})
		})
		describe('Erros em POST /recipes, sem ingredients no body', async () => {
			let response

			before(async () => {
				const {
					body: { token },
				} = await chai.request(server).post('/login').send(correctLogin)
				response = await chai.request(server).post('/recipes').set('Authorization', token).send(recipeWithoutIngredients)
			})
			it('verifica body: sem ingredients, retorna status 400', (done) => {
				expect(response).to.have.status(statusCode.BAD_REQUEST)
				done()
			})
			it('verifica body: sem ingredients, retorna message "Invalid entries. Try again."', (done) => {
				expect(response.body).to.have.property('message')
				expect(response.body.message).to.be.equal(usersMessages.invalidEntries)
				done()
			})
		})
		describe('Erros em POST /recipes, sem preparation no body', async () => {
			let response
			before(async () => {
				const {
					body: { token },
				} = await chai.request(server).post('/login').send(correctLogin)
				response = await chai.request(server).post('/recipes').set('Authorization', token).send(recipeWithoutPreparation)
			})
			it('verifica body: preparation, retorna message e status', (done) => {
				expect(response).to.have.status(statusCode.BAD_REQUEST)
				done()
			})
			it('verifica body: sem preparation, retorna message "Invalid entries. Try again."', (done) => {
				expect(response.body).to.have.property('message')
				expect(response.body.message).to.be.equal(usersMessages.invalidEntries)
				done()
			})
		})
	})
})
