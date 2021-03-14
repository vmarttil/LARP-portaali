const { authJwt } = require("../middlewares");
const controller = require("../controllers/person.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/person/profile",
    [authJwt.verifyToken],
    controller.getProfile
  );

  app.put(
    "/api/person/profile",
    [authJwt.verifyToken],  
    controller.updateProfile
  );

  app.post(
    "/api/person",
    controller.findPerson
  );

  app.get(
    "/api/person/registrations",
    [authJwt.verifyToken],
    controller.getPersonRegistrations
  );

  app.post(
    "/api/person/checkRegistrations",
    [authJwt.verifyToken],
    controller.checkPersonRegistrations
  );

};