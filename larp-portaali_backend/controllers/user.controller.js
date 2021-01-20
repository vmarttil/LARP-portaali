const db = require("../models");
const logger = require("../utils/logger");
const User = db.user;
const db_user = require("../db/db_user");

var jwt = require("jsonwebtoken");


// Käyttäjäryhmäkohtaisten portaalien sisällöt
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
    let result = await db_user.updateProfile(req.body);
    res.status(result.status).send({ message: result.message });  
  } catch(err) {
    res.status(500).send({ message: err.message });
  };
};
