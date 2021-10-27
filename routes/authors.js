/*
routes = controllers:
hoitavat clienteiltä tulevat pyynnöt eteenpäin
toimivat välikäsinä modelssien ja viewien välillä
*/

// Haetaan express käyttöön
const express = require('express')
// Haetaan expressin router-ominaisuus tähän käyttöön
const router = express.Router()
// Haetaan kirjailijan 'taulu' tietokannan käyttöön
const Author = require('../models/author')

// Kaikkien kirjailijoiden hakemiseen tarkoitettu route
router.get('/', async (req, res) => {
    // Lisää tänne kaikki haulla löydetyt kirjailijat
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        // Yritä hakea kaikki kirjailijat tietokannasta
        const authors = await Author.find(searchOptions)
        // 
        // Tämä viedään suoraan layout.ejs -tiedoston <body> -kenttään
        res.render('authors/index', {
            authors: authors,
            searchOptions: req.query
        })
    } catch {
        // Jos ei onnistu, siirrä vain etusivulle
        res.redirect('/')
    }
    
})

// Uuden kirjailijan hakemiseen tarkoitettu route
router.get('/new', (req, res) => {
    // res.render vie tämän suoraan layout.ejs -tiedoston <body> -kenttään
    // Annetaan mukaan yksi kirjailija-model, jota voidaan hyödyntää viewin muodostamisessa
    res.render('authors/new', { author: new Author() })
})

// Uuden kirjailijan luomiseen tarkoitettu route
router.post('/', async (req, res) => {
    const author = new Author({
        //tässä asetetaan nimi-tekstikentästä saatu nimi suoraan kirjailija-taulun nimi-kenttään
        name: req.body.name
    })
    try {
        // Yritä tallentaa uutta kirjailijaa tietokantaan
        const newAuthor = await author.save()
        // res.redirect(`authors/${newAuthor.id}`)
        // Jos onnistuu, ohjaa takaisin kirjailijoiden etusivulle
        res.redirect(`authors`)
    } catch {
        // Jos tallentaminen ei onnistu, renderöi lisäämissivu ja täytä kenttä vanhalla nimellä
        // Tulosta myös virheviesti partialin avulla
        // Tämä viedään suoraan layout.ejs -tiedoston <body> -kenttään
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        })
    }
})

// Luotujen routereiden jakaminen sovelluksen käyttöön
module.exports = router