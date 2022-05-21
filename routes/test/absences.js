const express = require('express')
const router = express()
const Absence = require('../../models/absence')
const Etudiant = require('../../models/etudiant')
const Creneau = require('../../models/creneau')
const Filiere = require('../../models/filiere')
const Module = require('../../models/module')
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ejs = require('ejs');

//definir moteur de template
//set views file
router.set('views', path.join(__dirname, '../../views/test'));

//set view engine
router.set('view engine', 'ejs');
router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));



router.get('/', async (req, res) => {
    try {
        const { cookies } = req;
        const absences = await Absence.find()
        const modules = await Module.find()
        const etudiants = await Etudiant.find()
        const creneaux = await Creneau.find()

        res.render('absences/index', {
            title: 'Gestion Absence',
            absences: absences,
            modules: modules,
            etudiants: etudiants,
            creneaux: creneaux,
            userNom: cookies.userNom,
            userPrenom: cookies.userPrenom,
        });
    } catch (err) {
        res.send('Error ' + err)
    }
})


router.post('/save', async (req, res) => {
    const absences = new Absence({
        module: req.body.module,
        creneau: req.body.creneau,
        etudiant: req.body.etudiant,
        etat: false,
        date: req.body.date,
    })
    try {
        const a1 = await absences.save()
        res.redirect('/test/absences');
    } catch (err) {
        res.send('Error ' + err)
    }
})


router.get('/delete/:id', (req, res) => {
    Filiere.findByIdAndDelete(req.params.id).then(function (filiere) {
        Etudiant.deleteMany({ "filiere": filiere }).then(function (etudiant) {
        })
    })
    res.redirect('/admin/filieres');
})


router.post('/update/:id', async (req, res) => {
    try {
        const filiere = await Filiere.findById(req.params.id)
        filiere.code = req.body.code
        filiere.libelle = req.body.libelle
        const a1 = await filiere.save()
        res.redirect('/admin/filieres');
    } catch (err) {
        res.send('Error')
    }
})


module.exports = router