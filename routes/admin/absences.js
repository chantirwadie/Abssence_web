const express = require('express')
const router = express()
const Absence = require('../../models/absence')
const Etudiant = require('../../models/etudiant')
const User = require('../../models/user')
const Creneau = require('../../models/creneau')
const Filiere = require('../../models/filiere')
const Module = require('../../models/module')
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
        const filieres = await Filiere.find()
        const users = await User.find()
        array = []
        var filiere = '';
        const { cookies } = req;
        if (!cookies.userNom || cookies.userRole + '' != 'Admin') {
            res.redirect('/login');
        }
        else {
            const filieres = await Filiere.find()
            if (!cookies.filiere_id) {
                res.cookie('filiere_id', filieres[0]._id + "")
                filiere = filieres[0]
                const etudiants = await Etudiant.find({ "filiere": filieres[0]._id + "" })
                for (i = 0; i < etudiants.length; i++) {
                    const absJ = await Absence.find({ "etat": true, "etudiant": etudiants[i]._id + '' })
                    const absNJ = await Absence.find({ "etat": false, "etudiant": etudiants[i]._id + '' })
                    for (j = 0; j < users.length; j++) {
                        if (etudiants[i]._id + '' == users[j].user_who + '') {
                            array.push({ nomPrenom: users[j].prenom + " " + users[j].nom, filiere: filieres[0].code, nbrJ: absJ.length, nbrNJ: absNJ.length, idEtud: etudiants[i]._id })
                        }
                    }
                }
            } else {
                const etudiants = await Etudiant.find({ "filiere": cookies.filiere_id + "" })
                filiere = await Filiere.findById(cookies.filiere_id)
                for (i = 0; i < etudiants.length; i++) {
                    const absJ = await Absence.find({ "etat": true, "etudiant": etudiants[i]._id + '' })
                    const absNJ = await Absence.find({ "etat": false, "etudiant": etudiants[i]._id + '' })
                    for (j = 0; j < users.length; j++) {
                        if (etudiants[i]._id + '' == users[j].user_who + '') {
                            array.push({ nomPrenom: users[j].prenom + " " + users[j].nom, filiere: filiere.code, nbrJ: absJ.length, nbrNJ: absNJ.length, idEtud: etudiants[i]._id })
                        }
                    }
                }
            }

            res.render('absences/index', {
                title: 'Gestion Absences',
                array: array,
                filiere: filiere,
                filieres: filieres,
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
        res.cookie('filiere_id', req.body.filiere_id + "")
        res.redirect('/admin/absences')
    }
    catch (err) {
        res.send('Error')
    }
})


module.exports = router