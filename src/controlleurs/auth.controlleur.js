const db = require("../models");
const User = db.user;
const Role = db.role;

let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");
let crypto = require("crypto");
let  mailerService = require("../services/nodemailer/mailerService")


exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    passwordToken: ""

  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "l'utilisateur est enregistré!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "l'utilisateur est enregistré!" });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "utilisateur non trouver." });
      }


      var passwordIsValid = bcrypt.compareSync(

        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "mot de passe incorrect!!"
        });
      }

      var token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_LIFE // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
      });
    });
};


exports.forgotPassword = (req, res) => {

    const email = req.body.email
  
    User.findOne({email: email}).then(user => {
      console.log(user)
      if (!user){
        res.send({status: 404, error:'user not find', message:'Aucun utilisateur trouvé avec cette adresse'})
      }
      
      token = crypto.randomBytes(32).toString('hex')
  
      User.findOneAndUpdate({_id: user._id}, {$set:{passwordToken: token}}).exec();

      tokenLink = `${process.env.FRONT_HOST}reset-password/${token}`
      mailerService.forgotPassword(tokenLink, user.email)

      res.send({status: 200, message: 'ok'})
    })
  };

  exports.updatePassword = (req,res) => {
    const password = bcrypt.hashSync(req.body.password, 8)
    User.findByIdAndUpdate({_id:req.body.id}, {$set:{password: password}}).exec();
  };


