//Rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const {check} = require('express-validator')
const projectsController = require('../controllers/projectsController')
const auth = require('../middlewares/auth')

//api/projects
//Crea proyectos
router.post('/',
    auth,
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
    ],
    projectsController.createProject
);

//Obtner proyectos
router.get('/',
    auth,
    projectsController.getProjects
);

//Actualizar proyecto por id
router.put('/:id',
    auth,
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
    ],
    projectsController.updateProject
);

//Eliminar proyecto por id
router.delete('/:id',
    auth,
    projectsController.deleteProject
);
module.exports = router;