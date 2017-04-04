'use strict'
const sinon = require('sinon')
const  sinonStubPromise = require('sinon-stub-promise')
sinonStubPromise(sinon)
const moment = require('moment')
const Code = require('code')
const expect = Code.expect
const _ = require('lodash')
const InvalidArgumentException = require ('../../lib/exceptions').InvalidArgumentException
const NotFoundException = require ('../../lib/exceptions').NotFoundException

const GiphyRepository = require('../../lib/repository/giphinate')
const giphsInstanceDate = moment('2017-02-17')

const giphsInstance = {
  giphId: 1,
  query: 'funny cat',
  url: 'http://giphy.com/gifs/funny-cat-FiGiRei2ICzzG',
  createdAt: giphsInstanceDate,
  updatedAt: null
}

const giphysModel = {
  save: (data) => giphsInstance,
  build: (data) => giphysModel,
  findOne: (query)  => giphsInstance,
  findById: (id)  => giphysModel,
  destroy: (id) => 1
}

describe('Giphinate Repo Tests', () => {

  let giphyRepo
   
  beforeEach(() => {
    giphyRepo = new GiphyRepository(giphysModel)
  })

  afterEach(() => {
    giphyRepo = null
  })

  describe('FindOneByQuery Tests', () => {
    it('Should throw InvalidArgumentException if model is undefined', () => {

      let createRepo = () => {
        new GiphyRepository()
      }
      expect(createRepo).to.throw(InvalidArgumentException, 'model cannot be null or undefined')
    })

    it('Should throw InvalidArgumentException if model is null', () => {

      let createRepo = () => {
        new GiphyRepository(null)
      }
      expect(createRepo).to.throw(InvalidArgumentException, 'model cannot be null or undefined')
    })

    it('Should return model instance with query "funny cat"', () => {

      let query = 'funny cat'
      const result = giphyRepo.findOneByQuery(query)
      expect(result).to.be.an.object().and.to.equal(giphsInstance)
    })

    it('Should return null for model with query "no funny cat"', () => {

      let query = 'no funny cat'
      let giphyModelStub = sinon.stub(giphysModel, 'findOne', (query) => (null))
      const result = giphyRepo.findOneByQuery(query)

      giphyModelStub.restore()

      expect(result).to.be.null()
    })
  })

  describe('Insert Tests', () => {

    it ('Should insert data into DB return the saved giphy', () => {
      const saveData = _.omit(giphsInstance, ['id', 'createdAt', 'updatedAt'])
      const result = giphyRepo.insert(saveData)

      expect(result).to.equal(giphsInstance)
    })

    it ('Should throw InvalidArgumentException given null data', () => {

      giphyRepo.insert(null)
        .catch(err => {
          expect(err).to.be.an.instanceof(InvalidArgumentException)
          expect(err.message).to.be.equal('data must not be null or undefined')
        })

    })

    it ('Should throw InvalidArgumentException given undefined data', () => {

      giphyRepo.insert(undefined)
        .catch(err => {
          expect(err).to.be.an.instanceof(InvalidArgumentException)
          expect(err.message).to.be.equal('data must not be null or undefined')
        })
    })

    it ('Should throw InvalidArgumentException given empty data', () => {

      giphyRepo.insert({})
        .catch(err => {
          expect(err).to.be.an.instanceof(InvalidArgumentException)
          expect(err.message).to.be.equal('data must not be null or undefined')
        })
    })

  })

  describe('Delete Tests', () => {

    it ('Should return the saved giphy', () => {

      const deletedRowsArr = []
      const giphyModelFindByIdStub = sinon.stub(giphysModel, 'findById')
      giphyModelFindByIdStub.returnsPromise().resolves(giphysModel)

      let giphyModelDestroyMethdStub = sinon.stub(giphysModel, 'destroy')
      giphyModelDestroyMethdStub.returnsPromise().resolves(deletedRowsArr)

       return giphyRepo.deleteById(giphsInstance.giphId)
         .then((result) => {
           giphyModelDestroyMethdStub.restore()
           giphyModelFindByIdStub.restore()
           expect(result).to.equal(deletedRowsArr)
         })
    })

    it ('Should throw InvalidArgumentException when ID is not a number', () => {

      const deletedRowsArr = []
      const giphyModelFindByIdStub = sinon.stub(giphysModel, 'findById')
      giphyModelFindByIdStub.returnsPromise().resolves(giphysModel)

      let giphyModelDestroyMethdStub = sinon.stub(giphysModel, 'destroy')
      giphyModelDestroyMethdStub.returnsPromise().resolves(deletedRowsArr)

      return giphyRepo.deleteById('jkjlkjlkj')
        .catch((err) => {
          giphyModelFindByIdStub.restore()
          expect(err).to.be.an.instanceof(InvalidArgumentException)
          expect(err.message).to.be.equal('id must be an integer. ID=jkjlkjlkj')
        })
    })

    it ('Should throw NotFoundException when if giphy with given ID does not exist', () => {

      const giphyModelFindByIdStub = sinon.stub(giphysModel, 'findById')
      giphyModelFindByIdStub.returnsPromise().resolves(null)

      return giphyRepo.deleteById(10000)
        .catch((err) => {
          giphyModelFindByIdStub.restore()
          expect(err).to.be.an.instanceof(NotFoundException)
          expect(err.message).to.be.equal('giphy not found')
        })
    })

  })

})
