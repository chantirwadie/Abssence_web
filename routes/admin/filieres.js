const express = require('express')
const router = express()
const Emploi = require('../../models/emploi')
const Jour = require('../../models/jour')
const Creneau = require('../../models/creneau')
const Filiere = require('../../models/filiere')
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
            const filieres = await Filiere.find()
            res.render('filieres/index', {
                title: 'Gestion Filieres',
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
    const filieres = new Filiere({
        code: req.body.code,
        libelle: req.body.libelle,
    })
    const jours = await Jour.find()
    const creneaux = await Creneau.find()
    try {
        const a1 = await filieres.save()
        for (i = 0; i < creneaux.length; i++) {
            for (j = 0; j < jours.length; j++) {
                const emploi = new Emploi({
                    jour: jours[j],
                    creneau: creneaux[i],
                    etat: false,
                    filiere: filieres
                })
                const a2 = await emploi.save()
            }
        }
        res.redirect('/admin/filieres');

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