const User = require('../models/User');
const bcryptjs = require('bcryptjs'); 
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken');

exports.authUser = async (req, res) =>{

    //Revisar si hay errores
    const error = validationResult(req);
    if(!error.isEmpty()){
       return  res.status(400).json({error: error.array()})
    }

    //Extraer email y password 
    const{email, password}= req.body;

    try{
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({msg: 'El usuario no existe'})
        }
        let psw = await bcryptjs.compare(password, user.password)
        if(!psw){
            return res.status(400).json({msg: 'La contraseña es incorrecta'})
        }

        //Crear y firmar el JWT
        //Crearlo
        const payload = {
            user:{
                id: user.id
            }
        };
        //Firmar el JWT
        jwt.sign(payload, process.env.SECRETA,{
            expiresIn: 3600 //1 hora
        },(error, token)=>{
            if(error)throw error;

            res.json({token});
        })
    }catch(error){
        console.log(error);
        res.status(400).json({msg: 'Hubo un error'})
    }
}

exports.getUser = async (req, res) =>{

    try{
        const user = await User.findById(req.user.id);
        res.json(user);

    }catch(error){
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'})
    }
}