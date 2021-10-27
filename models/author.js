// Sisällytetään mongoosen ominaisuudet, eli käytännössä mongoDB-toiminnallisuus
const mongoose = require('mongoose')
// Muodostetaan schema kirjailijalle, tämä on käytännössä taulu SQL-tietokannassa
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})
// Luodun modelin(=taulun) jakaminen sovelluksen käyttöön, taulun nimeksi tulee 'Author'
module.exports = mongoose.model('Author', authorSchema)