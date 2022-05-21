const express = require('express')
const router = express()
const Professeur = require('../../models/professeur')
const User = require('../../models/user')
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
        const users = await User.find({ "role": "Professeur" }).populate("user_who")
        const { cookies } = req;
        if (!cookies.userNom || cookies.userRole + '' != 'Admin') {
            res.redirect('/login');
        }
        else {
            res.render('professeurs/index', {
                title: 'Gestion Professeur',
                users: users,
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
    const professeur = new Professeur({
        matricule: req.body.matricule
    });
    a1 = await professeur.save()
    const user = new User({
        prenom: req.body.prenom,
        nom: req.body.nom,
        cin: req.body.cin,
        email: req.body.email,
        password: req.body.prenom + '.' + req.body.nom,
        photo: '.',
        role: 'Professeur',
        user_who: a1._id,
    })
    a1 = await user.save()
    res.redirect('/admin/professeurs');
})


router.post('/update/:id/:idProf', async (req, res) => {
    const user = await User.findById(req.params.id)
    const professeur = await Professeur.findById(req.params.idProf)
    try {
        user.prenom = req.body.prenom
        user.nom = req.body.nom
        user.cin = req.body.cin
        user.email = req.body.email
        user.password = req.body.password
        professeur.matricule = req.body.matricule
        const a1 = await user.save()
        const a2 = await professeur.save()
        res.redirect('/admin/professeurs');
    } catch (err) {
        res.send(err)
    }
})


router.get('/delete/:id', (req, res) => {
    Professeur.findByIdAndDelete(req.params.id).then(function (professeur) {
        User.deleteMany({ "user_who": professeur }).then(function (user) {
        })
    })
    res.redirect('/admin/professeurs');
})


module.exports = router