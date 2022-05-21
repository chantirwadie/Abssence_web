const express = require('express')
const router = express()
const User = require('../../models/user')
const Emploi = require('../../models/emploi')
const Jour = require('../../models/jour')
const Creneau = require('../../models/creneau')
const Filiere = require('../../models/filiere')
const Etudiant = require('../../models/etudiant')
const Absence = require('../../models/absence')
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
        const { cookies } = req;
        if (!cookies.userNom || cookies.userRole + '' != 'Admin') {
            res.redirect('/login');
        }
        else {
            array = []
            const filieres = await Filiere.find()
            const etudiant = await Etudiant.findById(cookies.idEtud)
            const absences = await Absence.find({ "etudiant": cookies.idEtud })
            const user = await User.find({ "user_who": cookies.idEtud })
            const filiere = await Filiere.findById(etudiant.filiere)

            for (i = 0; i < absences.length; i++) {
                const creneau = await Creneau.findById(absences[i].creneau)
                const module = await Module.findById(absences[i].module)
                if (absences[i].etat == true) {
                    array.push({ date: absences[i].date, module: module.libelle, creneau: creneau.debut + " - " + creneau.fin, etat: 'Justifié', checked: 'checked', id: absences[i]._id })
                } else {
                    array.push({ date: absences[i].date, module: module.libelle, creneau: creneau.debut + " - " + creneau.fin, etat: 'Non Justifié', checked: '', id: absences[i]._id })
                }
            }

            res.render('absencesParEtudiant/index', {
                title: 'Gestion Filieres',
                filieres: filieres,
                array: array,
                checked: '',
                prenom: user[0].prenom,
                nom: user[0].nom,
                filiere: filiere.code,
                userNom: cookies.userNom,
                userPrenom: cookies.userPrenom,
            });
        }
    } catch (err) {
        res.send('Error ' + err)
    }
})


router.post('/update/:id', async (req, res) => {
    try {
        const absence = await Absence.findById(req.params.id)
        if (absence.etat == false) { absence.etat = true }
        else { absence.etat = false }
        const a1 = await absence.save()
        res.redirect('/admin/parEtudiant');
    } catch (err) {
        res.send('Error')
    }
})


router.get('/delete/:id', (req, res) => {
    Absence.findByIdAndDelete(req.params.id).then(function (absence) { })
    res.redirect('/admin/parEtudiant');
})


module.exports = router