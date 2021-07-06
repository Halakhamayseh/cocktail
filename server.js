'use strict'
const express = require('express');
const pg = require('pg');
const cors = require('cors');
const superagent = require('superagent');
const methodOverride = require('method-override');
require('dotenv').config();
///
const server = express();
server.use(cors());
server.use(express.urlencoded({ extended: true }))
server.use(express.static('./public'))
server.set('view engine','ejs')
server.use(methodOverride('_method'))
const PORT = process.env.PORT || 5000
const clint = new pg.Client(process.env.DATABASE_URL)
///
server.get('/', homeHandler)
server.post('/add', addPostHandler)
server.get('/favarite', favariteHandler)
server.get('/favarite/:id', favariteidHandler)
server.put('/put/:id', putHandler)
server.delete('/delete/:id', deleteHandler)
//
function homeHandler(req, res) {

    let url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic`
    superagent.get(url).then((result) => {
        let data = result.body;
        let arr = data.drinks.map((item) => new Coctails(item))
        res.render('pages/home', { homeKey: arr })
    })
}
function addPostHandler(req, res) {
    const { strdrink, strdinkthumb } = req.body;
    let safeVaules = [strdrink, strdinkthumb]
    let SQL = `INSERT INTO drinks (strdrink,strdinkthumb)VALUES ($1, $2);`
    clint.query(SQL, safeVaules).then(() => {
        res.redirect('/favarite')
    })
}
function favariteHandler(req, res) {
    let SQL = `SELECT * FROM drinks;`
    clint.query(SQL).then((result) => {
        let data=result.rows
       res.render('pages/favaritep', { favariteKey: data })
    })
}
function favariteidHandler(req, res) {
    let id=[req.params.id]
    let SQL = `SELECT * FROM drinks WHERE id=$1;`
    clint.query(SQL,id).then((result) => {
        let data=result.rows[0]
       res.render('pages/favariteDetailesp', { DetailesKey: data })
    })
}
function putHandler(req, res) {
    let id=req.params.id
    const { strdrink, strdinkthumb } = req.body;
    let safeVaules = [strdrink, strdinkthumb, id]
    let SQL=`UPDATE drinks SET strdrink = $1, strdinkthumb = $2 WHERE id=$3;`
    clint.query(SQL, safeVaules).then(() => {
        res.redirect(`/favarite/${id}`)
    })
}
function deleteHandler(req, res) {
    let id=[req.params.id]
    let SQL = `DELETE FROM drinks WHERE id=$1;`
    clint.query(SQL,id).then(() => {
        res.redirect('/favarite')
    })
}
//strdrink,strdinkthumb
function Coctails(obj) {
    this.strdrink = obj.strDrink || 'not found'
    this.strdinkthumb = obj.strDrinkThumb || 'not found'
}
///
clint.connect().then(() => {
    server.listen(PORT, () => {
        console.log(`listen to PORT ${PORT}`)
    })
})