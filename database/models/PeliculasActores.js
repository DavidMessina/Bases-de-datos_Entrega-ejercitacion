module.exports = function (sequelize, dataTypes) {
    let alias = "PeliculasActores";

    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        actor_id: {
            type: dataTypes.INTEGER
        },
        movie_id: {
            type: dataTypes.INTEGER
        },
    }

    let config = {
        tableName: "actor_movie",
        timestamps: false
    }

    let PeliculasActores = sequelize.define(alias, cols, config);

    return PeliculasActores
}