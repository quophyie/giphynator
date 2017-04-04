'use strict'

const _  = require('lodash')
const axios = require('axios')
const urlencode = require('urlencode')

const GIPHY_ROOT_URL = require('../../enums').GIPHY_ROOT_URL
const GIPHY_API_KEY = require('../../enums').GIPHY_API_KEY
const NotFoundException = require('../../exceptions').NotFoundException
const InvalidArgumentException = require ('../../exceptions').InvalidArgumentException

const GiphyRepository = require('../../../lib/repository/giphinate')

class GiphyService {

  constructor (giphyRepository) {
    if (_.isEmpty(giphyRepository) || !(giphyRepository instanceof GiphyRepository))
      throw new InvalidArgumentException(
        'giphyRepository cannot be null or undefined and must be an instance of GiphyRepository')
    this._giphyRepository = giphyRepository
  }
  
  addGiphy (data) {
    return this._giphyRepository.insert(data)
  }
  
  deleteGiphy (id) {
    return this._giphyRepository.deleteById(id)
  }

  /**
   * Retrieves a single giphy based on query. If the giphy is in the local DB,  it requrned from the local DB
   * otherwise it is retrieved from the Giffy API
   * @param query
   * @returns {*|Promise<R>|Promise<R2|R1>|Promise.<TResult>}
   */
   retrieveGiphyByQuery (query) {
    if (typeof (query) !== 'string')
      throw new InvalidArgumentException('query must be a string')

    return this._giphyRepository
      .findOneByQuery(query)
      .then((giphy) => {

        // The giphy is in the cache (DB) return it
        if (!_.isEmpty(giphy)) {
          return giphy
        }

        const urlEncodedQuery = urlencode(query)
        const giphySearchUrl = `${GIPHY_ROOT_URL}/search?q=${urlEncodedQuery}&api_key=${GIPHY_API_KEY}`

        return axios.get(giphySearchUrl)
          .then((result) => {
            if (_.isEmpty(result) || _.isEmpty(result.data) || _.isEmpty(result.data.data))
              throw new NotFoundException('giphy not found')
            
            const url = result.data.data[0].url
            const giphyDataToInsert =  Object.assign({},  {query, url})
            return this.addGiphy(giphyDataToInsert)
          })
          .then(addedGiphy => addedGiphy)
      })
  }
  
}

module.exports = GiphyService
