const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(logger('dev'));
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

require('dotenv').config()
const db = require("./models");
const Role = db.role;

// Vaihda muotoon db.sequalize.sync() tuotannossa, jotta tietokannan tiedot eivät katoa
(async () => {
  await db.sequelize.sync();
})();

// reititykset
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

// määritetään portti ja kuunnellaan pyyntöjä
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

