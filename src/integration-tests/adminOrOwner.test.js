const { MongoClient } = require('mongodb')
const chai = require('chai')
const server = require('../api/app')
const { recipe, correctLogin, newUser, otherUser, otherUserLogin, adminUser, newAdminUser } = require('./helpersObjects')
const { statusCode, usersMessages } = require('../api/utils/StatusCode')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const { expect } = chai
const mongoDbUrl = `mongodb://${process.env.HOST || 'mongodb'}:27017/Cookmaster`
const path = require('path')
const fs = require('fs')
describe('Valida a função AdminOrOwner, nas rotas PUT, PUT/image e DELETE ', () => {
	let connection
	let db

	before(async () => {
		connection = await MongoClient.connect(mongoDbUrl, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		db = connection.db('Cookmaster')
		db.collection('users').insert(newAdminUser)
		await chai.request(server).post('/users').send(newUser)
		const {
			body: { token },
		} = await chai.request(server).post('/login').send(correctLogin)
		await chai.request(server).post('/recipes').set('Authorization', token).send(recipe)
		await chai.request(server).post('/users').send(otherUser)
	})

	after(async () => {
		await db.collection('users').deleteMany({})
		await db.collection('recipes').deleteMany({})
		// MongoClient.connect.restore()
	})
	describe('Se não é admin:', () => {
		describe('Se não é admin, nem proprietario, não acessa a rota PUT/recipes', () => {
			let response
			before(async () => {
				const {
					body: { token },
				} = await chai.request(server).post('/login').send(otherUserLogin)
				const { body: array } = await chai.request(server).get('/recipes')
				const { _id } = array[0]

				response = await chai.request(server).put(`/recipes/${_id}`).set('Authorization', token).send(recipe)
			})
			it('Retorna status 401 I', () => {
				expect(response).to.have.status(statusCode.FORBIDEN)
			})
			it('Retorna propriedade message com valor correspondente.', (done) => {
				expect(response.body).to.have.property('message')
				expect(response.body.message).to.be.equal(usersMessages.forbiden)
				done()
			})
		})
		describe('Se não é admin, nem proprietario, não acessa a rota DELETE/recipes', () => {
			let response
			before(async () => {
				const {
					body: { token },
				} = await chai.request(server).post('/login').send(otherUserLogin)
				const { body: array } = await chai.request(server).get('/recipes')
				const { _id } = array[0]

				response = await chai.request(server).delete(`/recipes/${_id}`).set('Authorization', token)
			})
			it('Retorna status: 401 II', () => {
				expect(response).to.have.status(statusCode.FORBIDEN)
			})
			it('Retorna propriedade message com valor correspondente.', (done) => {
				expect(response.body).to.have.property('message')
				expect(response.body.message).to.be.equal(usersMessages.forbiden)
				done()
			})
		})
		describe('Se não é admin, nem proprietario, não acessa a rota PUT/recipes', () => {
			let response
			before(async () => {
				const {
					body: { token },
				} = await chai.request(server).post('/login').send(otherUserLogin)
				const { body: array } = await chai.request(server).get('/recipes')
				const { _id } = array[0]

				response = await chai.request(server).put(`/recipes/${_id}/image/`).set('Authorization', token)
			})
			it('Retorna status: 401 III', () => {
				expect(response).to.have.status(statusCode.FORBIDEN)
			})
			it('Retorna propriedade message com valor correspondente. II', (done) => {
				expect(response.body).to.have.property('message')
				expect(response.body.message).to.be.equal(usersMessages.forbiden)
				done()
			})
		})
	})

	describe('Se é admin', () => {
		describe('Se é admin, acessa a rota PUT/recipes', () => {
			let response
			before(async () => {
				const {
					body: { token },
				} = await chai.request(server).post('/login').send(adminUser)
				const { body: array } = await chai.request(server).get('/recipes')
				const { _id } = array[0]

				response = await chai.request(server).put(`/recipes/${_id}`).set('Authorization', token).send(recipe)
			})
			it('Retorna status 200', () => {
				expect(response).to.have.status(statusCode.OK)
			})
		})

		describe('Se é admin,acessa a rota PUT/recipes', () => {
			let response
			before(async () => {
				const adminRes = await chai.request(server).post('/login').send(adminUser)
				const userRes = await chai.request(server).post('/login').send(correctLogin)
				const userToken = userRes.body.token
				const adminToken = adminRes.body.token

				const {
					body: {
						recipe: { _id },
					},
				} = await chai.request(server).post('/recipes').set('Authorization', userToken).send(recipe)

				const photoFile = path.resolve(__dirname, '..', 'uploads', 'ratinho.jpg')
				const content = fs.createReadStream(photoFile)

				response = await chai.request(server).put(`/recipes/${_id}/image/`).set('Authorization', adminToken).attach('image', content)
			})
			it('Retorna status: 200 III', () => {
				expect(response).to.have.status(statusCode.OK)
			})
		})

		describe('Se é admin, acessa a rota DELETE/recipes', () => {
			let response
			before(async () => {
				const {
					body: { token },
				} = await chai.request(server).post('/login').send(adminUser)
				const { body: array } = await chai.request(server).get('/recipes')
				const { _id } = array[0]

				response = await chai.request(server).delete(`/recipes/${_id}`).set('Authorization', token)
			})
			it('Retorna status: 201 II', () => {
				expect(response).to.have.status(statusCode.NO_CONTENT)
			})
		})
	})
})
