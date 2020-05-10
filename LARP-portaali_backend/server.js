const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require('morgan');

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(logger('dev'));
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models");
const Role = db.role;

// Vaihda muotoon db.sequalize.sync() tuotannossa, jotta tietokannan tiedot eivät katoa
 db.sequelize.sync({force: true}).then(() => {
   console.log('Drop and Resync Db');
   initial();
 });

// testireititys
app.get("*", (req, res) => {
  res.json({ message: "Tervetuloa LARP-portaaliin." });
});

// reititykset
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

// määritetään portti ja kuunnellaan pyyntöjä
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// Roolien automaattinen määritys kehistysvaiheessa
function initial() {
  Role.create({
    id: 1,
    name: "player"
  });
 
  Role.create({
    id: 2,
    name: "organiser"
  });
 
  Role.create({
    id: 3,
    name: "admin"
  });
}