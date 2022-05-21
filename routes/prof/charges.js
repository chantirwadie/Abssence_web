const express = require('express')
const router = express()
const Emploi = require('../../models/emploi')
const Jour = require('../../models/jour')
const Creneau = require('../../models/creneau')
const Charge = require('../../models/charge')
const Module = require('../../models/module')
const User = require('../../models/user')
const cookieParser = require('cookie-parser');
const path = require('path');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const { cookie } = require('express/lib/response');
//definir moteur de template
//set views file
router.set('views', path.join(__dirname, '../../views/prof'));

//set view engine
router.use(cookieParser())
router.set('view engine', 'ejs');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));



router.get('/', async (req, res) => {
    try {
        var moduuule = []
        var chaaaarge = []
        const { cookies } = req;
        const user = await User.findById(cookies.userId)
        const prof = user.user_who
        const charges = await Charge.find().populate("module")
        const modules = await Module.find()

        if (!cookies.userNom || cookies.userRole + '' != 'Professeur') {
            res.redirect('/login');
        }
        else {
            for (i = 0; i < charges.length; i++) {

                if ("" + charges[i].module.professeur == prof + "") {
                    chaaaarge.push(charges[i])
                }
            }
            for (i = 0; i < modules.length; i++) {
                if ("" + modules[i].professeur == prof + "") {
                    moduuule.push(modules[i])
                }
            }

            res.render('charges/index', {
                title: 'Gestion Charges',
                charges: chaaaarge,
                modules: moduuule,
                userNom: cookies.userNom,
                userPrenom: cookies.userPrenom,
            });
        }
    } catch (err) {
        res.send('Error ' + err)
    }
})


router.post('/save', async (req, res) => {
    const charge = new Charge({
        title: req.body.title,
        module: req.body.module,
        delai: req.body.delai,
        lien: req.body.lien,
        description: req.body.description,
    })
    try {
        const a1 = await charge.save()
        res.redirect('/prof/charges')
    } catch (err) {
        res.send('Error Hahahah')
    }
})


router.get('/delete/:id', async (req, res) => {
    try {
        const a1 = await Charge.findByIdAndDelete(req.params.id)
    } catch (err) {
        res.send('Error')
    }
    res.redirect('/prof/charges');
})


router.post('/update/:id', async (req, res) => {
    try {
        const charge = await Charge.findById(req.params.id)
        charge.title = req.body.title
        charge.lien = req.body.lien
        charge.description = req.body.description
        charge.delai = req.body.delai
        charge.module = req.body.module
        const a1 = await charge.save()
        res.redirect('/prof/charges');
    } catch (err) {
        res.send('Error')
    }
})


module.exports = router