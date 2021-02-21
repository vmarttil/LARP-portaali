require('dotenv').config()
var bcrypt = require("bcryptjs");
const db = require("./index");
const queries = require("./person.queries")

create = async (userData) => {
  let personal_data = JSON.stringify({});
  let profile_data = JSON.stringify({});
  parameters = [
    userData.email,
    bcrypt.hashSync(userData.password, 8),
    personal_data,
    profile_data,
    userData.admin,
    process.env.DB_ENC_KEY
  ];
  let { rows } = await db.query(queries.createPerson, parameters);
  if (rows[0].id) {
    return rows[0].id;
  } else {
    return null;
  }
}

getByEmail = async (email) => {
  let { rows } = await db.query(queries.getPersonByEmail, [email, process.env.DB_ENC_KEY]);
  let person = rows.length > 0 ? rows[0] : null;
  return person;
}

getById = async (id) => {
  let { rows } = await db.query(queries.getPersonById, [id, process.env.DB_ENC_KEY]);
  let person = rows.length > 0 ? rows[0] : null;
  return person;
}

updateLoginData = async ( {id, email, password} ) => {
  let { rowCount } = await db.query(queries.updateLoginData, [id, email, bcrypt.hashSync(password, 8)]);
  return rowCount > 0;  
}

updatePersonalData = async ( {id, personal_data} ) => {
  let { rowCount } = await db.query(queries.updatePersonalData, [id, personal_data, process.env.DB_ENC_KEY]);
  return rowCount > 0;  
}
  
updateProfileData = async ( {id, profile_data} ) => {
  let { rowCount } = await db.query(queries.updateProfileData, [id, profile_data, process.env.DB_ENC_KEY]);
  return rowCount > 0;  
}

updateAdminData = async ( {id, admin} ) => {
  let { rowCount } = await db.query(queries.updateAdminData, [id, admin]);
  return rowCount > 0;  
}

getName = async (personId) => {
  let person = await getById(personId);
  let name = person.email;
  if (person.personal_data.first_name && person.personal_data.last_name) {
    name = person.personal_data.nickname !== '' ? person.personal_data.first_name + " '" + person.personal_data.nickname + "' " + person.personal_data.last_name : person.personal_data.first_name + " " + person.personal_data.last_name;
  }
  return name;
}

module.exports = {
  create, 
  getByEmail, 
  getById, 
  updateLoginData, 
  updatePersonalData, 
  updateProfileData, 
  updateAdminData, 
  getName
};