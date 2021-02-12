module.exports = (sequelize, Sequelize) => {
  var key = process.env.DB_ENC_KEY;
  const GameOrganiser = sequelize.define("game_organiser", {
    // This is a link table with additional attributes
    gameId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    organiserId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    // Has the assignment as organiser been confirmed by the person themselves
    confirmed: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      default: false
    }
  });

  return GameOrganiser;
};