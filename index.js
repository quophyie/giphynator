'use strict'

const sharedGlobals = require('./lib/shared-globals')
if (process.env.NODE_ENV !== 'test') {
    sharedGlobals.DB = Object.freeze(require('./lib/schemas')({
        DATABASE_URL: process.env.DATABASE_URL
    }))
}
const express = require('express'),
    bodyParser = require('body-parser').json(),
    giphinateHandler = require('./lib/handlers/giphinate'),
    giphinateDeleteHandler = require('./lib/handlers/giphinate-delete'),
    app = express()

app
.use(bodyParser)
.get('/:queryText', giphinateHandler)
.delete('/:id', giphinateDeleteHandler)

.listen(process.env.PORT, function () {
    console.log(`Listening on port ${process.env.PORT}`)
})

module.exports = app
