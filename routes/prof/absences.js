const express = require('express')
const router = express()
const Absence = require('../../models/absence')
const Etudiant = require('../../models/etudiant')
const User = require('../../models/user')
const Professeur = require('../../models/professeur')
const Filiere = require('../../models/filiere')
const Module = require('../../models/module')
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ejs = require('ejs');

//definir moteur de template
//set views file
router.set('views', path.join(__dirname, '../../views/prof'));

//set view engine
router.set('view engine', 'ejs');
router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));



router.get('/', async (req, res) => {
    try {
        const filieres = await Filiere.find()
        const users = await User.find()
        array = []
        arrayModule = []
        filiereModule = ''
        var filiere = '';
        const { cookies } = req;
        if (!cookies.userNom || cookies.userRole + '' != 'Professeur') {
            res.redirect('/login');
        }
        else {
            const user = await User.findById(cookies.userId)
            const professeur = await Professeur.findById(user.user_who)
            const modules = await Module.find({ "professeur": professeur._id }).populate('filiere')
            for (i = 0; i < modules.length; i++) {
                filiereModule = await Filiere.findById({ "_id": modules[i].filiere._id })
                arrayModule.push({ id: modules[i]._id, nom: modules[i].libelle + ' ' + filiereModule.code })
            }

            if (!cookies.module_id) {
                res.cookie('module_id', modules[0]._id + "")
                module = modules[0]
                const etudiants = await Etudiant.find({ "filiere": modules[0].filiere._id + "" })
                filiere = await Filiere.findById(module.filiere._id)
                for (i = 0; i < etudiants.length; i++) {
                    const absJ = await Absence.find({ "etat": true, "etudiant": etudiants[i]._id + '' })
                    const absNJ = await Absence.find({ "etat": false, "etudiant": etudiants[i]._id + '' })
                    for (j = 0; j < users.length; j++) {
                        if (etudiants[i]._id + '' == users[j].user_who + '') {
                            array.push({ nomPrenom: users[j].prenom + " " + users[j].nom, module: modules[0].libelle, nbrJ: absJ.length, nbrNJ: absNJ.length, idEtud: etudiants[i]._id })
                        }
                    }
                }
            } else {
                const module = await Module.findById(cookies.module_id).populate('filiere')
                filiere = await Filiere.findById(module.filiere._id)
                const etudiants = await Etudiant.find({ "filiere": filiere._id })
                for (i = 0; i < etudiants.length; i++) {
                    const absJ = await Absence.find({ "etat": true, "etudiant": etudiants[i]._id + '', "module": module._id })
                    const absNJ = await Absence.find({ "etat": false, "etudiant": etudiants[i]._id + '', "module": module._id })
                    for (j = 0; j < users.length; j++) {
                        if (etudiants[i]._id + '' == users[j].user_who + '') {
                            array.push({ nomPrenom: users[j].prenom + " " + users[j].nom, module: module.libelle, nbrJ: absJ.length, nbrNJ: absNJ.length, idEtud: etudiants[i]._id })
                        }
                    }
                }
            }

            res.render('absences/index', {
                title: 'Gestion Absences',
                array: array,
                filiere: filiere,
                modules: arrayModule,
                userNom: cookies.userNom,
                userPrenom: cookies.userPrenom,
            });
        }
    } catch (err) {
        res.send('Error ' + err)
    }
})


router.post('/etudiant/', async (req, res) => {
    try {
        res.cookie('idEtud', req.body.idEtud + "")
        res.redirect('/admin/parEtudiant')
    } catch (err) {
        res.send('Error ' + err)
    }
})


router.post('/', async (req, res) => {
    try {
        res.cookie('module_id', req.body.module_id + "")
        res.redirect('/prof/absences')
    }
    catch (err) {
        res.send('Error')
    }
})


module.exports = router