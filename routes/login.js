const express = require('express')
const router = express()
const User = require('../models/user')
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ejs = require('ejs');

//definir moteur de template
//set views file
router.set('views', path.join(__dirname, '../views'));

//set view engine
router.set('view engine', 'ejs');
router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));


router.get('/', async (req, res) => {
    try {
        res.render('login', {
            title: 'Authentification',
        });
    } catch (err) {
        res.send('Error ' + err)
    }
})


router.post('/save', async (req, res) => {
    const users = await User.find()
    var counter = 0
    var userId = ''
    var userRole = ''
    var userNom = ''
    var userPrenom = ''
    var userPass = ''
    for (var i = 0; i < users.length; i++) {
        if (users[i].email === req.body.email && users[i].password === req.body.password) {
            counter = 1
            userId = users[i]._id
            userRole = users[i].role
            userNom = users[i].nom
            userPrenom = users[i].prenom
            userPass = users[i].password
        }
    }
    if (counter === 1 && userRole === 'Admin') {
        res.cookie('userId', userId);
        res.cookie('userRole', userRole);
        res.cookie('userNom', userNom);
        res.cookie('userPrenom', userPrenom);
        res.cookie('userPass', userPass);
        res.redirect('/admin/admins');
    }
    else if (counter === 1 && userRole === 'Professeur') {
        res.cookie('userId', userId + "");
        res.cookie('userRole', userRole);
        res.cookie('userNom', userNom);
        res.cookie('userPrenom', userPrenom);
        res.cookie('userPass', userPass);
        res.redirect('/prof/charges');
    }
    else {
        res.redirect('/login');
    }
})


module.exports = router