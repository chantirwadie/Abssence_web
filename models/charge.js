const mongoose = require('mongoose')


const chargeShema = new mongoose.Schema({

    title: {
        type: String,
        required: false
    },
    delai: {
        type: Date,
        required: false
    },
    lien: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    module: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module'
    },
})

module.exports = mongoose.model('Charge', chargeShema)