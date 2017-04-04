'use strict'

exports.up = function (db, callback) {
    return db.runSql(`
        CREATE TABLE giphys (
            giphy_id serial PRIMARY KEY,
            query text NOT NULL UNIQUE,
            url text NOT NULL,
            created_at timestamp DEFAULT current_timestamp NOT NULL,
            updated_at timestamp
        );
    `, callback)
}

exports.down = function (db, callback) {
    return db.runSql(`
        DROP TABLE giphys;
    `, callback)
}
