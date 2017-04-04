'use strict'
const createError = require('create-error')

module.exports = Object.freeze({
 InvalidArgumentException: createError('InvalidArgumentException'),
 NotFoundException: createError('NotFoundException')
})
