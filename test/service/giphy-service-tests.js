'use strict'
const sinon = require('sinon')
const  sinonStubPromise = require('sinon-stub-promise')
sinonStubPromise(sinon)
const moment = require('moment')
const Code = require('code')
const expect = Code.expect
const _ = require('lodash')
const axios = require('axios')
const InvalidArgumentException = require ('../../lib/exceptions').InvalidArgumentException
const NotFoundException = require ('../../lib/exceptions').NotFoundException

const GiphyRepository = require('../../lib/repository/giphinate')
const GiphyService = require('../../lib/service/giphy-service')

const giphsInstanceDate = moment('2017-02-17')

const giphyModelInstance = {
  giphId: 1,
  query: 'funny cat',
  url: 'http://giphy.com/gifs/funny-cat-FiGiRei2ICzzG',
  createdAt: giphsInstanceDate,
  updatedAt: null
}

const giphysModel = {
  build: (data) => giphysModel,
  save: (data) => giphyModelInstance,
  findOne: (query)  => giphyModelInstance,
  findById: (id)  => giphysModel,
  destroy: (id) => 1
}

const giphyObjFromAPI = {
  type: 'gif',
  id: 'FiGiRei2ICzzG',
  slug: 'funny-cat-FiGiRei2ICzzG',
  url: 'http://giphy.com/gifs/funny-cat-FiGiRei2ICzzG',
  bitly_gif_url: 'http://gph.is/1fIdLOl',
  bitly_url: 'http://gph.is/1fIdLOl',
  embed_url: 'http://giphy.com/embed/FiGiRei2ICzzG',
  username: '',
  source: 'http://tumblr.com',
  rating: 'g',
  caption: '',
  content_url: '',
  source_tld: 'tumblr.com',
  source_post_url: 'http://tumblr.com',
  import_datetime: '2014-01-18 09:14:20',
  trending_datetime: '1970-01-01 00:00:00'
}

describe ('GiphyService Tests', () => {
  let giphyModelStub, giphyRepo, giphyService

  beforeEach(() => {
    giphyRepo = new GiphyRepository(giphysModel)
    giphyService = new GiphyService(giphyRepo)
  })

  afterEach(() => {
    giphyRepo = null
    giphyService = null
    sinon.restore(giphyModelStub)
  })

  describe('GiphyService Constructor Tests ', () => {
    it (`should should throw InvalidArgumentException if
      the GiphyRepository instance passed to GiphyService constructor is null`, () => {
      const throws = () => new GiphyService(null)
      expect(throws).to.throw(InvalidArgumentException,
        `giphyRepository cannot be null or undefined and must be an instance of GiphyRepository`)
    })

    it (`should should throw InvalidArgumentException if the GiphyRepository
         instance passed to GiphyService constructor is undefined`, () => {
        const throws = () => new GiphyService(undefined)
        expect(throws).to.throw(InvalidArgumentException,
          'giphyRepository cannot be null or undefined and must be an instance of GiphyRepository')
    })

    it (`should should throw InvalidArgumentException if the GiphyRepository
         instance passed to GiphyService constructor is undefined`,
      () => {
      const throws = () => new GiphyService({test: () => {}})
      expect(throws).to.throw(InvalidArgumentException,
        'giphyRepository cannot be null or undefined and must be an instance of GiphyRepository')
    })
  })

  describe('RetrieveGiphyByQuery Tests ', () => {

    let axiosGetStub
    beforeEach(() => {
      axiosGetStub = sinon.stub(axios, 'get')
    })
    afterEach(() => {
      sinon.restore(axiosGetStub)
    })
    it('should throw InvalidArgumentException if query is not a string',
      () => {

        const throws = () => giphyService.retrieveGiphyByQuery(null)
        expect(throws).to.throw(InvalidArgumentException, 'query must be a string')
      })

    it('Should return a giffy from DB if the giffy is already in the db', () => {

      const giphyRepoFindOneByQueryStub = sinon.stub(giphyRepo, 'findOneByQuery')
      giphyRepoFindOneByQueryStub.returnsPromise().resolves(giphyModelInstance)

      let query = 'funny cat'

      return giphyService.retrieveGiphyByQuery(query)
        .then((result) => {
          giphyRepoFindOneByQueryStub.restore()
          expect(result).to.equal(giphyModelInstance)
      })
    })

    it('Should return a giffy from the giphy API when giphy is not in Db', () => {

      const giphyRepoFindOneByQueryStub = sinon.stub(giphyRepo, 'findOneByQuery')
      giphyRepoFindOneByQueryStub.returnsPromise().resolves({})

      const data = {
       data: {
          data: [giphyObjFromAPI]
        }
      }

      axiosGetStub.returnsPromise().resolves(data)

      const query = 'funny cat'
      return giphyService.retrieveGiphyByQuery(query)
        .then((result) => {
          axiosGetStub.restore()
          giphyRepoFindOneByQueryStub.restore()
          expect(result).to.equal(giphyModelInstance)
        })
    })

    it('Should throw a NotFoundException if giphy API returns empty data array in result', () => {

      const giphyRepoFindOneByQueryStub = sinon.stub(giphyRepo, 'findOneByQuery')
      giphyRepoFindOneByQueryStub.returnsPromise().resolves({})

      axiosGetStub.returnsPromise().resolves({data: {}})
      const query = 'not funny cat'

      return giphyService.retrieveGiphyByQuery(query)
        .then(null,(err) => {
          axiosGetStub.restore()
          giphyRepoFindOneByQueryStub.restore()
          expect(err).to.be.instanceof(NotFoundException)
          expect(err.message).to.be.equal('giphy not found')
        })

    })

    it('Should throw a NotFoundException if giphy API returns empty result', () => {
      const giphyRepoFindOneByQueryStub = sinon.stub(giphyRepo, 'findOneByQuery')
      giphyRepoFindOneByQueryStub.returnsPromise().resolves({})
      axiosGetStub.returnsPromise().resolves(null)

      let query = 'not funny cat'
      return giphyService.retrieveGiphyByQuery(query)
          .then(null, (err) => {
            axiosGetStub.restore()
            giphyRepoFindOneByQueryStub.restore()
            expect(err).to.be.instanceof(NotFoundException)
            expect(err.message).to.be.equal('giphy not found')
          })
      })

  })

  describe('AddGiphy Tests ', () => {

    it('Should add new Giphy and return the added giphy', () => {

      const saveData = _.omit(giphyModelInstance, ['id', 'createdAt', 'updatedAt'])
      const giphyRepoFindOneByQueryStub = sinon.stub(giphyRepo, 'insert')
      giphyRepoFindOneByQueryStub.returnsPromise().resolves(giphyModelInstance)
      giphyService.addGiphy(saveData).then((result) => expect(result).to.equal(giphyModelInstance))

    })
  })

  describe('Delete Giphy Tests ', () => {

    it('Should delete a giphy from the Db and return the number of rows deleted', () => {

      const giphyRepoByIdByStub = sinon.stub(giphyRepo, 'deleteById')
      const numRowsDeleted = 1
      giphyRepoByIdByStub.returnsPromise().resolves(numRowsDeleted)
      giphyService.deleteGiphy(1).then((result) => expect(result).to.equal(numRowsDeleted))

    })

  })

})
