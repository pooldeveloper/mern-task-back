const Projects = require('../models/Projects')
const {validationResult} = require('express-validator')

//Crear proyecto 
exports.createProject = async (req, res) =>{
    //Revisar si hay errores
    const error = validationResult(req);
    if(!error.isEmpty()){
       return  res.status(400).json({error: error.array()})
    }

    try {
        const project = new Projects(req.body)

        //Guardar el creador via JWT
        project.creator = req.user.id

        //Guardamos el proyecto
        project.save();

        res.json(project);
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'})
    }
}

//Obtener todo los proyectos del usuario
exports.getProjects = async (req, res) =>{
    try {
        const projects = await Projects.find({creator: req.user.id}).sort({_id:-1}) ;
        res.json(projects)
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'})
    }
}


//Actualizar proyecto por id
exports.updateProject = async (req, res) =>{
    //Revisar si hay errores
    const error = validationResult(req);
    if(!error.isEmpty()){
        return  res.status(400).json({error: error.array()})
    }
    const{name} = req.body;
    const newProject = {};
    if(name){
        newProject.name = name;
    }
    try {
        //Revisar el id 
        let project = await Projects.findById(req.params.id);
        //Reviasr si el proyecto existe
        if(!project){
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }
        //Verificar el creador del proyecto
        if(project.creator.toString() !== req.user.id){
            return res.status(401).json({msg: 'Usted no esta autorizado'})
        }
        //Actualizar
        project = await Projects.findByIdAndUpdate({_id: req.params.id}, {$set: newProject}, {new: true});
        res.json({project})
       
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'})
    }
}

//Eliminar proyecto por id
exports.deleteProject = async (req, res) =>{

    try {

        //Revisar el id 
        let project = await Projects.findById(req.params.id);
        //Reviasr si el proyecto existe
        if(!project){
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }
        //Verificar el creador del proyecto
        if(project.creator.toString() !== req.user.id){
            return res.status(401).json({msg: 'Usted no esta autorizado'})
        }
        //Eliminar
        await Projects.findOneAndRemove({_id: req.params.id})
        res.json({msg: 'Proyecto eliminado exitosamente'})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'})
    }
}