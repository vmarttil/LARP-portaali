require('dotenv').config()
var bcrypt = require("bcryptjs");
const db_user = require("./db_user");
const db = require("../models");
const { user } = require('../models');
const Game = db.game;
const User = db.user;

createGame = async (organiserId, gameData) => {
  let game = await Game.create({
    name: gameData.name,
    startDate: gameData.startDate,
    endDate: gameData.endDate,
    place: gameData.place,
    description: gameData.description
  });
  let organiser = await db_user.getUserById(organiserId);
  await game.addOrganiser(organiser, { through: { confirmed: true }});
  game = await getGame(game.id);
  return game;
}

checkOrganiserStatus = async (gameId, userId) => {
  let game = await Game.findOne({
    attributes: ["id",],
    include: {model: User, 
              as: "organisers",
              attributes: ["id"]},
    where: {
      id: gameId
    }
  });
  let organiserIds = game.organisers.map( organiser => organiser.id);
  console.log(organiserIds)
  return organiserIds.includes(userId);
}

getGame = async (gameId) => {
  let game = await Game.findOne({
    attributes: [
      "id",
      "name",
      "startDate",
      "endDate",
      "place",
      "description"
    ],
    include: {
      model: User, 
      as: "organisers",
      attributes: ["id"]
    },
    where: {
      id: gameId
    }
  });
  if (game) {
    let organiserNames = [];
    for (const organiser of game.organisers) {
      organiserNames.push(await db_user.getUserName(organiser.id));
    }
    game = game.dataValues;
    game.organisers = organiserNames;
    return game;
  } else {
    return { status: 404, message: "Peliä ei löydy." }
  }
}

updateGame = async (gameId, gameData) => {
  let updated = await Game.update(
    {
      name: gameData.name, 
      startDate: gameData.startDate, 
      endDate: gameData.endDate, 
      place: gameData.place, 
      description: gameData.description
    },
    {
      where: {id: gameId},
      returning: true,
      plain: true
    }
  );
  if (updated[1].id) {
    let game = getGame(updated[1].id)
    return game
  } else {
    return { status: 404, message: "Peliä ei löydy." }
  }
}

getOrganisers = async (gameId) => {
  let game = await Game.findOne({
    where: {
      id: gameId
    }
  });
  if (game) {
    let organisers = await game.getOrganisers();
    let organiserList = [];
    for (const org of organisers) {
      let orgName = await db_user.getUserName(org.id);
      let organiser = {id: org.id, name: orgName, email: org.email};
      organiserList.push(organiser);
    }
    return organiserList;
  } else {
    return { status: 404, message: "Peliä ei löydy." };
  }
}

addOrganiser = async (gameId, organiserEmail) => {
  let newOrganiser = await db_user.getUserByEmail(organiserEmail);
  let game = await Game.findOne({
    where: {
      id: gameId
    }
  });
  if (game && newOrganiser) {
    if (await checkOrganiserStatus(game.id, newOrganiser.id)) {
      return { status: 403, message: "Käyttäjä on jo pelin järjestäjä." };
    } else {
      await game.addOrganiser(newOrganiser, { through: { confirmed: false }});
      let organiserList = await getOrganisers(gameId);
      return organiserList;
    }
  } else {
    return { status: 404, message: "Peliä ei löydy." };
  }
}

removeOrganiser = async (gameId, organiserId) => {
  let game = await Game.findOne({
    where: {
      id: gameId
    }
  });
  console.log(game)
  if (!game) {
    return { status: 404, message: "Peliä ei löydy." };
  } 
  let oldOrganiser = await db_user.getUserById(organiserId);
  if (!oldOrganiser) {
    return { status: 404, message: "Käyttäjää ei löydy." };
  } else if (await checkOrganiserStatus(organiserId) === false) {
    return { status: 404, message: "Valittu käyttäjä ei ole valitun pelin järjestäjä." };
  } else {
    console.log(oldOrganiser)
    await game.removeOrganiser(oldOrganiser);
    let organiserList = await this.getOrganisers(gameId);
    console.log(organiserList)
    return organiserList;
  }
}

const db_game = {
  createGame, checkOrganiserStatus, getGame, updateGame, getOrganisers, addOrganiser, removeOrganiser
};

module.exports = db_game;