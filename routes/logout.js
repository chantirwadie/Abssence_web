const express = require('express')
const router = express()
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


router.post('/', async (req, res) => {
    const { cookies } = req;
    cookie = req.cookies;
    for (var prop in cookie) {
        res.clearCookie(prop);
    }
    res.redirect('/login');
})


module.exports = router