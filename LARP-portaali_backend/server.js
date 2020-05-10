const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:3001"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

// Vaihda muotoon db.sequalize.sync() tuotannossa, jotta tietokannan tiedot eivät katoa
db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
  initial();
});

// testireititys
app.get("/", (req, res) => {
  res.json({ message: "Tervetuloa LARP-portaaliin." });
});

// määritetään portti ja kuunnellaan pyyntöjä
const PORT = process.env.PORT || 3000;
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