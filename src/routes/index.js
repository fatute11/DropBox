const routes = require('express').Router();

routes.get('*', (req, res) => {
    res.sendFile(`index.html`, { root: www });
});

module.exports = routes;