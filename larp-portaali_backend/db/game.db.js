const db = require("./index.js");
const queries = require("./game.queries.js")
const Person = require("./person.db.js")


createGame = async (organiserId, gameData) => {
  let parameters = [
    gameData.name,
    gameData.start_date,
    gameData.end_date,
    gameData.place,
    gameData.price,
    gameData.description
  ];
  let { rows } = await db.query(queries.createGame, parameters);
  if (rows.length > 0) {
    let game = rows[0];
    await addOrganiser(game.id, organiserId);
    game.organisers = await getOrganisers(game.id);
    return game;
  } else {
    return null;
  }
};

getGame = async (gameId) => {
  let { rows } = await db.query(queries.getGame, [gameId]);
  if (rows.length > 0) {
    let game = rows[0];
    game.organisers = await getOrganisers(gameId);
    game.forms = await getGameForms(gameId);
    return game;
  } else {
    return null;
  }
};

updateGame = async (gameId, gameData) => {
  let parameters = [
    gameId,
    gameData.name,
    gameData.start_date,
    gameData.end_date,
    gameData.place,
    gameData.price,
    gameData.description
  ];
  let { rows } = await db.query(queries.updateGame, parameters);
  return rows.length > 0;
};

getFutureGames = async () => {
  let { rows } = await db.query(queries.getFutureGames, []);
  for (row of rows) {
    row.organisers = await getOrganisers(row.id);
    row.forms = await getGameForms(row.id);
  }
  return rows;
};

getOrganiserGames = async (organiserId) => {
  let { rows } = await db.query(queries.getOrganiserGames, [organiserId]);
  let gameList = []
  for (row of rows) {
    let game = row;
    game.organisers = await getOrganisers(game.id);
    game.forms = await getGameForms(game.id);
    gameList.push(game);
  }
  return gameList;
};

checkOrganiserStatus = async (gameId, personId) => {
  let { rows } = await db.query(queries.checkOrganiserStatus, [gameId, personId]);
  return rows.length > 0;
};

getOrganisers = async (gameId) => {
  let { rows } = await db.query(queries.getOrganisers, [gameId]);
  let organiserList = [];
  for (row of rows) {
    let name = await Person.getName(row.id);
    let organiser = {id: row.id, name: name};
    organiserList.push(organiser);
  }
  return organiserList.length > 0 ? organiserList : null;
};

addOrganiser = async (gameId, organiserId) => {
  let {rowCount} = await db.query(queries.addOrganiser, [gameId, organiserId]);  
  return rowCount > 0;
};

removeOrganiser = async (gameId, organiserId) => {
  let { rowCount } = await db.query(queries.removeOrganiser, [gameId, organiserId])
  return rowCount > 0;
};

getGameForms = async (gameId) => {
  let { rows } = await db.query(queries.getGameForms, [gameId]);
  return rows.length > 0 ? rows : null;
};

getGameRegistrations = async (gameId) => {
  let { rows } = await db.query(queries.getGameRegistrations, [gameId]);
  if (rows.length > 0) {
    registrations = [];
    for (row of rows) {
      let name = await Person.getName(row.person_id);
      let registration = {game_id: parseInt(gameId), form_id: row.form_id, form_class: row.form_class, person_id: row.person_id, name: name, submitted: row.submitted};
      registrations.push(registration);
    }
    return registrations;
  } else {
    return [];
  }
};

module.exports = {
  createGame, 
  getGame,
  updateGame,
  getFutureGames,
  getOrganiserGames,
  checkOrganiserStatus, 
  getOrganisers, 
  addOrganiser,
  removeOrganiser,
  getGameForms,
  getGameRegistrations
};
