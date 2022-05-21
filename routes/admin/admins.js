const express = require('express')
const router = express()
const Admin = require('../../models/admin')
const User = require('../../models/user')
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const creneau = require('../../models/creneau');
const { cookie } = require('express/lib/response');

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
            const users = await User.find({ "role": "Admin" }).populate("user_who")
            res.render('admins/index', {
                title: 'Gestion Admin',
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
    const admin = new Admin({
        matricule: req.body.matricule
    });
    a1 = await admin.save()
    const user = new User({
        prenom: req.body.prenom,
        nom: req.body.nom,
        cin: req.body.cin,
        email: req.body.email,
        password: req.body.prenom + '.' + req.body.nom,
        photo: '.',
        role: 'Admin',
        user_who: a1._id,
    })
    a1 = await user.save()
    res.redirect('/admin/admins');
})


router.post('/update/:id/:idAdmin', async (req, res) => {
    const user = await User.findById(req.params.id)
    const admin = await Admin.findById(req.params.idAdmin)
    try {
        user.prenom = req.body.prenom
        user.nom = req.body.nom
        user.cin = req.body.cin
        user.email = req.body.email
        user.password = req.body.password
        admin.matricule = req.body.matricule
        const a1 = await user.save()
        const a2 = await admin.save()
        res.redirect('/admin/admins');
    } catch (err) {
        res.send(err)
    }
})


router.get('/delete/:id', (req, res) => {
    Admin.findByIdAndDelete(req.params.id).then(function (admin) {
        User.deleteMany({ "user_who": admin }).then(function (user) {
        })
    })
    res.redirect('/admin/admins');
})


module.exports = router