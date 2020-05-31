module.exports = (sequelize, Sequelize) => {
  var key = process.env.DB_ENC_KEY;
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING
    },
    // Password is stored as hash string creatd with bcrypt
    password: {
      type: Sequelize.STRING
    },
    // all profile data is stored in a BLOB containing a JSON object encrypted with AES-128
    profileData: {
      type: Sequelize.BLOB
    }
  });

  return User;
};