let db = require ("../database/models")
const { check, validationResult, body } = require('express-validator');

let peliculasController = {
    create: function (req, res, next) {
        db.Genero.findAll()
        .then(function(generos){
            return res.render("crearPeliculas", {generos:generos});
        })
        
    },
    
    store: function (req, res, next) {
        
        let errors = validationResult(req);
        
        if (errors.isEmpty()) {
            db.Pelicula.create({
                title: req.body.titulo,
                awards: req.body.premios,
                release_date: req.body.fecha_estreno,
                genre_id: req.body.genero,
                length: req.body.duracion,
                rating: req.body.rating
            });
            res.redirect("/peliculas");
        } else {
            db.Genero.findAll()
            .then(function(generos){
                return res.render("crearPeliculas", {errors: errors.errors, datos: req.body, generos:generos});
            })
            .catch(function(error){
                console.log(error);
            })
        }
        
    },
    
    list: function (req, res, next) {
        db.Pelicula.findAll({
            order: [
                ['title', 'ASC'], 
            ],
        })
        .then(function(peliculas){
            res.render("listadoPeliculas", {peliculas:peliculas})
        })
    },
    
    detail: function(req, res, next){
        db.Pelicula.findByPk(req.params.id,
            {include: [{association: "genero"},
            {association: "actores"}]
        })
        .then(function(pelicula){
            res.render('detallePelicula', {pelicula:pelicula});
        })
    },
    
    edit: function (req, res, next){
        let pedidoPelicula = db.Pelicula.findByPk(req.params.id);
        
        let pedidoGeneros = db.Genero.findAll()
        
        Promise.all([pedidoPelicula, pedidoGeneros])
        
        .then(function([pelicula, generos]){
            res.render("editarPelicula", {pelicula:pelicula, generos:generos} )
        })
    },
    
    update: function(req, res, next){
        
        let errors = validationResult(req);
        if (errors.isEmpty()) {
            db.Pelicula.update({
                title: req.body.titulo,
                awards: req.body.premios,
                //release_date: req.body.fecha_estreno,
                genre_id: req.body.genero,
                length: req.body.duracion ,
                rating: req.body.rating
            },{
                where: {
                    id: req.params.id
                }
            });
            res.redirect("/peliculas/detail/"+ req.params.id)
        } else {
            
            let pedidoPelicula = db.Pelicula.findByPk(req.params.id);
            
            let pedidoGeneros = db.Genero.findAll()
            
            Promise.all([pedidoPelicula, pedidoGeneros])
            
            .then(function([pelicula, generos]){
                return res.render("editarPelicula", {errors: errors.errors, datos: req.body, pelicula:pelicula, generos:generos} )
            })
            .catch(function(error){
                console.log(error);
            })
        }
    },
    
    destroy: function (req, res, next){
        let pedidoActor = db.Actor.update({
            favorite_movie_id: "null"
        },{
            where:{
                favorite_movie_id: req.params.id
            }
        });
        
        let pedidoPeliculasActores = db.PeliculasActores.destroy({
            where:{
                movie_id: req.params.id
            }
        });
        
        let pedidoPelicula = db.Pelicula.destroy({
            where: {
                id: req.params.id
            }
        });
        
        Promise.all([pedidoPeliculasActores, pedidoActor, pedidoPelicula])
        .then(function([PeliculasActores, Actor, Pelicula]){
            res.redirect("/peliculas")
        })
        .catch(function(error){
            console.log(error);
        })
        
    },
    
    genero: function (req, res, next){
        let pedidoGenero = db.Genero.findByPk(req.params.id);
        
        let pedidoPeliculas = db.Pelicula.findAll({
            where: {
                genre_id: req.params.id
            }
        });
        
        Promise.all([pedidoPeliculas, pedidoGenero])
        
        .then(function([peliculas, genero]){
            res.render("generoPelicula", {peliculas:peliculas, genero:genero} )
        })
    },
    
    actor: function (req, res, next){
        let pedidoActor = db.Actor.findByPk(req.params.id);
        
        let pedidoActorPelicula =db.PeliculasActores.findAll({
            where:{
                actor_id:req.params.id
            }
        })
        
        let pedidoPeliculas = db.Pelicula.findAll() 
        
        Promise.all([pedidoPeliculas, pedidoActorPelicula, pedidoActor])
        
        .then(function([peliculas, peliculasActor, actor]){
            res.render("actorPelicula", {peliculas:peliculas, peliculasActor:peliculasActor, actor:actor} )
        })
    },
    
    unir: function (req, res, next) {
        let pedidoActor = db.Actor.findAll()
        let pedidoPelicula = db.Pelicula.findAll()
        
        Promise.all([pedidoActor, pedidoPelicula])
        .then(function([actores, peliculas]){
            res.render("vincular", {actores:actores, peliculas:peliculas});
        })
    },
    
    guardar: function (req, res, next) {
        db.PeliculasActores.create({
            actor_id : req.body.actor,
            movie_id: req.body.pelicula,
            
        });
        res.redirect("/peliculas/actor/"+ req.body.actor);
        
    }
    
    
}

module.exports = peliculasController

