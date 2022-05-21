const express = require('express')
const router = express()
const Emploi = require('../../models/emploi')
const Jour = require('../../models/jour')
const Creneau = require('../../models/creneau')
const Filiere = require('../../models/filiere')
const Module = require('../../models/module')
const User = require('../../models/user')
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ejs = require('ejs');

//definir moteur de template
//set views file
router.set('views', path.join(__dirname, '../../views/prof'));

//set view engine
router.set('view engine', 'ejs');
router.use(cookieParser())
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));


router.get('/', async (req, res) => {
    try {
        const { cookies } = req;
        var fileresprof = []
        var moduletest = []
        var moduuule = []
        var prooof = []
        var emploiis = []
        const user = await User.findById(cookies.userId)
        const prof = user.user_who
        var emmploiiiis = []
        const users = await User.find().populate("user_who")
        const emplois = await Emploi.find().populate("module")
        const filieres = await Filiere.find()
        const jours = await Jour.find()
        const creneaux = await Creneau.find()
        const modules = await Module.find()

        if (!cookies.userNom || cookies.userRole + '' != 'Professeur') {
            res.redirect('/login');
        }
        else {
            if (!cookies.filiere_id) {
                res.cookie('filiere_id', filieres[0]._id + "")
                filierenom = filieres[0].code
                for (i = 0; i < emplois.length; i++) {
                    if ("" + emplois[i].filiere == filieres[0]._id + "") {
                        emmploiiiis.push(emplois[i])
                    }
                }
                for (i = 0; i < emmploiiiis.length; i++) {
                    if (!emmploiiiis[i].module) {
                        emploiis.push({ emploi: emmploiiiis[i], profNom: '', profPrenom: '', })
                    }
                    else {
                        for (j = 0; j < users.length; j++) {
                            if (emmploiiiis[i].module.professeur + '' == users[j].user_who._id + '') {
                                emploiis.push({ emploi: emmploiiiis[i], profNom: users[j].nom, profPrenom: users[j].prenom, })
                            }
                        }
                    }
                }
                for (i = 0; i < modules.length; i++) {
                    if (modules[i].filiere._id == cookies.filiere_id + "") {
                        if ("" + modules[i].professeur == prof + "") {
                            moduuule.push(modules[i])
                        }
                    }
                    for (i = 0; i < modules.length; i++) {
                        if ("" + modules[i].professeur == prof + "") {
                            moduletest.push(modules[i])
                        }
                    }
                    for (i = 0; i < filieres.length; i++) {
                        for (j = 0; j < moduletest.length; j++) {
                            if (moduletest[j].filiere + '' == filieres[i]._id + '') {
                                fileresprof.push(filieres[i])
                                break;
                            }
                        }
                    }
                }

            } else {
                const filiere = await Filiere.findById(cookies.filiere_id)
                filierenom = filiere.code
                for (i = 0; i < emplois.length; i++) {
                    if ("" + emplois[i].filiere == cookies.filiere_id + "") {
                        emmploiiiis.push(emplois[i])
                    }
                }
                for (i = 0; i < emmploiiiis.length; i++) {
                    if (!emmploiiiis[i].module) {
                        emploiis.push({ emploi: emmploiiiis[i], profNom: '', profPrenom: '', })
                    }
                    else {
                        for (j = 0; j < users.length; j++) {
                            if (emmploiiiis[i].module.professeur + '' == users[j].user_who._id + '') {
                                emploiis.push({ emploi: emmploiiiis[i], profNom: users[j].nom, profPrenom: users[j].prenom, })
                            }
                        }
                    }
                }
                for (i = 0; i < modules.length; i++) {

                    if (modules[i].filiere._id == cookies.filiere_id + "") {

                        if ("" + modules[i].professeur == prof + "") {

                            moduuule.push(modules[i])
                        }
                    }
                }
                for (i = 0; i < modules.length; i++) {

                    if ("" + modules[i].professeur == prof + "") {
                        moduletest.push(modules[i])

                    }
                }
                for (i = 0; i < filieres.length; i++) {
                    for (j = 0; j < moduletest.length; j++) {
                        if (moduletest[j].filiere + '' == filieres[i]._id + '') {
                            fileresprof.push(filieres[i])
                            break;
                        }
                    }
                }
            }

            res.render('emplois/index', {
                title: 'Gestion Emploi',
                empty: 'Empty',
                emplois: emploiis,
                filieres: fileresprof,
                prof: prof,
                jours: jours,
                filierecode: filierenom,
                creneaux: creneaux,
                modules: moduuule,
                userNom: cookies.userNom,
                userPrenom: cookies.userPrenom,
            })
        }

    } catch (err) {
        res.send('Error ' + err)
    }
})




router.get('/delete/:id', async (req, res) => {
    try {
        const emploi = await Emploi.findById(req.params.id)
        emploi.etat = false
        const a1 = await emploi.save()
        res.redirect('/admin/emplois')
    } catch (err) { }
})


router.post('/', async (req, res) => {
    try {
        res.cookie('filiere_id', req.body.filiere_id + "")
        res.redirect('/prof/emplois')
    }
    catch (err) {
        res.send('Error')
    }
})

router.post('/update/:id', async (req, res) => {
    const emploi = await Emploi.findById(req.params.id)
    emploi.etat = true
    try {
        emploi.module = req.body.module
        emploi.type = req.body.type
        const a1 = await emploi.save()
        res.redirect('/prof/emplois');
    } catch (err) {
        res.send('Error')
    }
})


module.exports = router