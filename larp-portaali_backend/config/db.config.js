module.exports = {
  HOST: "localhost",
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: "larp_portal",

  dialect: "mysql",
  /* If needed, here we can enable SSL connections to the db */
  // dialectOptions: {
  //  ssl: {
  //      rejectUnauthorized: true,
  //      ca: /* certificate authority here*/ 
  //  }
  //},
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};