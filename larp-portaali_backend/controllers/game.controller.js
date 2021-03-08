const logger = require("../utils/logger");
const Game = require("../db/game.db");
const Form = require("../db/form.db");
const Person = require("../db/person.db");


// Pelien tietojen hallinta

exports.gameList = async (req, res) => {
  let gameList = await Game.getOpenGames();
  res.status(200).send({ games: gameList });
};

exports.createGame = async (req, res) => {
  // Save the game to the database
  try {
    let game = await Game.create(req.userId, req.body.data);
    if (game.id && game.organisers) {
      res.status(201).send({ message: "Uuden pelin luominen onnistui."});
    } else {
      res.status(500).send({ message: "Uuden pelin luominen ei onnistunut." });
    }
  } catch(err) {
      res.status(500).send({ message: err.message });
  }
}

exports.gameInfo = async (req, res) => {
  // Return the full information of the game
  try {
    let game = await Game.get(req.params.game_id);
    if (game) {
      res.status(200).send({ game: game });
    } else {
      res.status(404).send({ message: "Peliä ei löytynyt." });
    }
  } catch(err) {
    res.status(500).send({ message: err.message });
  }
}

exports.organiserGameList = async (req, res) => {
  // Return a list of the games organised by the current person
  try {
    let organiserGameList = await Game.getOrganiserGames(req.userId);
    if (organiserGameList) {
      res.status(200).send({ games: organiserGameList });
    } else {
      res.status(404).send({ message: "Käyttäjän pelejä ei löytynyt." });
    }
  } catch(err) {
    res.status(500).send({ message: err.message });
  }
}

exports.updateGame = async (req, res) => {
  // Checks whether the logged in user is an organiser of the game
  if (await Game.checkOrganiserStatus(req.params.game_id, req.userId)) {
    // Updates the information of the game
    try {
      let result = await Game.update(req.params.game_id, req.body.data);
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
}

exports.getOrganisers = async (req, res) => {
  // Checks whether the logged in user is an organiser of the game
  if (await Game.checkOrganiserStatus(req.params.game_id, req.userId)) {
    // Gets a list of organiser ids and names
    try {
      let result = await Game.getOrganisers(req.params.game_id);
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
}

exports.addOrganiser = async (req, res) => {
  // Checks whether the logged in user is an organiser of the game
  if (await Game.checkOrganiserStatus(req.params.game_id, req.userId)) {
    let newOrganiserId = req.body.data.id;
    // Checks whether the user is already an organiser
    if (await Game.checkOrganiserStatus(req.params.game_id, newOrganiserId) === false) {
      await Game.addOrganiser(req.params.game_id, newOrganiserId);
      res.status(200).send({ message: "Henkilö lisätty järjestäjäksi." });  
    } else {
      res.status(403).send({ message: "Henkilö on jo pelin järjestäjä." });  
    }
  } else {
    res.status(403).send({ message: "Et ole pelin järjestäjä." });
  }
}

exports.removeOrganiser = async (req, res) => {
  // Checks whether the logged in user is an organiser of the game
  if (await Game.checkOrganiserStatus(req.params.game_id, req.userId)) {
    // Checks whether the user to be removed is an organiser of the game
    if (await Game.checkOrganiserStatus(req.params.game_id, req.body.data.id)) {
      // Checks whether the removed user is the only organiser of the game
      let organiserList = await Game.getOrganisers(req.params.game_id);
      if (organiserList.length > 1) {
        let result = await Game.removeOrganiser(req.params.game_id, req.body.data.id);
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
}

exports.getForms = async (req, res) => {
  // Return a list of the forms created for the game with their id, name description and status
  try {
    let gameFormList = await Game.getGameForms(req.params.game_id);
    if (gameFormList) {
      res.status(200).send({ forms: gameFormList });
    } else {
      res.status(404).send({ message: "Pelin lomakkeita ei löytynyt." });
    }
  } catch(err) {
    res.status(500).send({ message: err.message });
  }
}
