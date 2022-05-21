const express = require('express')
const router = express()
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Creneau = require('../../models/creneau')
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
            const creneau = await Creneau.find()
            res.render('creneaux/index', {
                title: 'Gestion Créneau',
                creneau: creneau,
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
        const creneau = await Creneau.findById(req.params.id)
        creneau.label = req.body.label
        creneau.debut = req.body.debut
        creneau.fin = req.body.fin
        const a1 = await creneau.save()
        res.redirect('/admin/creneaux');
    } catch (err) {
        res.send('Error')
    }
})


router.post('/save', async (req, res) => {
    const creneau = new Creneau({
        label: req.body.label,
        debut: req.body.debut,
        fin: req.body.fin
    })
    try {
        const a1 = await creneau.save()
        res.redirect('/admin/creneaux');
    } catch (err) {
        res.send('Error')
    }
})


router.get('/delete/:id', async (req, res) => {
    try {
        const a1 = await Creneau.findByIdAndDelete(req.params.id)
    } catch (err) {
        res.send('Error')
    }
    res.redirect('/admin/creneaux');
})


module.exports = router