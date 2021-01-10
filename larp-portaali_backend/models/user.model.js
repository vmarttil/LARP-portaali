module.exports = (sequelize, Sequelize) => {
  var key = process.env.DB_ENC_KEY;
  const User = sequelize.define("users", {
    // Email is used as a username due to its inherently unique nature and verifiability
    email: {
      type: Sequelize.STRING,
      unique: true, 
      allowNull: false
    },
    // Password is stored as hash string creatd with bcrypt
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    // all personal data is stored in a TEXT column containing a serialized JSON object encrypted with AES-128
    personalData: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    // all profile data is stored in a TEXT column containing a serialized JSON object encrypted with AES-128
    profileData: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    // Admin users will have special privileges, e.g. accepting and removing games created by other users
    admin: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  });

  return User;
};