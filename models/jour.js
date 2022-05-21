const mongoose = require('mongoose')


const jourSchema = new mongoose.Schema({

    libelle: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Jour', jourSchema)