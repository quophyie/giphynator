'use strict'

const InvalidArgumentException = require ('../exceptions').InvalidArgumentException
const NotFoundException = require ('../exceptions').NotFoundException

module.exports = (err, res) => {
  if (err instanceof InvalidArgumentException) {
    res.status(400).send({error: err.message})
  } else if (err instanceof NotFoundException) {
    res.status(404).send({error: err.message})
  } else {
    res.status(500).send({error: 'Server Error: Please contact the system administrator'})
  }
  
}
