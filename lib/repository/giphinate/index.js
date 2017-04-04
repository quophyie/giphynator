'use strict'
const InvalidArgumentException = require ('../../exceptions').InvalidArgumentException
const NotFoundException = require ('../../exceptions').NotFoundException
const _ = require ('lodash')

class GiphyRepository {

  constructor (giphyModel) {
    if (_.isEmpty(giphyModel))
      throw new InvalidArgumentException('model cannot be null or undefined')
    
    this._giphyModel = giphyModel
  }

  insert (data) {
    if (_.isEmpty(data))
    // Native promises will not catch if exception it not wrapped in promise or promise chain
    // so we have to call  Promise.reject for native Promise.catch method to catch exception
      return Promise.reject(new InvalidArgumentException('data must not be null or undefined'))

    data.createdAt = new Date()
    return this._giphyModel.build(data).save()
  }
  
  findOneByQuery (query) {
    return this._giphyModel.findOne({where: {query: query}})
  }
  
  deleteById (id) {

    // Native promises catch will not catch if exception it not wrapped in promise or promise chain
    // so we have to call  Promise.reject for native Promise.catch method to catch exception
    if (!parseInt(id, 10))
      return Promise.reject(new InvalidArgumentException(`id must be an integer. ID=${id}`))

    return this._giphyModel
      .findById(id)
      .then((model) => {
        if (_.isEmpty(model))
          // Native promises catch here because we are in promise chain
          throw new NotFoundException('giphy not found')

        return model.destroy()
      })
  }
  
}

module.exports = GiphyRepository
