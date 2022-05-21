const mongoose = require('mongoose')


const etudiantSchema = new mongoose.Schema({

    sexe: {
        type: String,
        required: true
    },
    faciale: {
        type: String,
        required: true
    },
    filiere: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Filiere'
    },
})

module.exports = mongoose.model('Etudiant', etudiantSchema)