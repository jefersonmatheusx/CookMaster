const { MongoClient } = require('mongodb')
const chai = require('chai')
const server = require('../api/app')
const { statusCode, recipesMessages, usersMessages } = require('../api/utils/StatusCode')

const { newUser, correctLogin, recipe, recipeWithoutIngredients, recipeWithoutName } = require('./helpersObjects')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const mongoDbUrl = `mongodb://${process.env.HOST || 'mongodb'}:27017/Cookmaster`

const { expect } = chai

describe('Testes da rota PUT /recipes', () => {
	let connection
	let db
	before(async () => {
		connection = await MongoClient.connect(mongoDbUrl, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		db = connection.db('Cookmaster')
	})

	beforeEach(async () => {
		await db.collection('users').deleteMany({})
		await db.collection('recipes').deleteMany({})
	})

	after(async () => {
		await db.collection('recipes').deleteMany({})
		await db.collection('users').deleteMany({})
		await connection.close()
	})

	describe('Teste de sucesso de editar uma receita', () => {
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
			} = await chai.request(server).post('/recipes').set('Authorization', token).send(recipe)

			response = await chai.request(server).put(`/recipes/${_id}`).set('Authorization', token).send({
				name: 'Torta vegetariana deliciosa',
				ingredients: 'Panequeca, Brocolis, Alho, FakeCheddar, queijo de mandioca',
				preparation: '3 horas',
			})
		})
		it('retorna status de 200, e um objeto', (done) => {
			expect(response).to.have.status(statusCode.OK)
			expect(response.body).to.be.an('object')
			done()
		})
		it('o objeto retornado contem o conteúdo alterado da receita', (done) => {
			expect(response.body.name).to.be.equal('Torta vegetariana deliciosa')
			expect(response.body.ingredients).to.be.equal('Panequeca, Brocolis, Alho, FakeCheddar, queijo de mandioca')
			expect(response.body.preparation).to.be.equal('3 horas')
			expect(response.body).to.be.property('userId')
			expect(response.body).to.be.property('_id')
			done()
		})
	})
	describe('Testas caso de erros em PUT /recipes', () => {
		describe('Com id errado, não encontra receita', () => {
			let response
			before(async () => {
				await chai.request(server).post('/users').send(newUser)

				const wrongRecipeId = '638366224508ff2c70050249'
				const {
					body: { token },
				} = await chai.request(server).post('/login').send(correctLogin)
				await chai.request(server).post('/recipes').set('Authorization', token).send(recipe)

				response = await chai.request(server).put(`/recipes/${wrongRecipeId}`).set('Authorization', token).send(recipe)
			})
			it('Retorna status 404', (done) => {
				expect(response).to.have.status(statusCode.NOT_FOUND)
				done()
			})
			it('Retorna propriedade message com valor "recipe not found', (done) => {
				expect(response.body).to.have.property('message')
				expect(response.body.message).to.be.equal(recipesMessages.notFound)
				done()
			})
		})
		describe('sem :id não encontra a rota', () => {
			let response
			before(async () => {
				await chai.request(server).post('/users').send(newUser)

				const {
					body: { token },
				} = await chai.request(server).post('/login').send(correctLogin)
				response = await chai.request(server).put(`/recipes`).set('Authorization', token).send({
					name: 'Torta vegetariana deliciosa',
					ingredients: 'Panequeca, Brocolis, Alho, FakeCheddar, queijo de mandioca',
					preparation: '3 horas',
				})
			})
			it('Retorna status 404', (done) => {
				expect(response).to.have.status(statusCode.NOT_FOUND)
				done()
			})
		})

		describe('Verificação do body: sem name,z altera receita', async () => {
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
				} = await chai.request(server).post('/recipes').set('Authorization', token).send(recipe)
				response = await chai.request(server).put(`/recipes/${_id}`).set('Authorization', token).send(recipeWithoutName)
			})

			it('retorna status de 200, e um objeto', (done) => {
				expect(response).to.have.status(statusCode.OK)
				expect(response.body).to.be.an('object')
				done()
			})
			it('o objeto retornado contem o conteúdo alterado da receita', (done) => {
				expect(response.body.name).to.be.equal('Torta vegetariana')
				expect(response.body.ingredients).to.be.equal('Panequeca, Brocolis, Alho, FakeCheddar')
				expect(response.body.preparation).to.be.equal('2 horas')
				expect(response.body).to.be.property('userId')
				expect(response.body).to.be.property('_id')
				done()
			})
		})

		describe('Verificação do body: sem ingredients, altera receita', () => {
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
				} = await chai.request(server).post('/recipes').set('Authorization', token).send(recipe)
				response = await chai.request(server).put(`/recipes/${_id}`).set('Authorization', token).send(recipeWithoutIngredients)
			})
			it('retorna status de 200, e um objeto', (done) => {
				expect(response).to.have.status(statusCode.OK)
				expect(response.body).to.be.an('object')
				done()
			})
			it('o objeto retornado contem o conteúdo alterado da receita', (done) => {
				expect(response.body.name).to.be.equal('Torta vegetariana')
				expect(response.body.ingredients).to.be.equal('Panequeca, Brocolis, Alho, FakeCheddar')
				expect(response.body.preparation).to.be.equal('2 horas')
				expect(response.body).to.be.property('userId')
				expect(response.body).to.be.property('_id')
				done()
			})
		})
		describe('Verificação do body: sem preparation, altera receita', () => {
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
				} = await chai.request(server).post('/recipes').set('Authorization', token).send(recipe)
				response = await chai.request(server).put(`/recipes/${_id}`).set('Authorization', token).send(recipeWithoutIngredients)
			})
			it('retorna status de 200, e um objeto', (done) => {
				expect(response).to.have.status(statusCode.OK)
				expect(response.body).to.be.an('object')
				done()
			})
			it('o objeto retornado contem o conteúdo alterado da receita', (done) => {
				expect(response.body.name).to.be.equal('Torta vegetariana')
				expect(response.body.ingredients).to.be.equal('Panequeca, Brocolis, Alho, FakeCheddar')
				expect(response.body.preparation).to.be.equal('2 horas')
				expect(response.body).to.be.property('userId')
				expect(response.body).to.be.property('_id')
				done()
			})
		})
	})
	describe('Verificação do body: objeto vazio, não altera receita', () => {
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
			} = await chai.request(server).post('/recipes').set('Authorization', token).send(recipe)
			response = await chai.request(server).put(`/recipes/${_id}`).set('Authorization', token).send({})
		})
		it('retorna status 400', (done) => {
			expect(response).to.have.status(statusCode.INVALID_FIELD)
			done()
		})
		it('Retorna propriedade message com valor "Invalid entries. Try again.', (done) => {
			expect(response.body).to.have.property('message')
			expect(response.body.message).to.be.equal(usersMessages.invalidEntries)
			done()
		})
	})
})
