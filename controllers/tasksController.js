const Tasks = require('../models/Tasks')
const Projects = require('../models/Projects')

const {validationResult} = require('express-validator')

//Crear tarea 
exports.createTask = async (req, res) =>{
    //Revisar si hay errores
    const error = validationResult(req);
    if(!error.isEmpty()){
       return  res.status(400).json({error: error.array()})
    }
    try {
        const {project} = req.body;
        const exProject = await Projects.findById(project);

        if(!exProject){
            return  res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        //Verificar el creador del proyecto
        if(exProject.creator.toString() !== req.user.id){
            return res.status(401).json({msg: 'Usted no esta autorizado'})
        }

        const task = new Tasks(req.body)

        //Guardar el creador via JWT
        task.project = project

        //Guardamos el proyecto
        await task.save();

        res.json(task);
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'})
    }
}

//Obtner tareas por id del proyecto
exports.getTasks = async (req, res) =>{
    try {
        const exProject = await Projects.findById(req.params.id);

        //Reviasr si el proyecto existe
        if(!exProject){
            return res.status(404).json({msg: 'Projecto no encontrado'})
        }

        //Verificar el creador del proyecto
        if(exProject.creator.toString() !== req.user.id){
            return res.status(401).json({msg: 'Usted no esta autorizado'})
        }

        //Otner tareas del proyecto
        const tasks = await Tasks.find({project: req.params.id}).sort({_id:-1});
        res.json(tasks)
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'})
    }
}

//Actualizar proyecto por id
exports.updateTask = async (req, res) =>{
    //Revisar si hay errores
    const error = validationResult(req);
    if(!error.isEmpty()){
       return  res.status(400).json({error: error.array()})
    }

    try {
        //Extaer valores
        const{name, project, state} = req.body;

        //Revisar el id 
        let exTask = await Tasks.findById(req.params.id);
        //Reviasr si la tarea existe
        if(!exTask){
            return res.status(404).json({msg: 'Tarea no encontrada'})
        }

        const exProject = await Projects.findById(project);
        //Verificar el creador del proyecto
        if(exProject.creator.toString() !== req.user.id){
            return res.status(401).json({msg: 'Usted no esta autorizado'})
        }
        let newTask = {};
        newTask.name = name
        newTask.state = state
        //Actualizar
        task = await Tasks.findByIdAndUpdate({_id: req.params.id}, newTask, {new: true});
        res.json(task)
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'})
    }
}

//Eliminar tare por id
exports.deleteTask = async (req, res) =>{
    try {
        const{project} = req.query;
        //Revisar el id 
        let exTask = await Tasks.findById(req.params.id);
        //Reviasr si el proyecto existe
        if(!exTask){
            return res.status(404).json({msg: 'Tarea no encontrada'})
        }
        const exProject = await Projects.findById(project);
        //Verificar el creador del proyecto
        if(exProject.creator.toString() !== req.user.id){
            return res.status(401).json({msg: 'Usted no esta autorizado'})
        }
        //Eliminar
        await Tasks.findOneAndRemove({_id: req.params.id})
        res.json({msg: 'Tarea eliminada exitosamente'})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'})
    }
}