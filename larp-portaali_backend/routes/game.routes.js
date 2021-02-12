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
    "/api/game/:game_id", 
    controller.gameInfo
  );

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

};