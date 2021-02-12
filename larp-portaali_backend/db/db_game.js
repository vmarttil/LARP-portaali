require('dotenv').config()
var bcrypt = require("bcryptjs");
const db = require("../models");
const Game = db.game;
const User = db.user;

createGame = async (organiserId, gameData) => {
  try {
    let game = await Game.create({
      name: gameData.name,
      startDate: new Date(gameData.startDate),
      endDate: new Date(gameData.endDate),
      place: gameData.place,
      description: gameData.description
    })
    let organiser = await db_user.getUserById(organiserId);
    game.setOrganiser(organiser)
    return game
  } catch(err) {
    return { message: err.message };
  };
}

getGame = async (gameId) => {
  try {
    let game = await Game.findOne({
      attributes: [
        "id",
        "name",
        "startDate",
        "endDate",
        "place",
        "description"
      ],
      include: {model: User, as: "organisers"},
      where: {
        id: gameId
      }
    })
    return game;
  } catch(err) {
    return { message: err.message };
  };
}

updateGame = async (gameId, gameData) => {
  
  let returnValue = { status: 404, message: "Peliä ei löydy."}
  try {
    let updated = await Game.update(
        {name: gameData.name, startDate: new Date(gameData.startDate), endDate: new Date(gameData.endDate), place: gameData.place, description: gameData.description},
        {
          where: {id: gameId},
          returning: true,
          plain: true
        }
      )
      updated[1].setOrganisers(gameData.organisers)
      returnValue = updated[0] > 0 ? { status: 200, message: "Pelin tiedot päivitetty." } : { status: 404, message: "Peliä ei löydy."} 
    return returnValue
  } catch(err) {
    return {status: 500, message: err.message };
  };
}

const db_game = {
  createGame, getGame, updateGame
};

module.exports = db_game;