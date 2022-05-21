const mongoose = require('mongoose')


const filiereSchema = new mongoose.Schema({

    code: {
        type: String,
        required: true
    },
    libelle: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Filiere', filiereSchema)