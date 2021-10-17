const User = require('../models/User');
const bcryptjs = require('bcryptjs'); 
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken');

//Ingresa la base de datos al registro

exports.createUser = async (req, res) =>{

    //Revisar si hay errores
    const error = validationResult(req);
    if(!error.isEmpty()){
       return  res.status(400).json({error: error.array()})
    }

    //Extraer email y password 
    const{email, password}= req.body;

    try{
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({msg: 'El usuario ya existe'})
        }else{
            //crea el nuevo usuario
            user = new User(req.body);
        }

        //Hashear el password
        const salt = await bcryptjs.genSalt(10)
        user.password = await bcryptjs.hash(password, salt);

        //guardamos el usuario
        await user.save();

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
    }
}