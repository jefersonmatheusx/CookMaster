const { MongoClient } = require('mongodb')
const chai = require('chai')
const server = require('../api/app')
const { statusCode } = require('../api/utils/statusCode')
const path = require('path')
const { newUser, correctLogin, recipe } = require('./helpersObjects')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const fs = require('fs')

const mongoDbUrl = `mongodb://${process.env.HOST || 'mongodb'}:27017/Cookmaster`

const { expect } = chai
describe('Teste com a rota de IMAGENS em recipes: PUT & GET', () => {
	// let connection
	// before(async () => {
	// 	connection = await MongoClient.connect(mongoDbUrl, {
	// 		useNewUrlParser: true,
	// 		useUnifiedTopology: true,
	// 	})
	// 	db = connection.db('Cookmaster')
	// 	db.collection('users').insert(newAdminUser)
	// })

	describe('Testes da rota PUT /recipes/:id/image', () => {
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

			const photoFile = path.resolve(__dirname, '..', 'uploads', 'ratinho.jpg')
			const content = fs.createReadStream(photoFile)

			response = await chai.request(server).put(`/recipes/${_id}/image/`).set('Authorization', token).attach('image', content)
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

	describe('Testes da rota GET /recipes/:id.jpeg', () => {
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

			const photoFile = path.resolve(__dirname, '..', 'uploads', 'ratinho.jpg')
			const content = fs.createReadStream(photoFile)

			await chai.request(server).put(`/recipes/${_id}/image/`).set('Authorization', token).attach('image', content)

			response = await chai.request(server).get(`/images/${_id}.jpeg`).set('Authorization', token)
		})

		it('retorna status de 200, e um objeto', (done) => {
			expect(response).to.have.status(statusCode.OK)
			done()
		})
		it('o objeto retornado contem o conteúdo alterado da receita', (done) => {
			console.log(response)
			const { header } = response
			expect(header['content-type']).to.be.equals('image/jpeg')
			done()
		})
	})

	// after(async () => {
	// 	await db.collection('users').deleteMany({})
	// 	await db.collection('recipes').deleteMany({})
	// })
})
