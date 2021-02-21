const logger = require("../utils/logger");
const Person = require("../db/person.db");

var jwt = require("jsonwebtoken");

// Profiilien hallinta

exports.getProfile = async (req, res) => {
  try {
    let user = await Person.getByEmail(req.body.email);
    if (user && user.id === req.userId) {
      res.status(200).send({ data: user });
    } else {
      res.status(404).send({ message: "Henkilöä ei löydy." });
    }
  } catch(err) {
    res.status(500).send({ message: err.message });
  }
}

exports.updateProfile = async (req, res) => {
  if (req.body.id === req.userId) {
    let result = null;
    let updated = null;
    try {
      if (req.body.hasOwnProperty('email') && req.body.hasOwnProperty('password')) {
        result = await Person.updateLoginData(req.body);
        updated = "sähköposti ja salasana";
      } else if (req.body.hasOwnProperty('personal_data')) {
        result = await Person.updatePersonalData(req.body);
        updated = "henkilötiedot";
      } else if (req.body.hasOwnProperty('profile_data')) {
        result = await Person.updateProfileData(req.body);
        updated = "profiilitiedot";
      } else if (req.body.hasOwnProperty('admin')) {
        result = await Person.updateAdminData(req.body);
        updated = "käyttöoikeus";
      }
      result ? res.status(200).send( {message: "Henkilön " + updated + " päivitetty."} ) : res.status(404).send( {message: "Henkilöä ei löydy."} );
    } catch(err) {
      res.status(500).send({ message: err.message });
    };
  } else {
    res.status(401).send({ message: "Väärä henkilö." });
  }
}