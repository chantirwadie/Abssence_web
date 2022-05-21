const express = require('express')
const router = express()
const Creneau = require('../models/creneau')
const path = require('path');
const bodyParser = require('body-parser');
const ejs = require('ejs');

//definir moteur de template
//set views file
router.set('views', path.join(__dirname, '../views'));

//set view engine
router.set('view engine', 'ejs');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));



module.exports = router