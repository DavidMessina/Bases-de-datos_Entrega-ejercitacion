let db = require ("../database/models")
const { check, validationResult, body } = require('express-validator');

let actoresController = {
    create: function (req, res, next) {
        db.Pelicula.findAll()
        .then(function(peliculas){
            return res.render("crearActores", {peliculas:peliculas});
        })
        
    },
    
    store: function (req, res, next) {
        
        let errors = validationResult(req);
        
        if (errors.isEmpty()) {
            db.Actor.create({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                rating: req.body.rating,
                favorite_movie_id: req.body.favorite_movie_id
            });
            
            res.redirect("/actores");
        } else {
            db.Pelicula.findAll()
            .then(function(peliculas){
                return res.render("crearActores", {errors: errors.errors, datos: req.body, peliculas:peliculas});
            })
            .catch(function(error){
                console.log(error);
            })
        }
        
    },
    
    list: function (req, res, next) {
        db.Actor.findAll({
            order: [
                ['first_name', 'ASC'], 
            ],
        }
        )
        .then(function(actores){
            res.render("listadoActores", {actores:actores})
        })
    },
    
    detail: function(req, res, next){
        db.Actor.findByPk(req.params.id,
            {include: [{association: "favorita"},{association: "peliculas"}]
        })
        .then(function(actor){
            res.render('detalleActor', {actor:actor});
        })
    },
    
    edit: function (req, res, next){
        let pedidoActor = db.Actor.findByPk(req.params.id);
        
        let pedidoPeliculas = db.Pelicula.findAll()
        
        Promise.all([pedidoActor, pedidoPeliculas])
        
        .then(function([actor, peliculas]){
            res.render("editarActor", {actor:actor, peliculas:peliculas})
        })
    },
    
    update: function(req, res, next){
        
        let errors = validationResult(req);
        if (errors.isEmpty()) {
            db.Actor.update({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                rating: req.body.rating,
                favorite_movie_id: req.body.favorite_movie_id
            },{
                where: {
                    id: req.params.id
                }
            });
            res.redirect("/actores/detail/"+ req.params.id)
        } else {
            
            let pedidoActor = db.Actor.findByPk(req.params.id);
            
            let pedidoPeliculas = db.Pelicula.findAll()
            
            Promise.all([pedidoActor, pedidoPeliculas])
            
            .then(function([actor, peliculas]){
                return res.render("editarActor", {errors: errors.errors, datos: req.body, actor:actor, peliculas:peliculas} )
            })
            .catch(function(error){
                console.log(error);
            })
        }
    },
    
    destroy: function (req, res, next){
        let pedidoActor = db.Actor.destroy({
            where:{
                id: req.params.id
            }
        });
        
        let pedidoPeliculasActores = db.PeliculasActores.destroy({
            where:{
                actor_id: req.params.id
            }
        });
        
        /*let pedidoPelicula = db.Pelicula.destroy({
            where: {
                id: req.params.id
            }
        });*/
        
        Promise.all([pedidoPeliculasActores, pedidoActor/*, pedidoPelicula*/])
        .then(function([PeliculasActores, Actor/*, Pelicula*/]){
            res.redirect("/actores")
        })
        .catch(function(error){
            console.log(error);
        })
        
    },
    
}

module.exports = actoresController