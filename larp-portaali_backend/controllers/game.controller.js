const db = require("../models");
const logger = require("../utils/logger");
const Game = db.game;
const db_game = require("../db/db_game");

var jwt = require("jsonwebtoken");
const db_user = require("../db/db_user");

// Pelien tietojen hallinta

exports.createGame = async (req, res) => {
  // Save the game to the database
  try {
    let game = await db_game.createGame(req.userId, req.body);
    if (game.id && game.organisers) {
      res.status(201).send({ message: "Uuden pelin luominen onnistui." });
    } else {
      res.status(500).send({ message: "Uuden pelin luominen epäonnistui." });
    }
  } catch(err) {
      res.status(500).send({ message: err.message });
  }
}

exports.gameInfo = async (req, res) => {
  // Return the full information of the game
  try {
    let result = await db_game.getGame(req.params.game_id);
    if (result.status && result.message) {
      res.status(result.status).send({ message: result.message });
    } else {
      res.status(200).send(result);
    }
  } catch(err) {
    res.status(500).send({ message: err.message });
  }
}

exports.updateGame = async (req, res) => {
  // Checks whether the logged in user is an organiser of the game
  if (await db_game.checkOrganiserStatus(req.params.game_id, req.userId)) {
    // Updates the information of the game
    try {
      let result = await db_game.updateGame(req.params.game_id, req.body);
      if (result.status && result.message) {
        res.status(result.status).send({ message: result.message });
      } else {
        res.status(200).send(result);
      }
    } catch(err) {
      res.status(500).send({ message: err.message });
    }
  } else {
    res.status(403).send({ message: "Et ole pelin järjestäjä." });
  }
}

exports.getOrganisers = async (req, res) => {
  // Checks whether the logged in user is an organiser of the game
  if (await db_game.checkOrganiserStatus(req.params.game_id, req.userId)) {
    // Gets a list of organiser ids, names and emails 
    try {
      let result = await db_game.getOrganisers(req.params.game_id);
      if (result.status && result.message) {
        res.status(result.status).send({ message: result.message });
      } else {
        res.status(200).send(result);
      }
    } catch(err) {
      res.status(500).send({ message: err.message });
    };
  } else {
    res.status(403).send({ message: "Et ole pelin järjestäjä." });
  }
}

exports.addOrganiser = async (req, res) => {
  // Checks whether the logged in user is an organiser of the game and whether the email address given corresponds to a user
  if (await db_game.checkOrganiserStatus(req.params.game_id, req.userId) === false) {
    res.status(403).send({ message: "Et ole pelin järjestäjä." });
  } else if (!await db_user.getUserDataByEmail(req.body.email)) {
    res.status(404).send({ message: "Lisättävää käyttäjää ei löydy." });
  } else {
    // Adds the user with the given email as an organiser of the given game
    try {
      let result = await db_game.addOrganiser(req.params.game_id, req.body.email);
      if (result.status && result.message) {
        res.status(result.status).send({ message: result.message });
      } else {
        res.status(200).send(result);
      }
    } catch(err) {
      res.status(500).send({ message: err.message });
    }
  }
}

exports.removeOrganiser = async (req, res) => {
  // Checks whether the logged in user is an organiser of the game and whether the id given corresponds to another organiser
  if (req.userId === req.body.id) {
    res.status(403).send({ message: "Et voi poistaa itseäsi." });
  } else if (await db_game.checkOrganiserStatus(req.params.game_id, req.userId) === false) {
    res.status(403).send({ message: "Et ole pelin järjestäjä." });
  } else if (await db_game.checkOrganiserStatus(req.params.game_id, req.body.id) === false) {
    res.status(403).send({ message: "Poistettava käyttäjä ei ole pelin järjestäjä." });
  } else {
    // Removes the user with the given id from the organisers of the given game  
    try {
      let result = await db_game.removeOrganiser(req.params.game_id, req.body.id);
      if (result.status && result.message) {
        res.status(result.status).send({ message: result.message });
      } else {
        res.status(200).send(result);
      }
    } catch(err) {
      res.status(500).send({ message: err.message });
    }
  }
}