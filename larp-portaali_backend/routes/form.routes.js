const { authJwt } = require("../middlewares");
const controller = require("../controllers/form.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/form/create", 
    [authJwt.verifyToken],
    controller.createForm
  );

  app.get(
    "/api/form/:form_id/edit", 
    [authJwt.verifyToken],
    controller.editForm
  );

  app.put(
    "/api/form/:form_id/update",
    [authJwt.verifyToken],  
    controller.updateForm
  );

  app.post(
    "/api/form/:form_id/toggle", 
    [authJwt.verifyToken],
    controller.toggleRegistration
  );

  app.get(
    "/api/form/:form_id", 
    [authJwt.verifyToken],
    controller.getForm
  );

  app.post(
    "/api/form/question", 
    [authJwt.verifyToken],
    controller.createQuestion
  );

  app.get(
    "/api/form/question/:question_id", 
    [authJwt.verifyToken],
    controller.getQuestion
  );

  app.put(
    "/api/form/question/:question_id", 
    [authJwt.verifyToken],
    controller.updateQuestion
  );
};