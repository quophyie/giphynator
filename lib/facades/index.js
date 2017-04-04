'use strict'

const GiphyRepository = require('../repository/giphinate')
const GiphyService = require('../service/giphy-service')
const sharedGlobals = require('../shared-globals')

//Configure Repositories and services 
const giphyRepo = new GiphyRepository(sharedGlobals.DB.Giphys)
const giphyService = new GiphyService(giphyRepo)

module.exports = {
  retrieveGiphyByQuery:  (query) => giphyService.retrieveGiphyByQuery(query),
  deleteGiphy: (id) => giphyService.deleteGiphy(id)
}

