const createGame = `
  INSERT INTO game (name, start_date, end_date, place, price, description)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
`
const getGame = `
  SELECT *
  FROM game
  WHERE id = $1;
`
const getFutureGames = `
  SELECT 
    g.id, 
    g.name, 
    g.start_date, 
    g.end_date, 
    g.place, 
    g.price, 
    g.description,
    CASE 
      WHEN ((SELECT COUNT(*) FROM form AS f WHERE f.game_id = g.id AND is_open = true) > 0)
      THEN true
      ELSE false
    END AS is_open
  FROM game AS g
  WHERE g.start_date > NOW()
  ORDER BY g.start_date ASC;
`
const getOrganiserGames = `
  SELECT 
    g.id, 
    g.name, 
    g.start_date, 
    g.end_date, 
    g.place, 
    g.price, 
    g.description
  FROM game AS g
  JOIN game_organiser AS go ON g.id = go.game_id
  WHERE go.person_id = $1
  ORDER BY start_date ASC;
`
const updateGame = `
  UPDATE game 
  SET name = $2, start_date = $3, end_date = $4, place = $5, price = $6, description = $7
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
const getGameForms = `
  SELECT 
    f.id, 
    f.name, 
    f.description, 
    f.is_open,
    fc.name AS form_class,
    fc.button_text,
    CAST(COUNT(r.person_id) AS int) AS registrations
  FROM form AS f
  JOIN form_class AS fc
    ON f.form_class_id = fc.id
  LEFT JOIN registration AS r
    ON f.id = r.form_id
  WHERE f.game_id = $1
  GROUP BY f.id, f.name, f.description, f.is_open, fc.name, fc.button_text
  ORDER BY f.form_class_id, f.id;
`
const getGameRegistrations = `
  SELECT 
    r.form_id,
    fc.name AS form_class,
    r.person_id,
    r.submitted
  FROM registration AS r
  JOIN form AS f ON r.form_id = f.id
  JOIN form_class AS fc ON f.form_class_id = fc.id
  WHERE f.game_id = $1;
`

module.exports = {
  createGame,
  getGame,
  getFutureGames,
  getOrganiserGames,
  updateGame,
  checkOrganiserStatus,
  getOrganisers,
  addOrganiser,
  removeOrganiser,
  getGameForms,
  getGameRegistrations
};