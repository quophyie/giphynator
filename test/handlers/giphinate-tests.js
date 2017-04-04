'use strict'
const sinon = require('sinon')
const  sinonStubPromise = require('sinon-stub-promise')
sinonStubPromise(sinon)
const Code = require('code')
const expect = Code.expect

const sharedGlobals = require('../../lib/shared-globals')
const NotFoundException = require ('../../lib/exceptions').NotFoundException

sharedGlobals.DB = {
  Giphys: {dummy: null}
}
const app = require('../../index')
const supertest = require('supertest')(app)

const giphyModelInstance = {
  giphId: 1,
  query: 'funny cat',
  url: 'http://giphy.com/gifs/funny-cat-FiGiRei2ICzzG',
  createdAt: '2017-02-17T00:00:000:0000Z',
  updatedAt: null
}

const facade = require ('../../lib/facades')

describe('Giphinator Handler Tests', () => {

  describe('GET - Tests', () => {

    it ('GET - Should return  gif and return 200 ', (done) => {

      const facadeRetrieveGiphyByQuery = sinon.stub(facade, 'retrieveGiphyByQuery')
      facadeRetrieveGiphyByQuery.returnsPromise().resolves(giphyModelInstance)

      supertest
        .get('/funny')
        .expect(200)
        .then((res) => {
          facadeRetrieveGiphyByQuery.restore()
           expect(res.body).to.be.equal(giphyModelInstance)
        })
        .then(done)
        .catch(done)
      })

    it ('GET - Should return 404 given unknown giphy ', (done) => {

      const facadeRetrieveGiphyByQuery = sinon.stub(facade, 'retrieveGiphyByQuery')
      facadeRetrieveGiphyByQuery.returnsPromise().rejects(new NotFoundException('giphy not found'))

      supertest
        .get('/uyiuyoiuyuy')
        .expect(404)
        .then((res) => {
          facadeRetrieveGiphyByQuery.restore()
          expect(res.body).to.be.equal({error: 'giphy not found'})
        })
        .then(done)
        .catch(done)
    })
  })
})
