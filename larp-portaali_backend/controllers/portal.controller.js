const logger = require("../utils/logger");

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

