const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require('morgan');
const logger = require('./utils/logger');
const cookieParser = require('cookie-parser');
const config = require("./config/config");


const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

require('dotenv').config()
// const db = require("./models");

// (async () => {
//   await db.sequelize.sync();
// })();

// reititykset
require('./routes/auth.routes')(app);
require('./routes/portal.routes')(app);
require('./routes/person.routes')(app);
require('./routes/game.routes')(app);
require('./routes/form.routes')(app);
require('./routes/registration.routes')(app);

// palautetaan virheilmoitus tuntemattomasta endpointista
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// määritetään portti ja kuunnellaan pyyntöjä
app.listen(config.PORT, () => {
  logger.info(`Server is running on port ${config.PORT}.`);
});

