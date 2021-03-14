const Person = require("../db/person.db");

exports.getProfile = async (req, res) => {
  let userId = req.userId;
  try {
    let person = await Person.getByEmail(req.body.data.email);
    if (person && person.id === userId) {
      res.status(200).send({ person: person });
    } else {
      res.status(404).send({ message: "Henkilöä ei löydy." });
    }
  } catch(err) {
    res.status(500).send({ message: err.message });
  }
}

exports.updateProfile = async (req, res) => {
  let profileData = req.body.data;
  if (profileData.id === req.userId) {
    let result = null;
    let updated = null;
    try {
      if (profileData.hasOwnProperty('email') && profileData.hasOwnProperty('password')) {
        result = await Person.updateLoginData(profileData);
        updated = "sähköposti ja salasana";
      } else if (profileData.hasOwnProperty('personal_data')) {
        result = await Person.updatePersonalData(profileData);
        updated = "henkilötiedot";
      } else if (profileData.hasOwnProperty('profile_data')) {
        result = await Person.updateProfileData(profileData);
        updated = "profiilitiedot";
      } else if (profileData.hasOwnProperty('admin')) {
        result = await Person.updateAdminData(profileData);
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

exports.findPerson = async (req, res) => {
  try {
    let personId = await Person.getIdByEmail(req.body.data.email);
    console.log(personId)
    if (personId) {
      let personName = await Person.getName(personId);
      let personObject = {id: personId, name: personName};
      res.status(200).send({ person: personObject });
    } else {
      res.status(404).send({ message: "Henkilöä ei löydy." });
    }
  } catch(err) {
    res.status(500).send({ message: err.message });
  }
}

exports.getPersonRegistrations = async (req, res) => {
  // Return a list of the user's registrations with person, form and game ids, game and form names and submission times
    try {
      let games = await Person.getPersonRegistrations(req.userId);
      if (games.length > 0) {
        res.status(200).send({ games: games });
      } else {
        res.status(404).send({ message: "Ei ilmoittautumisia." });
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
}

exports.checkPersonRegistrations = async (req, res) => {
  // Takes an array of form IDs and returns an object with the IDs as keys and booleans as values, indicating whether 
  // the person has a registration on the form
    try {
      let registrations = await Person.checkPersonRegistrations(req.userId, req.body.data.form_id_list); 
      res.status(200).send({ registrations });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
}