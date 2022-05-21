const express = require('express')
const router = express()
const path = require('path');
const User = require('../../models/user')
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
        const user = await User.findById(cookies.userId);
        if (!cookies.userNom || cookies.userRole + '' != 'Admin') {
            res.redirect('/login');
        }
        else {
            res.render('profile/profile', {
                title: 'Profile',
                userId: cookies.userId,
                userNom: cookies.userNom,
                userPrenom: cookies.userPrenom,
                userRole: cookies.userRole,
                user: user
            });
        }
    } catch (err) {
        res.send('Error ' + err)
    }
})


router.post('/update/nom', async (req, res) => {
    try {
        const { cookies } = req;
        const user = await User.findById(cookies.userId)
        user.nom = req.body.nom
        const a1 = await user.save()
        res.redirect('/admin/profile');
    } catch (err) {
        res.send('Error')
    }
})

router.post('/update/prenom', async (req, res) => {
    try {
        const { cookies } = req;
        const user = await User.findById(cookies.userId)
        user.prenom = req.body.prenom
        const a1 = await user.save()
        res.redirect('/admin/profile');
    } catch (err) {
        res.send('Error')
    }
})

router.post('/update/email', async (req, res) => {
    try {
        const { cookies } = req;
        const user = await User.findById(cookies.userId)
        user.email = req.body.email
        const a1 = await user.save()
        res.redirect('/admin/profile');
    } catch (err) {
        res.send('Error')
    }
})

router.post('/update/cin', async (req, res) => {
    try {
        const { cookies } = req;
        const user = await User.findById(cookies.userId)
        user.cin = req.body.cin
        const a1 = await user.save()
        res.redirect('/admin/profile');
    } catch (err) {
        res.send('Error')
    }
})

router.post('/update/password', async (req, res) => {
    try {
        const { cookies } = req;
        const user = await User.findById(cookies.userId)
        if (user.password == req.body.oldpassword) {
            user.password = req.body.newpassword
        }
        else {
        }
        const a1 = await user.save()
        res.redirect('/admin/profile');
    } catch (err) {
        res.send('Error')
    }
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