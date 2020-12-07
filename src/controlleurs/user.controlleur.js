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