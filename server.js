// Haetaan ympäristömuuttuja .env-tiedostosta vain siinä tapauksessa,
// jos sovellus ajetaan kehitystilassa (npm run devStart, ei npm run start)
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
// Sisällytä kaikki asennetut paketit
const express = require('express')
const expressLayouts = require('express-ejs-layouts')

// Käynnistä express sovellus, sisällytä se muuttujaan app
const app = express()

// Hae eri endpointeille tehdyt routerit muuttujiin
const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')

// Määritä, mitä view engineä käytetään, tässä tapauksessa ejs
app.set('view engine', 'ejs')
// Määritä, mistä sovellus saa viewinsä, tässä tapauksessa 'tämä_kansio/views'
// Viewit hoitavat kaiken renderöintiin liittyvän
app.set('views', __dirname + '/views')
// Määritä, mistä sovellus saa layouttinsa, 'layouts/layout'
app.set('layout', 'layouts/layout')
// Käsketään sovellusta käyttämään asennettua express-ejs -layouttia
app.use(expressLayouts)
// Kerrotaan sovellukselle, mistä kaikki julkiset tiedostot löytyvät
app.use(express.static('public'))
// REST-pyyntöjen parsimiseen tarkoitetun kirjaston asetuksia
app.use(express.urlencoded({ limit: '10mb', extended: false}))

// Sisällytä mongoose-paketti, joka mahdollistaa mongoDB-tietokannan yhdistämisen
const mongoose = require('mongoose')
// Yhdistä mongoDB-tietokantaan, URL saadaan .env-tiedostosta
mongoose.connect(process.env.DATABASE_URL, {
useNewUrlParser: true })
// Hallitse tietokantayhteyttä db-muuttujan takaa
const db = mongoose.connection
// Tulosta ilmoitukset virheestä tai yhdistämisestä konsoliin
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

// Käske sovellusta käyttämään aikaisemmin haettuja routereita tietyissä endpointeissa
app.use('/', indexRouter)
// Kirjailijoiden routerit eivät tarvitse eteensä aina /authors-polkua, koska tässä se lisätään oletuksena
app.use('/authors', authorRouter)

// Määritetään portti, jota sovellus kuuntelee. Joko palvelimen määrittämä, tai oletuksena 3000
app.listen(process.env.PORT || 3000)

