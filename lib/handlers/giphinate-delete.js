'use strict'

const facade = require ('../facades')
const processErrorMessages = require ('./processErrorMessages')
/*const schemas = require('../schemas')({
    DATABASE_URL: process.env.DATABASE_URL
}) */

/**
 * @params req.params.queryText {String} Text to query giphy for
 */
module.exports =  (req, res) => {
     facade.deleteGiphy(req.params.id)
      .then(result => res.json({message: 'OK'}))
      .catch(err => processErrorMessages(err, res))
}
