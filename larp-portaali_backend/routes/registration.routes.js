const { authJwt } = require("../middlewares");
const controller = require("../controllers/registration.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/registration/submit", 
    [authJwt.verifyToken],
    controller.submitRegistration
  );

  app.get(
    "/api/form/:form_id/person/:person_id/registration", 
    [authJwt.verifyToken],
    controller.getRegistration
  );

};