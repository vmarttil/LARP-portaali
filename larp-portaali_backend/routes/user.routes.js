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

  app.get("/api/test/all", controller.allAccess);

  app.get(
    "/api/test/player",
    [authJwt.verifyToken],
    controller.playerPortal
  );

  app.get(
    "/api/test/organiser",
    [authJwt.verifyToken, authJwt.isOrganiser],
    controller.organiserPortal
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminPortal
  );

  app.put(
    "/api/user/profile",
    [authJwt.verifyToken],
    controller.updateProfile
  );

};