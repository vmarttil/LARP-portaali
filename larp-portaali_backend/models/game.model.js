module.exports = (sequelize, Sequelize) => {
  var key = process.env.DB_ENC_KEY;
  const Game = sequelize.define("game", {
    // Each game must have a name that can be displayed in lists
    name: {
      type: Sequelize.STRING, 
      allowNull: false
    },
    // The start and end dates are stored as SQL dates and are mandatory (the registration should not be opened before dates are known)
    startDate: {
      type: Sequelize.DATE,
      allowNull: false
    },
    endDate: {
      type: Sequelize.DATE,
      allowNull: false
    },
    // The place where the game is held as a free-form string; the location is mandatory
    place: {
      type: Sequelize.STRING,
      allowNull: false
    },
    // A description of at least some length is required
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  });

  return Game;
};