module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    firstname: {
      type: Sequelize.STRING
    },
    lastname: {
      type: Sequelize.STRING
    },
    nickname: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    birthdate: {
      type: Sequelize.DATE
    }
  });

  return User;
};