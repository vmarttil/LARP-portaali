module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'larp_portaali',
    host: '127.0.0.1',
    dialect: 'postgres',
/*  If needed, here we can enable SSL connections to the db */
//    dialectOptions: {
//      ssl: {
//        rejectUnauthorized: true,
//        ca: /* certificate authority here*/ 
//      }
//    },
    operatorsAliases: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'larp_portaali',
    host: '127.0.0.1',
    dialect: 'postgres',
/*  If needed, here we can enable SSL connections to the db */
//    dialectOptions: {
//      ssl: {
//        rejectUnauthorized: true,
//        ca: /* certificate authority here*/ 
//      }
//    },
    operatorsAliases: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'larp_portaali',
    host: '127.0.0.1',
    dialect: 'postgres',
/*  If needed, here we can enable SSL connections to the db */
//    dialectOptions: {
//      ssl: {
//        rejectUnauthorized: true,
//        ca: /* certificate authority here*/ 
//      }
//    },
    operatorsAliases: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};