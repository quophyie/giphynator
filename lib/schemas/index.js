'use strict'

const fs = require('fs'),
    path = require('path')
var db

module.exports = function (cfg) {
    if (db) return db

    var debug = cfg.debug || console,
        Sequelize = require('sequelize'),
        sequelize = new Sequelize(cfg.DATABASE_URL, {
            logging: cfg.DISABLE_SQL_LOGGING ? false : function () {
                console.log.apply(this, arguments)
            }
        }),
        _db = {}

    sequelize.authenticate().catch(function (error) {
        console.log(error)
    })

    // read models in the current folder and import schemas into sequelize
    fs
        .readdirSync(__dirname)
        .filter(function (file) {
            return (file.indexOf('.') !== 0) && (file !== 'index.js')
        })
        .forEach(function (file) {
            var model = sequelize.import(path.join(__dirname, file))
            debug.info('Loaded model:', model.name)
            _db[model.name] = model
        })

    Object.keys(_db).forEach(function (modelName) {
        if ('associate' in _db[modelName]) {
            _db[modelName].associate(_db)
        }
    })

    _db.sequelize = sequelize
    _db.Sequelize = Sequelize

    db = _db
    return _db
}
