const cors = require("cors");
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const routes = require('./src/routes')

const helmet = require('helmet');
const morgan = require('morgan');
const {startDatabase} = require('./src/database/mongo');
const {insertAd, getAds} = require('./src/database/ads');

const app = express()

var corsOptions = {
    credentials: true,
    origin: "http://localhost:3000"
  };

const port = process.env.PORT || 8020; 
const www = process.env.WWW || './public';

// defining an array to work as the database (temporary solution)
const ads = [
  {title: 'Hello, world (again)!'}
];

app.use(function(req, res, next) {
    res.header(
      // "Access-Control-Allow-Headers",
      // "x-access-token, Origin, Content-Type, Accept",
      'Access-Control-Expose-Headers', 'Access-Control-Allow-Origin',
      'Access-Control-Allow-Origin', 'http://localhost:3000',
      'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept',
      'Access-Control-Allow-Credentials', true
    );
    next();
  });

// Middelware
app.use(express.static(www));
app.use(cors(corsOptions));
app.use(cookieParser())
// adding Helmet to enhance your API's security
app.use(helmet());
// adding morgan to log HTTP requests
app.use(morgan('combined'));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes)

app.set('view engine', 'ejs');

// routes
require('./src/routes/auth.routes')(app);
require('./src/routes/user.routes')(app);
require('./src/routes/fileRoute')(app);

// // replace the endpoint responsible for the GET requests
// app.get('/', async (req, res) => {
//   res.send(await getAds());
// });

// // start the in-memory MongoDB instance
// startDatabase().then(async () => {
//   await insertAd({title: 'Hello, now from the in-memory database!'});
// });

app.listen(port, () => console.log(`listening on http://localhost:${port}`));