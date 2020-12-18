const routes = require('express').Router();
const www = process.env.WWW || './public';

routes.get('/', (req, res) => {
    res.sendFile(`index.html`, { root: www });
});

module.exports = routes;