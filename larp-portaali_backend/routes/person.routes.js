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
    "/api/user/profile",
    [authJwt.verifyToken],
    controller.getProfile
  );

  app.put(
    "/api/user/profile",
    [authJwt.verifyToken],  
    controller.updateProfile
  );

  app.post(
    "/api/user",
    controller.findPerson
  );

};