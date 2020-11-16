const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const routes = require('./src/routes')

const port = process.env.PORT || 8020; 
const www = process.env.WWW || './public';

// Middelware
app.use(express.static(www));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(routes)

app.listen(port, () => console.log(`listening on http://localhost:${port}`));