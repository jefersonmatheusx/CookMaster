const { MongoClient } = require('mongodb')
const chai = require('chai')
const server = require('../api/app')
const { adminUser, newAdmin, correctLogin, newUser, newAdminUser } = require('./helpersObjects')
const { statusCode, usersMessages } = require('../api/utils/StatusCode')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const { expect } = chai
const mongoDbUrl = `mongodb://${process.env.HOST || 'mongodb'}:27017/Cookmaster`

describe('Valida a rota post /users/admin', () => {
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
		// MongoClient.connect.restore()
		await connection.close()
	})
	describe('Testa caso de sucesso na rota /users/admin', () => {
		let response

		before(async () => {
			await db.collection('users').insertOne(newAdminUser)
			const {
				body: { token },
			} = await chai.request(server).post('/login').send(adminUser)
			response = await chai.request(server).post('/users/admin').set('Authorization', token).send(newAdmin)
		})
		after(async () => {
			await db.collection('users').deleteMany({})
		})
		it('Retorna status 201', (done) => {
			expect(response).to.have.status(statusCode.CREATED)
			done()
		})
		it('Espera que o retorno em body seja um objeto com a propriedade "user"', (done) => {
			expect(response.body).to.be.an('object')
			expect(response.body).to.be.property('user')
			done()
		})
		it('Espera que o objeto "user" tenha a propriedade "name"', (done) => {
			expect(response.body.user).to.be.property('name')
			expect(response.body.user['name']).to.be.a('string')
			expect(response.body.user.name).to.be.equal(newAdmin.name)
			done()
		})
		it('Espera que o objeto "user" tenha a propriedade "email"', (done) => {
			expect(response.body.user).to.be.property('email')
			expect(response.body.user['email']).to.be.a('string')
			expect(response.body.user.email).to.be.equal(newAdmin.email)
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
			expect(response.body.user.role).to.be.equal('admin')
			done()
		})
	})
	describe('Testa caso de falha na rota /users/admin se role:user', () => {
		let response

		before(async () => {
			await chai.request(server).post('/users').send(newUser)
			const {
				body: { token },
			} = await chai.request(server).post('/login').send(correctLogin)
			response = await chai.request(server).post('/users/admin').set('Authorization', token).send(newAdmin)
		})
		after(async () => {
			await db.collection('users').deleteOne({ email: newUser.email })
		})
		it('verifica se retorna status "401"', (done) => {
			expect(response).to.have.status(statusCode.FORBIDEN)
			done()
		})
		it('verifica se "message" corresponde a "Only admins can register new admins"', (done) => {
			expect(response.body.message).to.be.equals(usersMessages.onlyAdmin)
			done()
		})
	})
})
