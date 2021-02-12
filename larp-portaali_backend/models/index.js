const config = require("../config/db.config.js");
const env = process.env.NODE_ENV;
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  config[env].database,
  config[env].username,
  config[env].password,
  {
    host: config[env].host,
    dialect: config[env].dialect,
    operatorsAliases: config[env].operatorsAliases,

    pool: {
      max: config[env].pool.max,
      min: config[env].pool.min,
      acquire: config[env].pool.acquire,
      idle: config[env].pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.game = require("../models/game.model.js")(sequelize, Sequelize);
db.game_organiser = require("../models/game_organiser.model.js")(sequelize, Sequelize);

db.game.belongsToMany(db.user, {
  as: "organisers",
  through: "game_organisers",
  foreignKey: "gameId",
  otherKey: "organiserId"
});
db.user.belongsToMany(db.game, {
  as: "organised_games",
  through: "game_organisers",
  foreignKey: "organiserId",
  otherKey: "gameId"
});

module.exports = db;