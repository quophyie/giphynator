'use strict'

/** zconst schemas = require('../schemas')({
    DATABASE_URL: process.env.DATABASE_URL
})*/

const facade = require ('../facades')
const processErrorMessages = require ('./processErrorMessages')

/**
 * @params req.params.queryText {String} Text to query giphy for
 */
module.exports =  (req, res) => {
    // call to the giphy API using the `req.params.queryText` string

    // return the the gif URL, cache it for the next time the same query is used

     facade.retrieveGiphyByQuery(req.params.queryText, res)
      .then(result => res.json(result))
      .catch(err => processErrorMessages(err, res))
    
}
