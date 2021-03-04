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
  INSERT INTO person (email, password, personal_data, profile_data, admin)
  VALUES (
    $1, 
    $2, 
    PGP_SYM_ENCRYPT($3, $6),
    PGP_SYM_ENCRYPT($4, $6),
    $5
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
const findPersonByEmail = `
  SELECT 
    id, 
    CAST(PGP_SYM_DECRYPT(personal_data, $2) AS json) AS personal_data,
  FROM person
  WHERE email = $1;
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
  findPersonByEmail
};