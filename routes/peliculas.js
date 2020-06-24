var express = require('express');
var router = express.Router();
const { check, validationResult, body } = require('express-validator');

var peliculasController = require("../controllers/peliculasController");

//Listar
router.get("/", peliculasController.list);

//Creación
router.get("/crear", peliculasController.create);

router.post("/crear", [
    check('titulo').isLength({ min: 2 }).withMessage('El título debe tener mas de 2 caracteres'),
    check('premios').isInt().withMessage('Premios debe ser un número entero'),
    check('duracion').isInt().withMessage('La duración está expresada en minutos'),
    check('rating').isDecimal().withMessage('El rating debe ser un número decimal'),
    ], peliculasController.store);

//Detalle
router.get("/detail/:id", peliculasController.detail);

//Editar
router.get("/edit/:id", peliculasController.edit);

router.put("/edit/:id", [
    check('titulo').isLength({ min: 2 }).withMessage('El título debe tener mas de 2 caracteres'),
    check('premios').isInt().withMessage('Premios debe ser un número entero'),
    check('duracion').isInt().withMessage('La duración está expresada en minutos'),
    check('rating').isDecimal().withMessage('El rating debe ser un número decimal'),
    ], peliculasController.update);

//Eliminar
router.delete("/delete/:id", peliculasController.destroy);

//Mostrar Genero
router.get("/genero/:id", peliculasController.genero);

//Mostrar actor
router.get("/actor/:id", peliculasController.actor);

//Vincular Actor con Pelicula
router.get("/vincular", peliculasController.unir);

router.post("/vincular", peliculasController.guardar);

module.exports = router;
