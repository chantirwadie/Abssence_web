const express = require('express')
const router = express()
const Etudiant = require('../../models/etudiant')
const Filiere = require('../../models/filiere')
const User = require('../../models/user')
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const creneau = require('../../models/creneau')

//definir moteur de template
//set views file
router.set('views', path.join(__dirname, '../../views/admin'));

//set view engine
router.set('view engine', 'ejs');
router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));


router.get('/', async (req, res) => {
    try {
        var array = [];
        const { cookies } = req;
        if (!cookies.userNom || cookies.userRole + '' != 'Admin') {
            res.redirect('/login');
        }
        else {
            const users = await User.find({ "role": "Etudiant" }).populate("user_who").populate([
                {
                    path: 'user_who',
                    model: 'Etudiant',
                    select: 'sexe faciale',
                    populate: {
                        path: 'filiere',
                        model: 'Filiere',
                    }
                },
            ])
            const etudiants = await Etudiant.find().populate("filiere")
            const filieres = await Filiere.find()

            res.render('etudiants/index', {
                title: 'Gestion Etudiant',
                users: users,
                etudiants: etudiants,
                filieres: filieres,
                userNom: cookies.userNom,
                userPrenom: cookies.userPrenom,
            });
        }
    } catch (err) {
        res.send('Error ' + err)
    }
})


router.post('/save', async (req, res) => {
    var a1 = '';
    const etudiant = new Etudiant({
        sexe: req.body.sexe,
        filiere: req.body.filiere,
        faciale: req.body.faciale
    });
    a1 = await etudiant.save()
    const user = new User({
        prenom: req.body.prenom,
        nom: req.body.nom,
        cin: req.body.cin,
        email: req.body.email,
        password: req.body.prenom + '.' + req.body.nom,
        photo: '.',
        role: 'Etudiant',
        user_who: a1._id,
    })
    a1 = await user.save()
    res.redirect('/admin/etudiants');
})


router.post('/update/:id/:idEtudiant', async (req, res) => {
    const user = await User.findById(req.params.id)
    const etudiant = await Etudiant.findById(req.params.idEtudiant)
    try {
        user.prenom = req.body.prenom
        user.nom = req.body.nom
        user.cin = req.body.cin
        user.email = req.body.email
        user.password = req.body.password
        etudiant.sexe = req.body.sexe
        etudiant.filiere = req.body.filiere
        etudiant.faciale = req.body.faciale
        const a1 = await user.save()
        const a2 = await etudiant.save()
        res.redirect('/admin/etudiants');
    } catch (err) {
        res.send(err)
    }
})


router.get('/delete/:id', (req, res) => {
    Etudiant.findByIdAndDelete(req.params.id).then(function (etudiant) {
        User.deleteMany({ "user_who": etudiant }).then(function (user) {
        })
    })
    res.redirect('/admin/etudiants');
})


module.exports = router