const db = require("../db");
const queries = require("../db/person.queries")

checkDuplicateUsername = async (req, res, next) => {
  // Check whether username/email is unique
  try {
    let { rows } = await db.query(queries.checkEmail, [req.body.email])
    if (rows.length > 0) {
      res.status(400).send({ message: "Virhe! Sähköpostiosoite on jo käytössä." });
      return;
    }  
    next();
  } catch(err) {
    res.status(500).send({ message: err.message });
  }
};

const verifySignUp = {
  checkDuplicateUsername: checkDuplicateUsername,
};

module.exports = verifySignUp;