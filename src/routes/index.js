const express = require('express')
const routes = require('express').Router();
// const www = process.env.WWW || './public';
const app = express()

app.set("public", "/../../public");
// routes.get('/', (req, res) => {
//     res.sendFile(`index.html`, { root: www });
// });

routes.get('/test', (req, res) => {
    res.render('forgot-password.ejs', {link: "mehdimedjdoub@gmail.com"});
});

module.exports = routes;