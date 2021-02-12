const db = require("../models");
const logger = require("../utils/logger");
const Game = db.game;
const db_game = require("../db/db_game");

var jwt = require("jsonwebtoken");

// Pelien tietojen hallinta

exports.createGame = async (req, res) => {
  // Save the game to the database
  try {
    console.log(req.body)
    let game = await db_game.createGame(req.userId, req.body)
    console.log(game)
    if (game.id) {
      res.status(201).send({ message: "Uuden pelin luominen onnistui." });
    } else {
      res.status(500).send({ message: "Uuden pelin luominen epäonnistui." });
    }
  } catch(err) {
      res.status(500).send({ message: err.message });
  };
};

exports.gameInfo = async (req, res) => {
  // Return the full information of the game
  try {
    let game = await db_game.getGame(req.params.game_id);
    if (game) {
      res.status(200).send(game);
    } else {
      res.status(404).send({ message: "Peliä ei löydy." });
    }
  } catch(err) {
    res.status(500).send({ message: err.message });
  }
};

exports.updateGame = async (req, res) => {
  // Checks whether the logged in user is an organiser of the game
  let game = await db_game.getGame(req.params.game_id)
  if (game.organisers.includes(req.userId)) {
    // Updates the information of the game
    try {
      let result = await db_game.updateGame(req.params.game_id, req.body.data);
      res.status(result.status).send({ message: result.message });  
    } catch(err) {
      res.status(500).send({ message: err.message });
    };
  };
};
