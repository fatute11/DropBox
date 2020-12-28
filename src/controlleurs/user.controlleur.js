const db = require("../models");
const User = db.user;


exports.allAccess = (req, res) => {
    res.status(200).send("contenu publique.");
  };
  
  exports.userBoard = (req, res) => {
    res.status(200).send("contenu d'utilisateur.");
  };
  
  exports.adminBoard = (req, res) => {
    res.status(200).send("contenu d'admin.");
  };
  
  exports.moderatorBoard = (req, res) => {
    res.status(200).send("contenu du moderateur.");
  };

  exports.getUserByPasswordToken = (req, res) => {
    User.findOne({passwordToken: req.query.passwordToken}).then(user => {
      if (!user){
        res.send({error:'Invalid token',message: 'le token est invalid'})
      }
      res.send(user)
    })
  }
  

