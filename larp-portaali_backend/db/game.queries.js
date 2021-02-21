const createGame = `
  INSERT INTO game (name, start_date, end_date, place, description)
    VALUES ($1, $2, $3, $4, $5) RETURNING *;
`
const getGame = `
  SELECT *
  FROM game
  WHERE id = $1;
`
const updateGame = `
  UPDATE game 
  SET name = $2, start_date = $3, end_date = $4, place = $5, description = $6
  WHERE id = $1
  RETURNING id;
`
const checkOrganiserStatus = `
  SELECT * 
  FROM game_organiser 
  WHERE game_id = $1 AND person_id = $2;
`
const getOrganisers = `
  SELECT 
    p.id
  FROM game AS g
    JOIN game_organiser AS go ON g.id = go.game_id
    JOIN person AS p ON go.person_id = p.id
  WHERE g.id = $1;
`
const addOrganiser = `
  INSERT INTO game_organiser (game_id, person_id)
    VALUES ($1, $2);
`
const removeOrganiser = `
  DELETE 
  FROM game_organiser 
  WHERE game_id = $1 AND person_id = $2; 
`

module.exports = {
  createGame,
  getGame,
  updateGame,
  checkOrganiserStatus,
  getOrganisers,
  addOrganiser,
  removeOrganiser
};