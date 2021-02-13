require('dotenv').config()
var bcrypt = require("bcryptjs");
const db_user = require("./db_user");
const db = require("../models");
const { user } = require('../models');
const Game = db.game;
const User = db.user;

createGame = async (organiserId, gameData) => {
  try {
    let game = await Game.create({
      name: gameData.name,
      startDate: gameData.startDate,
      endDate: gameData.endDate,
      place: gameData.place,
      description: gameData.description
    });
    let organiser = await db_user.getUserById(organiserId)
    await game.addOrganiser(organiser, { through: { confirmed: true }})
    game = await getGame(game.id)
    return game
  } catch(err) {
    return { message: err.message };
  };
}

checkOrganiserStatus = async (gameId, userId) => {
  try {
    let game = await Game.findOne({
      attributes: ["id",],
      include: {model: User, 
                as: "organisers",
                attributes: ["id"]},
      where: {
        id: gameId
      }
    })
    let organiserIds = game.organisers.map( organiser => organiser.id)
    return organiserIds.include(userId)
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
      include: {model: User, 
                as: "organisers",
                attributes: ["id"]},
      where: {
        id: gameId
      }
    })
    organiserNames = []
    for (const organiser of game.organisers) {
      organiserNames.push(await db_user.getUserName(organiser.id))
    }
    game = game.dataValues
    game.organisers = organiserNames
    return game;
  } catch(err) {
    return { message: err.message };
  };
}

updateGame = async (gameId, gameData) => {
  let returnValue = { status: 404, message: "Peliä ei löydy."}
  try {
    let organisers = []
    for (const id in gameData.organisers) {
      organisers.push(db_user.getUserById(id))
    }
    let updated = await Game.update(
        {name: gameData.name, startDate: gameData.startDate, endDate: gameData.endDate, place: gameData.place, description: gameData.description},
        {
          where: {id: gameId},
          returning: true,
          plain: true
        }
      )
      console.log(updated)
      returnValue = updated[1].id ? { status: 200, message: "Pelin tiedot päivitetty." } : { status: 404, message: "Peliä ei löydy."} 
    return returnValue
  } catch(err) {
    return {status: 500, message: err.message };
  };
}

const db_game = {
  createGame, checkOrganiserStatus, getGame, updateGame
};

module.exports = db_game;