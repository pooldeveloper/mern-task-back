//Rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const {check} = require('express-validator')
const loginController = require('../controllers/loginController')
const auth = require('../middlewares/auth');

//Login de usuario
//api/login

router.post('/',
    [
        check('email', 'Agrega un email valido').isEmail(),
        check('password', 'El password deve ser minimo de 6 caracteres').isLength({min: 6})
    ],
    loginController.authUser
);

router.get('/',
    auth,
    loginController.getUser
);

module.exports = router;