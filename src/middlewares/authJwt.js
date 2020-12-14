const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "token introuvable" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "refusé!" });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "besoin du role d'admin!" });
        return;
      }
    );
  });
};

isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "moderateur") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "le Role Moderateur est requis!" });
        return;
      }
    );
  });
};

getUser = (req, res, next) => {
  //let token = req.headers["x-access-token"];
  let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZDc3Y2RkYjM0ZDQ5MDZjYmU4ODA2YiIsImlhdCI6MTYwNzk2MDk4NCwiZXhwIjoxNjA3OTYxMDcwfQ.UygL3Mi_A-qgjr4zG3xOgBltib1VxG3kV-Xq_ebhFQE'
  if (!token) {
    return res.status(403).send({ message: "token introuvable" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "refusé!" });
    }
    userId = decoded.id;
    console.log(userId)

     User.findById(userId).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      console.log(user)
      return user;
    });
    //next();
  });
};

const authJwt = {
  getUser,
  verifyToken,
  isAdmin,
  isModerator
};
module.exports = authJwt;
