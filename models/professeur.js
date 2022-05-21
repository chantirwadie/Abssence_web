const mongoose = require('mongoose')


const professeurSchema = new mongoose.Schema({

    matricule: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Professeur', professeurSchema)