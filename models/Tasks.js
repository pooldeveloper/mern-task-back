const mongoose = require('mongoose');

//Crea la base de datos(tabla) 
const TasksSchema = mongoose.Schema({
 name:{
   type: String,
   required: true,
   trim: true
 },
 project:{
   type: mongoose.Schema.Types.ObjectId,
   ref:'Project'
 },
 created:{
   type: Date,
   default: Date.now()
 },
 state:{
  type: Boolean,
  default: false
}
})

module.exports = mongoose.model('Tasks', TasksSchema);