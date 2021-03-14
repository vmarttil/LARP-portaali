const checkAdminStatus = `
  SELECT admin 
  FROM person
  WHERE id = $1;
  `
const checkEmail = `
  SELECT email 
  FROM person
  WHERE email = $1;
  `
const createPerson = `
  INSERT INTO person (email, password, personal_data, profile_data)
  VALUES (
    $1, 
    $2, 
    PGP_SYM_ENCRYPT($3, $5),
    PGP_SYM_ENCRYPT($4, $5)
  ) 
  RETURNING id;
`
const getPersonByEmail = `
  SELECT 
    id, 
    email, 
    password, 
    CAST(PGP_SYM_DECRYPT(personal_data, $2) AS json) AS personal_data,
    CAST(PGP_SYM_DECRYPT(profile_data, $2) AS json) AS profile_data,
    admin
  FROM person
  WHERE email = $1;
`
const getPersonById = `
  SELECT 
    id, 
    email, 
    password, 
    CAST(PGP_SYM_DECRYPT(personal_data, $2) AS json) AS personal_data,
    CAST(PGP_SYM_DECRYPT(profile_data, $2) AS json) AS profile_data,
    admin
  FROM person
  WHERE id = $1;
`
const updateLoginData = `
  UPDATE person 
  SET email = $2, password = $3 
  WHERE id = $1;
`
const updatePersonalData = `
  UPDATE person 
  SET personal_data = PGP_SYM_ENCRYPT($2, $3) 
  WHERE id = $1;
`
const updateProfileData = `
  UPDATE person 
  SET profile_data = PGP_SYM_ENCRYPT($2, $3) 
  WHERE id = $1;
`
const updateAdminData = `
  UPDATE person 
  SET admin = $2 
  WHERE id = $1;
`
const getIdByEmail = `
  SELECT 
    id
  FROM person
  WHERE email = $1;
`
const getPersonRegistrations = `
  SELECT 
    r.person_id,
    f.id AS form_id,
    fc.name AS form_class,
    g.id AS game_id,
    g.name AS game_name,
    g.start_date,
    g.end_date,
    g.place,
    g.price,
    g.description,
    r.submitted
  FROM registration AS r
  JOIN form AS f ON r.form_id = f.id
  JOIN game AS g ON f.game_id = g.id
  JOIN form_class AS fc ON f.form_class_id = fc.id
  WHERE r.person_id = $1;
`
const getRegisteredForms = ` 
  SELECT
    form_id
  FROM registration
  WHERE person_id = $1;
`

module.exports = {
  checkAdminStatus,
  checkEmail,
  createPerson,
  getPersonByEmail,
  getPersonById,
  updateLoginData,
  updatePersonalData,
  updateProfileData,
  updateAdminData,
  getIdByEmail,
  getPersonRegistrations,
  getRegisteredForms
};