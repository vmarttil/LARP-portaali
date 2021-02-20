require('dotenv').config()
var bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.user;


createUser = async (userData) => {
  let personalData = JSON.stringify({});
  let profileData = JSON.stringify({});
  let user = await User.create({
    email: userData.email,
    password: bcrypt.hashSync(userData.password, 8),
    personalData: db.Sequelize.fn('PGP_SYM_ENCRYPT', personalData, process.env.DB_ENC_KEY),
    profileData: db.Sequelize.fn('PGP_SYM_ENCRYPT', profileData, process.env.DB_ENC_KEY),
    admin: userData.admin
  });
  return user.dataValues;
}

getUserName = async (userId) => {
  let user = await User.findOne({
    attributes: [
      "id",
      [
        db.Sequelize.cast(
          db.Sequelize.fn(
            'PGP_SYM_DECRYPT',
            db.Sequelize.cast(db.Sequelize.col("personalData"), "bytea"), 
            process.env.DB_ENC_KEY
          ), 
          "json"), 
        "personalData"
      ]
    ],
    where: {
      id: userId
    }
  });
  let userName = user.personalData.nickname !== '' ? user.personalData.first_name + " '" + user.personalData.nickname + "' " + user.personalData.last_name : user.personalData.first_name + " " + user.personalData.last_name;
  return userName;
}

getUserById = async (userId) => {
  let user = await User.findOne({
    where: {
      id: userId
    }
  });
  return user;
}

getUserByEmail = async (email) => {
  let user = await User.findOne({
    where: {
      email: email
    }
  });
  return user;
}

getUserDataByEmail = async (userEmail) => {
  let user = await User.findOne({
    attributes: [
      "id",
      "email",
      "password",
      [
        db.Sequelize.cast(
          db.Sequelize.fn(
            'PGP_SYM_DECRYPT',
            db.Sequelize.cast(db.Sequelize.col("personalData"), "bytea"), 
            process.env.DB_ENC_KEY
          ), 
          "json"), 
        "personalData"
      ],
      [
        db.Sequelize.cast(
          db.Sequelize.fn(
            'PGP_SYM_DECRYPT',
            db.Sequelize.cast(db.Sequelize.col("profileData"), "bytea"), 
            process.env.DB_ENC_KEY
          ), 
          "json"), 
        "profileData"
      ],
      "admin"
    ],
    where: {
      email: userEmail
    }
  });
  return user ? user.dataValues : null;
}

updateProfile = async (userData) => {
  let returnValue = { status: 404, message: "Käyttäjää ei löydy."};
  
  if (userData.hasOwnProperty('personalData')) {
    let updated = await User.update(
      {personalData: db.Sequelize.fn('PGP_SYM_ENCRYPT', JSON.stringify(userData.personalData), process.env.DB_ENC_KEY)},
      {where: {id: userData.id}}
    );
    returnValue = updated > 0 ? { status: 200, message: "Käyttäjän henkilötiedot päivitetty." } : { status: 404, message: "Käyttäjää ei löydy."};
  } else if (userData.hasOwnProperty('profileData')) {
    let updated = await User.update(
      {profileData: db.Sequelize.fn('PGP_SYM_ENCRYPT', JSON.stringify(userData.profileData), process.env.DB_ENC_KEY)},
      {where: {id: userData.id}}
    );
    returnValue = updated > 0 ? { status: 200, message: "Käyttäjän profiilitiedot päivitetty." } : { status: 404, message: "Käyttäjää ei löydy."};
  } else if (userData.hasOwnProperty('admin')) {
    let updated = await User.update(
      {admin: userData.admin},
      {where: {id: userData.id}}
    );
    returnValue = updated > 0 ? { status: 200, message: "Käyttäjän käyttöoikeus päivitetty." } : { status: 404, message: "Käyttäjää ei löydy."};
  } else if (userData.hasOwnProperty('email') && userData.hasOwnProperty('password')) {
    let updated = await User.update(
      {email: userData.email, password: bcrypt.hashSync(userData.password, 8)},
      {where: {id: userData.id}}
    );
    returnValue = updated > 0 ? { status: 200, message: "Käyttäjän sähköposti ja salasana päivitetty." } : { status: 404, message: "Käyttäjää ei löydy."};
  } 

  return returnValue
}

const db_user = {
  createUser, getUserName, getUserById, getUserByEmail, getUserDataByEmail, updateProfile
};

module.exports = db_user;