const mongoose = require('mongoose')


const emploiShema = new mongoose.Schema({

   etat: {
      type: Boolean,
   },
   type: {
      type: String,
      required: false
   },
   jour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Jour'
   },
   creneau: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Creneau'
   },
   filiere: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Filiere'
   },
   module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module'
   },
})

module.exports = mongoose.model('Emploi', emploiShema)