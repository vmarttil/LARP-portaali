const db = require("../models");
const User = db.user;

checkDuplicateUsername = async (req, res, next) => {
  // Check whether username/email is unique
  try {
    let user = await User.findOne({
      where: {
        email: req.body.email
      }
    })
    if (user) {
      res.status(400).send({
        message: "Virhe! Sähköpostiosoite on jo käytössä."
      });
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