'use strict'
const sinon = require('sinon')
const  sinonStubPromise = require('sinon-stub-promise')
sinonStubPromise(sinon)
const Code = require('code')
const expect = Code.expect

const sharedGlobals = require('../../lib/shared-globals')
const NotFoundException = require ('../../lib/exceptions').NotFoundException
const InvalidArgumentException = require ('../../lib/exceptions').InvalidArgumentException

sharedGlobals.DB = {
  Giphys: {dummy: null}
}
const app = require('../../index')
const supertest = require('supertest')(app)

const facade = require ('../../lib/facades')

describe('Giphinator - Delete Handler Tests', () => {

  describe('DELETE - Tests', () => {
    
    it ('DELETE - Should delete  gif and return 200 ', (done) => {
      
      const facadeDeleteGiphyStub = sinon.stub(facade, 'deleteGiphy')
      facadeDeleteGiphyStub.returnsPromise().resolves([])
      
      supertest
        .delete('/1')
        .expect(200)
        .then((res) => {
          facadeDeleteGiphyStub.restore()
           expect(res.body).to.be.equal({message: 'OK'})
        })
        .then(done)
        .catch(done)

      })

    it ('DELETE - Should return 404 given unknown giphy ID ', (done) => {
      
      const facadeDeleteGiphyStub = sinon.stub(facade, 'deleteGiphy')
      const msg = 'giphy not found'
      facadeDeleteGiphyStub.returnsPromise().rejects(new NotFoundException(msg))
      
      supertest
        .delete('/876')
        .expect(404)
        .then((res) => {
          facadeDeleteGiphyStub.restore()
          expect(res.body).to.be.equal({error: msg})
        })
        .then(done)
        .catch(done)

    })

    it ('DELETE - Should return 400 if a number is not given as the ID ', (done) => {
      
      const facadeDeleteGiphyStub = sinon.stub(facade, 'deleteGiphy')
      const msg = 'id must be an integer. ID = uyiuyoiuyuy'
      facadeDeleteGiphyStub.returnsPromise().rejects(new InvalidArgumentException(msg))
      
      supertest
        .delete('/uyiuyoiuyuy')
        .expect(400)
        .then((res) => {
          facadeDeleteGiphyStub.restore()
          expect(res.body).to.be.equal({error: msg})
        })
        .then(done)
        .catch(done)

    })
  })
})
