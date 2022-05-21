const express = require('express')
const router = express()
const Filiere = require('../../models/filiere')
const Module = require('../../models/module')
const User = require('../../models/user')
const Professeur = require('../../models/professeur')
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ejs = require('ejs');

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
        const { cookies } = req;
        var array = []
        var array1 = []
        const modules = await Module.find().populate("filiere")
        const filieres = await Filiere.find()
        const professeurs = await Professeur.find()
        const users = await User.find({ "role": "Professeur" })

        if (!cookies.userNom || cookies.userRole + '' != 'Admin') {
            res.redirect('/login');
        }
        else {
            for (i = 0; i < professeurs.length; i++) {
                for (j = 0; j < users.length; j++) {
                    if (professeurs[i]._id + '' == users[j].user_who + '') {
                        array1.push({ professeurId: professeurs[i]._id, profNom: users[j].nom, profPrenom: users[j].prenom, })
                    }
                }
            }
            for (i = 0; i < modules.length; i++) {
                for (j = 0; j < users.length; j++) {
                    if (modules[i].professeur + '' == users[j].user_who + '') {
                        array.push({ module: modules[i], profNom: users[j].nom, profPrenom: users[j].prenom, })
                    }
                }
            }

            if (!cookies.userNom || cookies.userRole + '' != 'Admin') {
                res.redirect('/login');
            }
            else {
                res.render('modules/index', {
                    title: 'Gestion Modules',
                    modules: array,
                    professeurs: array1,
                    filieres: filieres,
                    userNom: cookies.userNom,
                    userPrenom: cookies.userPrenom,
                });
            }
        }
    } catch (err) {
        res.send('Error ' + err)
    }
})


router.get('/delete/:id', async (req, res) => {
    try {
        const a1 = await Module.findByIdAndDelete(req.params.id)
    } catch (err) { }
    res.redirect('/admin/modules');
})


router.post('/update/:id', async (req, res) => {
    try {
        const module = await Module.findById(req.params.id)
        module.libelle = req.body.libelle
        module.filiere = req.body.filiere
        module.professeur = req.body.professeur
        const a1 = await module.save()
        res.redirect('/admin/modules');
    } catch (err) {
        res.send('Error')
    }
})


router.post('/save', async (req, res) => {
    Filiere.findById(req.body.filiere).then(function (filiere) {
        if (filiere != null) {
            const a1 = Module.create(req.body).then(function (module) {
                res.redirect('/admin/modules');
            });
        } else {
            res.json({
                "erreur": "Filiere n'est pasdisponible"
            })
        }
    })
})


module.exports = router