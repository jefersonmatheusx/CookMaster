const chai = require('chai')
const server = require('../api/app')
const { statusCode } = require('../api/utils/StatusCode')

const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const { expect } = chai
describe('Teste da rota / ', () => {
	describe('Teste de sucesso na rota /', () => {
		let response
		before(async () => {
			response = await chai.request(server).get('/')
		})
		it('Retorna status 200', (done) => {
			expect(response).to.have.status(statusCode.OK)
			done()
		})
	})
})
