var express = require('express');
var router = express.Router();
const { check, validationResult, body } = require('express-validator');

var actoresController = require("../controllers/actoresController");

//Listar
router.get("/", actoresController.list);

//Creación
router.get("/crear", actoresController.create);

router.post("/crear", [
    check('first_name').isLength({ min: 2 }).withMessage('El nombre debe tener más de 2 caracteres'),
    check('last_name').isLength({ min: 2 }).withMessage('El nombre debe tener más de 2 caracteres'),
    check('rating').isDecimal().withMessage('El rating debe ser un número decimal'),
    ], actoresController.store);

//Detalle
router.get("/detail/:id", actoresController.detail);

//Editar
router.get("/edit/:id", actoresController.edit);

router.put("/edit/:id", [
    check('first_name').isLength({ min: 2 }).withMessage('El nombre debe tener más de 2 caracteres'),
    check('last_name').isLength({ min: 2 }).withMessage('El nombre debe tener más de 2 caracteres'),
    check('rating').isDecimal().withMessage('El rating debe ser un número decimal'),
    ], actoresController.update);

//Eliminar
router.delete("/delete/:id", actoresController.destroy);

//Mostrar Genero
//router.get("/genero/:id", actoresController.genero);

//Mostrar peliculas
//router.get("/peliculas/:id", actoresController.actor);

/*
Vincular Actor con Pelicula
router.get("/vincular", actoresController.unir);

router.post("/vincular", actoresController.guardar);
*/
module.exports = router;
