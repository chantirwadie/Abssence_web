const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({

    prenom: {
        type: String,
        required: true
    },
    nom: {
        type: String,
        required: true
    },
    cin: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    user_who: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'role'
    },
    role: {
        type: String,
        enum: ['Etudiant', 'Professeur', 'Admin'],
        required: true
    }
})

module.exports = mongoose.model('User', userSchema)