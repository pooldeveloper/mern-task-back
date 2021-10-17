//Crea la ruta(endpoint) 
const express = require('express');
const router = express.Router();
const {check} = require('express-validator')
//Imporar userController
const userController = require('../controllers/userController')

//Crear usuario 
router.post('/',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Agrega un email valido').isEmail(),
        check('password', 'El password deve ser minimo de 6 caracteres').isLength({min: 6})
    ],
    userController.createUser
);

module.exports = router;