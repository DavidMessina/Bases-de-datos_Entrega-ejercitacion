module.exports = function (sequelize, dataTypes) {
    let alias = "Actor";

    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        first_name: {
            type: dataTypes.STRING
        },
        last_name: {
            type: dataTypes.STRING
        },
        rating: {
            type: dataTypes.INTEGER
        }

    }

    let config = {
        tableName: "actors",
        timestamps: false
    }

    let Actor = sequelize.define(alias, cols, config);

    Actor.associate = function (models){
        Actor.belongsTo(models.Pelicula,{
            as: "favorita",
            foreignKey: "favorite_movie_id",
            timestamps: false

        });

        Actor.belongsToMany(models.Pelicula,{
            as: "peliculas",
            through: "actor_movie",
            foreignKey: "actor_id",
            otherKey: "movie_id",
            timestamps: false
        })
    }

    return Actor;
}