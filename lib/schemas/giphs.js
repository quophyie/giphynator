'use strict'

module.exports = function (sequelize, DataTypes) {
    let Giphys = sequelize.define('Giphys', {
        giphId: {
            field: 'giphy_id',
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        query: {
            type: DataTypes.TEXT,
            unique: true
        },
        url: {
            type: DataTypes.TEXT
        },
        createdAt: {
            field: 'created_at',
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: 'current_timestamp'
        },
        updatedAt: {
            field: 'updated_at',
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'giphys',
        timestamps: false
    })
    return Giphys
}
