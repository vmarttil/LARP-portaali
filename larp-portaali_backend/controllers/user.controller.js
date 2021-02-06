const db = require("../models");
const logger = require("../utils/logger");
const User = db.user;
const db_user = require("../db/db_user");

var jwt = require("jsonwebtoken");


// Käyttäjäryhmäkohtaisten portaalien sisällöt
exports.mainPage = (req, res) => {
  res.status(200).send("Kaikille avoimen etusivun sisältö.");
};

exports.adminPortal = (req, res) => {
  res.status(200).send("Ylläpitosivun sisältö.");
};

exports.organiserPortal = (req, res) => {
  res.status(200).send("Järjestäjän omien pelien hallinnan sisältö.");
};

exports.playerPortal = (req, res) => {
  res.status(200).send("Käyttäjän omien ilmoittautumisten hallinnan sisältö.");
};

// Profiilien hallinta

exports.userProfile = async (req, res) => {
  try {
    let user = await db_user.getUser(req.body.email);
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send({ message: "Käyttäjää ei löydy." });
    }
  } catch(err) {
    res.status(500).send({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    let result = await db_user.updateProfile(req.body.data);
    res.status(result.status).send({ message: result.message });  
  } catch(err) {
    res.status(500).send({ message: err.message });
  };
};
