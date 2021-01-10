const db = require("../models");
const User = db.user;
const database = require("../middlewares/database");

var jwt = require("jsonwebtoken");


// Portaalien sisällöt
exports.allAccess = (req, res) => {
  res.status(200).send("Kaikille avoin sisältö.");
};

exports.adminPortal = (req, res) => {
  res.status(200).send("Ylläpitäjille avoin sisältö.");
};

exports.userPortal = (req, res) => {
  res.status(200).send("Käyttäjille avoin sisältö.");
};

// Profiilien hallinta

exports.userProfile = async (req, res) => {
  try {
    console.log("Vastaanotettu token: ", req.headers["x-access-token"]);
    console.log(req.body)
    let user = await database.getUser(req.body.email);
    if (user.id) {
      res.status(200).send(user);
    } else {
      res.status(500).send("Käyttäjää ei löydy.");
    }
  } catch(err) {
    res.status(500).send({ message: err.message });
  }
};

exports.updatePersonalData = async (req, res) => {
  try {
    let user = await database.getUser(req.body.email);
    await user.update({
      personalData: JSON.stringify(db.Sequelize.fn('AES_ENCRYPT', req.body.personalData, process.env.DB_ENC_KEY))
    })
    res.status(200).send({ message: "Henkilötiedot päivitetty." });
  } catch(err) {
    res.status(500).send({ message: err.message });
  };
};

exports.updateProfileData = async (req, res) => {
  try {
    let user = await database.getUser(req.body.email);
    await user.update({
      profileData: JSON.stringify(db.Sequelize.fn('AES_ENCRYPT', req.body.profileData, process.env.DB_ENC_KEY))
    })
    res.status(200).send({ message: "Profiilitiedot päivitetty." });
  } catch(err) {
    res.status(500).send({ message: err.message });
  };
};
