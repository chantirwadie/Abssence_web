const express = require('express')
const mongoose = require('mongoose')
//const url = "mongodb+srv://hibataih:hibataih@cluster0.zmc7i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
// const url = "mongodb://hibataih:hibataih@cluster0-shard-00-00.zmc7i.mongodb.net:27017,cluster0-shard-00-01.zmc7i.mongodb.net:27017,cluster0-shard-00-02.zmc7i.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-b96djb-shard-0&authSource=admin&retryWrites=true&w=majority"
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://hibataih:hibataih@cluster0-shard-00-00.zmc7i.mongodb.net:27017,cluster0-shard-00-01.zmc7i.mongodb.net:27017,cluster0-shard-00-02.zmc7i.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-b96djb-shard-0&authSource=admin&retryWrites=true&w=majority";
MongoClient.connect(url, function(err, client) {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

const app = express()

mongoose.connect(url, { useNewUrlParser: true })
const con = mongoose.connection

con.on('open', () => {
  console.log('connected...')
})

app.use(express.json())


//App Routes
const firstRouter = require('./routes/route')
app.use('/', firstRouter)
const loginRouter = require('./routes/login')
app.use('/login', loginRouter)
const logoutRouter = require('./routes/logout')
app.use('/logout', logoutRouter)

//Admin Routes
const adminRouter = require('./routes/admin/admins')
app.use('/admin/admins', adminRouter)
const etudiantRouter = require('./routes/admin/etudiants')
app.use('/admin/etudiants', etudiantRouter)
const professeurRouter = require('./routes/admin/professeurs')
app.use('/admin/professeurs', professeurRouter)
const filiereRouter = require('./routes/admin/filieres')
app.use('/admin/filieres', filiereRouter)
const moduleRouter = require('./routes/admin/modules')
app.use('/admin/modules', moduleRouter)
const creaneauRouter = require('./routes/admin/creneaux')
app.use('/admin/creneaux', creaneauRouter)
const emploiRouter = require('./routes/admin/emplois')
app.use('/admin/emplois', emploiRouter)
const absenceRouter = require('./routes/admin/absences')
app.use('/admin/absences', absenceRouter)
const absenceParEtudiantRouter = require('./routes/admin/absencesParEtudiant')
app.use('/admin/parEtudiant', absenceParEtudiantRouter)
const printAbsRouter = require('./routes/admin/printAbs')
app.use('/printAbs', printAbsRouter)
const profilAdminRouter = require('./routes/admin/profile')
app.use('/admin/profile', profilAdminRouter)

//Prof Routes
const chargeRouter = require('./routes/prof/charges')
app.use('/prof/charges', chargeRouter)
const emploiPRouter = require('./routes/prof/emplois')
app.use('/prof/emplois', emploiPRouter)
const profilProfRouter = require('./routes/prof/profile')
app.use('/prof/profile', profilProfRouter)
const absenceProfRouter = require('./routes/prof/absences')
app.use('/prof/absences', absenceProfRouter)


//Mobile Routes
const mobileRouter = require('./routes/mobile/api')
app.use('/mobile/api', mobileRouter)

const absenceTestRouter = require('./routes/test/absences')
app.use('/test/absences', absenceTestRouter)
const dashboardRouter = require('./routes/dashboard')
app.use('/dashboard', dashboardRouter)

app.use(express.static('public'));

const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");
const { urlencoded } = require('express')

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);


app.listen(process.env.PORT || 3000, function () {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});