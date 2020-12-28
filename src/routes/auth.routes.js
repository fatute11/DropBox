const { verifySignUp } = require("../middlewares");
const controlleur = require("../controlleurs/auth.controlleur");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      // "Access-Control-Allow-Headers",
      // "x-access-token, Origin, Content-Type, Accept",
      'Access-Control-Expose-Headers', 'Access-Control-Allow-Origin',
      'Access-Control-Allow-Origin', 'http://localhost:3000',
      'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept',
      'Access-Control-Allow-Credentials', 'true'
    );
    next();
  });


  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controlleur.signup
  );

  app.post("/api/auth/signin", controlleur.signin);

  app.post("/forgot-password", controlleur.forgotPassword);
  app.post("/reset-password", controlleur.updatePassword)

};