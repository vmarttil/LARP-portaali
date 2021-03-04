const { authJwt } = require("../middlewares");
const controller = require("../controllers/game.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/gameList", 
    controller.gameList);

  app.get(
    "/api/game/:game_id", 
    controller.gameInfo
  );

  app.get(
    "/api/organiserGameList", 
    [authJwt.verifyToken],
    controller.organiserGameList);

  app.post(
    "/api/game", 
    [authJwt.verifyToken],
    controller.createGame
  );

  app.put(
    "/api/game/:game_id",
    [authJwt.verifyToken],  
    controller.updateGame
  );

  app.put(
    "/api/game/:game_id/toggle",
    [authJwt.verifyToken],  
    controller.toggleGame
  );

  app.get(
    "/api/game/:game_id/organisers",
    [authJwt.verifyToken],  
    controller.getOrganisers
  );

  app.post(
    "/api/game/:game_id/addOrganiser",
    [authJwt.verifyToken],  
    controller.addOrganiser
  );

  app.post(
    "/api/game/:game_id/removeOrganiser",
    [authJwt.verifyToken],  
    controller.removeOrganiser
  );
};