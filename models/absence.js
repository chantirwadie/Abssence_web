const mongoose = require('mongoose')

const absenceSchema = new mongoose.Schema({

   module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module'
   },
   creneau: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Creneau'
   },
   etudiant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Etudiant'
   },
   etat: {
      type: Boolean,
   },
   date: {
      type: String,
   },
})

module.exports = mongoose.model('Absence', absenceSchema)