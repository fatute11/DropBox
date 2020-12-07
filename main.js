const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./src/routes')
const cors = require("cors");

const app = express()

var corsOptions = {
    origin: "http://localhost:8081"
  };

const port = process.env.PORT || 8020; 
const www = process.env.WWW || './public';

// Middelware
app.use(express.static(www));
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes)

const db = require("./src/models");
const Role = db.role;
// routes
// require('./routes/auth.routes')(app);
// require('./routes/user.routes')(app);

// db.mongoose
//   .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(() => {
//     console.log("Successfully connect to MongoDB.");
//     initial();
//   })
//   .catch(err => {
//     console.error("Connection error", err);
//     process.exit();
//   });


// function initial() {
//   Role.estimatedDocumentCount((err, count) => {
//     if (!err && count === 0) {
//       new Role({
//         name: "user"
//       }).save(err => {
//         if (err) {
//           console.log("error", err);
//         }

//         console.log("added 'user' to roles collection");
//       });

//       new Role({
//         name: "moderator"
//       }).save(err => {
//         if (err) {
//           console.log("error", err);
//         }

//         console.log("added 'moderator' to roles collection");
//       });

//       new Role({
//         name: "admin"
//       }).save(err => {
//         if (err) {
//           console.log("error", err);
//         }

//         console.log("added 'admin' to roles collection");
//       });
//     }
//   });
// }

app.listen(port, () => console.log(`listening on http://localhost:${port}`));