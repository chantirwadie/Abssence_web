const mongoose = require('mongoose')


const moduleSchema = new mongoose.Schema({

    libelle: {
        type: String,
        required: true
    },
    filiere: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Filiere'
    },
    professeur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Professeur'
    },
})

module.exports = mongoose.model('Module', moduleSchema)