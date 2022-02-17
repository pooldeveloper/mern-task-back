//Importar express
const express = require('express');
//Importar DB
const connectDB  = require('./config/db') ;
//Importar cors
const cors = require('cors')

//Crear servidor
const app = express();

//Defenir un dominio(s) para recibir peticiones
const whiteList=[process.env.FRONTEND_URL]
const corsOptions = {
    origin: (origin, callback) =>{
        const exists = whiteList.some(domain => domain === origin);
        if(exists){
            callback(null, true)
        }else{
            callback(new Error('No permitido por CORS'))
        }
    }
} 

//Habilitar cors
app.use(cors());

//Conectar DB.
connectDB();

//Habilitar express.json
app.use(express.json());

//Puerto de la app
const port = process.env.PORT || 4000;

//Importar rutas 
app.use('/api/users', require('./routes/users'));
app.use('/api/login', require('./routes/login'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));
//Arrancar app

app.listen(port, '0.0.0.0', () =>{
    console.log(`El servidor funciona en el puerto ${port}`)
})