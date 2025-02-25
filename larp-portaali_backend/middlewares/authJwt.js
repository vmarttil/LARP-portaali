const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../db");
const queries = require("../db/person.queries")

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      message: "Et ole kirjautunut sisään."
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(403).send({
        message: "Ei käyttöoikeutta."
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = async (req, res, next) => {
  let { rows } = await db.query(queries.checkAdminStatus, [req.userId])
  if (rows[0].admin) {
    next();
    return;
  }
  res.status(403).send({
    message: "Vaatii ylläpitäjän käyttöoikeudet."
  });
  return;
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin
};

module.exports = authJwt;
