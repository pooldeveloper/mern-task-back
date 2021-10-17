const mongoose = require('mongoose');

//Crea la base de datos(tabla) 
const ProjectsSchema = mongoose.Schema({
 name:{
   type: String,
   required: true,
   trim: true
 },
 creator:{
   type: mongoose.Schema.Types.ObjectId,
   ref:'User'
 },
 created:{
   type: Date,
   default: Date.now()
 }
})

module.exports = mongoose.model('Projects', ProjectsSchema);