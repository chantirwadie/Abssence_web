
const express = require('express')
const router = express()
const Etudiant = require('../../models/etudiant')
const Filiere = require('../../models/filiere')
const User = require('../../models/user')

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const creneau = require('../../models/creneau')


router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));


router.post('/facial', async(req, res) => {

    const etudiant = await Etudiant.findById(req.body.id)
    console.log(etudiant)
    console.log("id :"+ req.body.id)
    console.log("model :"+ req.body.faciale)

    try {
        etudiant.faciale = req.body.facial
        
        const a2 = await etudiant.save()
        
        console.log(a2)

        res.send("succes");

    } catch (err) {
        res.send(err)
    }
})

router.get('/all/e', async(req, res) => {
    const etudiant = await Etudiant.find()
    //const user = await User.find()
    
    res.send(etudiant);
})
router.get('/all/u', async(req, res) => {
//const etudiant = await Etudiant.find()
const user = await User.find()

res.send(user);
})
router.post('/test', async(req, res) => {



console.log("id :"+ req.body.id)
console.log("model :"+ req.body.facial)

res.send("ok");


})

router.post('/login', async (req, res) => {
    const users = await User.find({"email": req.body.email,"password": req.body.password})
    res.send(users)
    
    
})

module.exports = router