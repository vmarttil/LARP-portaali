const logger = require("../utils/logger");
var jwt = require("jsonwebtoken");
const Game = require("../db/game.db");

// Käyttäjäryhmäkohtaisten portaalien sisällöt

exports.adminPortal = (req, res) => {
  res.status(200).send("Ylläpitosivun sisältö.");
};

exports.organiserPortal = (req, res) => {
  res.status(200).send("Järjestäjän omien pelien hallinnan sisältö.");
};

exports.playerPortal = (req, res) => {
  res.status(200).send("Käyttäjän omien ilmoittautumisten hallinnan sisältö.");
};

