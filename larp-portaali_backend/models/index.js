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

// db.role.belongsToMany(db.user, {
//   through: "user_roles",
//   foreignKey: "roleId",
//   otherKey: "userId"
// });
// db.user.belongsToMany(db.role, {
//   through: "user_roles",
//   foreignKey: "userId",
//   otherKey: "roleId"
// });

module.exports = db;