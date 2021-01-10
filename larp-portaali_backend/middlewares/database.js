const db = require("../models");
const User = db.user;

getUser = async (userEmail) => {
  try {
    let user = await User.findOne({
      attributes: [
        "id",
        "email",
        "password",
        [
          db.Sequelize.cast(
            db.Sequelize.fn(
              'PGP_SYM_DECRYPT',
              db.Sequelize.cast(db.Sequelize.col("personalData"), "bytea"), 
              process.env.DB_ENC_KEY
            ), 
            "json"), 
          "personalData"
        ],
        [
          db.Sequelize.cast(
            db.Sequelize.fn(
              'PGP_SYM_DECRYPT',
              db.Sequelize.cast(db.Sequelize.col("profileData"), "bytea"), 
              process.env.DB_ENC_KEY
            ), 
            "json"), 
          "profileData"
        ],
        "admin"
      ],
      where: {
        email: userEmail
      }
    })
    if (!user) {
      return { message: "Käyttäjätunnusta ei löydy." };
    } else {
      return user;
    }
  } catch(err) {
    return { message: err.message };
  };
}

const database = {
  getUser: getUser,
};

module.exports = database;