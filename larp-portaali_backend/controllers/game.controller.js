const Game = require("../db/game.db");

exports.gameList = async (req, res) => {
  let gameList = await Game.getFutureGames();
  res.status(200).send({ games: gameList });
};

exports.createGame = async (req, res) => {
  // Save the game to the database
  try {
    let game = await Game.createGame(req.userId, req.body.data);
    if (game.id && game.organisers) {
      res.status(201).send({ message: "Uuden pelin luominen onnistui."});
    } else {
      res.status(500).send({ message: "Uuden pelin luominen ei onnistunut." });
    }
  } catch(err) {
      res.status(500).send({ message: err.message });
  }
};

exports.gameInfo = async (req, res) => {
  // Return the full information of the game
  try {
    let game = await Game.getGame(req.params.game_id);
    if (game) {
      res.status(200).send({ game });
    } else {
      res.status(404).send({ message: "Peliä ei löytynyt." });
    }
  } catch(err) {
    res.status(500).send({ message: err.message });
  }
};

exports.organiserGameList = async (req, res) => {
  // Return a list of the games organised by the current person
  try {
    let organiserGameList = await Game.getOrganiserGames(req.userId);
    if (organiserGameList) {
      res.status(200).send({ games: organiserGameList });
    } else {
      res.status(404).send({ message: "Käyttäjälle ei löytynyt pelejä." });
    }
  } catch(err) {
    res.status(500).send({ message: err.message });
  }
};

exports.updateGame = async (req, res) => {
  let gameId = req.params.game_id;
  let gameData = req.body.data;
  // Checks whether the logged in user is an organiser of the game
  if (await Game.checkOrganiserStatus(gameId, req.userId)) {
    // Updates the information of the game
    try {
      let result = await Game.updateGame(gameId, gameData);
      if (result) {
        res.status(200).send({ message: "Pelin tiedot päivitetty." });
      } else {
        res.status(404).send({ message: "Peliä ei löytynyt." });
      }
    } catch(err) {
      res.status(500).send({ message: err.message });
    }
  } else {
    res.status(403).send({ message: "Et ole pelin järjestäjä." });
  }
};

exports.getOrganisers = async (req, res) => {
  let gameId = req.params.game_id;
  // Checks whether the logged in user is an organiser of the game
  if (await Game.checkOrganiserStatus(gameId, req.userId)) {
    // Gets a list of organiser ids and names
    try {
      let result = await Game.getOrganisers(gameId);
      if (result) {
        res.status(200).send({ organisers: result });
      } else {
        res.status(404).send({ message: "Peliä ei löytynyt."});
      }
    } catch(err) {
      res.status(500).send({ message: err.message });
    };
  } else {
    res.status(403).send({ message: "Et ole pelin järjestäjä." });
  }
};

exports.addOrganiser = async (req, res) => {
  let gameId = req.params.game_id;
  // Checks whether the logged in user is an organiser of the game
  if (await Game.checkOrganiserStatus(gameId, req.userId)) {
    let newOrganiserId = req.body.data.id;
    // Checks whether the user is already an organiser
    if (await Game.checkOrganiserStatus(gameId, newOrganiserId) === false) {
      await Game.addOrganiser(gameId, newOrganiserId);
      res.status(200).send({ message: "Henkilö lisätty järjestäjäksi." });  
    } else {
      res.status(403).send({ message: "Henkilö on jo pelin järjestäjä." });  
    }
  } else {
    res.status(403).send({ message: "Et ole pelin järjestäjä." });
  }
};

exports.removeOrganiser = async (req, res) => {
  let gameId = req.params.game_id;
  let organiserId = req.body.data.id;
  // Checks whether the logged in user is an organiser of the game
  if (await Game.checkOrganiserStatus(gameId, req.userId)) {
    // Checks whether the user to be removed is an organiser of the game
    if (await Game.checkOrganiserStatus(gameId, organiserId)) {
      // Checks whether the removed user is the only organiser of the game
      let organiserList = await Game.getOrganisers(gameId);
      if (organiserList.length > 1) {
        let result = await Game.removeOrganiser(gameId, organiserId);
        res.status(200).send({ message: "Järjestäjä poistettu." });  
      } else {
        res.status(403).send({ message: "Pelin ainoaa järjestäjää ei voi poistaa." });
      }
    } else {
      res.status(403).send({ message: "Henkilö ei ole pelin järjestäjä." });
    }
  } else {
    res.status(403).send({ message: "Et ole pelin järjestäjä." });
  }
};

exports.getForms = async (req, res) => {
  // Return a list of the forms created for the game with their id, name description and status
  try {
    let gameFormList = await Game.getGameForms(req.params.game_id);
    if (gameFormList) {
      res.status(200).send({ forms: gameFormList });
    } else {
      res.status(404).send({ message: "Pelille ei löytynyt lomakkeita." });
    }
  } catch(err) {
    res.status(500).send({ message: err.message });
  }
};

exports.getGameRegistrations = async (req, res) => {
  let gameId = req.params.game_id;
  let userId = req.userId;
  try {
    // Checks whether the logged in user is an organiser of the game
    if (await Game.checkOrganiserStatus(gameId, userId)) {
    // Return a list of the game's registrations form and person ids, submitter names and submission times
      let registrations = await Game.getGameRegistrations(gameId);
      if (registrations.length > 0) {
        res.status(200).send({ registrations: registrations });
      } else {
        res.status(404).send({ message: "Ei ilmoittautumisia." });
      }
    } else {
      res.status(403).send({ message: "Et ole pelin järjestäjä." });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
