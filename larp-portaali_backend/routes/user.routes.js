const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/mainPage", 
    controller.mainPage);

  app.get(
    "/api/portal/player",
    [authJwt.verifyToken],
    controller.playerPortal
  );

  app.get(
    "/api/portal/organiser",
    [authJwt.verifyToken],
    controller.organiserPortal
  );

  app.get(
    "/api/portal/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminPortal
  );

  app.get(
    "/api/user/profile",
    [authJwt.verifyToken],
    controller.userProfile
  );

  app.put(
    "/api/user/profile",
    [authJwt.verifyToken],  
    controller.updateProfile
  );

};