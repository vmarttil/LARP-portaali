require('dotenv').config()
var bcrypt = require("bcryptjs");
const db = require("./index");
const queries = require("./person.queries")

create = async (personData) => {
  let personal_data = JSON.stringify({});
  let profile_data = JSON.stringify({});
  parameters = [
    personData.email,
    bcrypt.hashSync(personData.password, 8),
    personal_data,
    profile_data,
    process.env.DB_ENC_KEY
  ];
  let { rows } = await db.query(queries.createPerson, parameters);
  if (rows[0].id) {
    return rows[0].id;
  } else {
    return null;
  }
};

getByEmail = async (email) => {
  let { rows } = await db.query(queries.getPersonByEmail, [email, process.env.DB_ENC_KEY]);
  let person = rows.length > 0 ? rows[0] : null;
  return person;
};

getById = async (id) => {
  let { rows } = await db.query(queries.getPersonById, [id, process.env.DB_ENC_KEY]);
  let person = rows.length > 0 ? rows[0] : null;
  return person;
};

updateLoginData = async ( {id, email, password} ) => {
  let { rowCount } = await db.query(queries.updateLoginData, [id, email, bcrypt.hashSync(password, 8)]);
  return rowCount > 0;  
};

updatePersonalData = async ( {id, personal_data} ) => {
  let { rowCount } = await db.query(queries.updatePersonalData, [id, personal_data, process.env.DB_ENC_KEY]);
  return rowCount > 0;  
};
  
updateProfileData = async ( {id, profile_data} ) => {
  let { rowCount } = await db.query(queries.updateProfileData, [id, profile_data, process.env.DB_ENC_KEY]);
  return rowCount > 0;  
};

updateAdminData = async ( {id, admin} ) => {
  let { rowCount } = await db.query(queries.updateAdminData, [id, admin]);
  return rowCount > 0;  
};

getName = async (personId) => {
  let personalData = (await getById(personId)).personal_data;
  return personalData.nickname == "" ? personalData.first_name + " " + personalData.last_name : personalData.first_name + ' "' + personalData.nickname + '" ' + personalData.last_name;
};

getPersonRegistrations = async (personId) => {
  let registrations = (await db.query(queries.getPersonRegistrations, [personId])).rows;
  if (registrations.length > 0) {
    let gameIds = [...new Set(registrations.map(r => r.game_id))]; 
    let gameList = [];
    for (r of registrations) {
      if (gameIds.includes(r.game_id)) {
        let game = {
          id: r.game_id,
          name: r.game_name,
          start_date: r.start_date,
          end_date: r.end_date,
          place: r.place,
          price: r.price,
          description: r.description
        };
        filteredRegs = [...registrations.filter(f => f.game_id == r.game_id)];
        let regList = [];
        for (reg of filteredRegs) {
          let registration = {
            form_id: reg.form_id,
            person_id: reg.person_id,
            form_class: reg.form_class,
            submitted: reg.submitted
          };
          regList.push(registration);
        }
        gameIds = gameIds.filter(g => g != r.game_id);
        game.registrations = registrations;
        gameList.push(game);
      }
    }

    return gameList;
  } else {
    return [];
  }
};


module.exports = {
  create, 
  getByEmail, 
  getById, 
  updateLoginData, 
  updatePersonalData, 
  updateProfileData, 
  updateAdminData, 
  getName,
  getPersonRegistrations
};