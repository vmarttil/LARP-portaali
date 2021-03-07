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
    "/api/form/:form_id", 
    [authJwt.verifyToken],
    controller.getForm
  );

  app.get(
    "/api/form/edit/:form_id", 
    [authJwt.verifyToken],
    controller.editForm
  );

  app.put(
    "/api/form/update/:form_id",
    [authJwt.verifyToken],  
    controller.updateForm
  );

  app.post(
    "/api/form/question", 
    [authJwt.verifyToken],
    controller.createQuestion
  );

  app.put(
    "/api/form/question", 
    [authJwt.verifyToken],
    controller.updateQuestion
  );


};