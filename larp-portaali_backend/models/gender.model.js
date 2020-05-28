module.exports = (sequelize, Sequelize) => {
  const Gender = sequelize.define("genders", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    }
  });

  return Gender;
};