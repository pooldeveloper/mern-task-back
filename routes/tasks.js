const express = require('express')
const router = express.Router();
const {check} = require('express-validator')
const tasksController = require('../controllers/tasksController')
const auth = require('../middlewares/auth')

//api/tasks
//Crear tarea
router.post('/',
    auth,
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('project', 'El id del proyecto es obligatorio').not().isEmpty()
    ],
    tasksController.createTask
);

//Obtner tareas por id del proyecto
router.get('/:id',
    auth,
    tasksController.getTasks
);

//Actualizar tareas por id del proyecto
router.put('/:id',
    auth,
    [
        check('project', 'El id del proyecto es obligatorio').not().isEmpty()
    ],
    tasksController.updateTask
);

//Eliminar una tarea por id 
router.delete('/:id',
    auth,
    tasksController.deleteTask
);
module.exports = router;