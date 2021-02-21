const config = require("../config/auth.config");
const Person = require("../db/person.db");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  // Save the user as a person to the database
  try {
    let userId = await Person.create(req.body.data)
    if (userId) {
      res.status(201).send({ message: "Käyttäjätunnuksen luominen onnistui." });
    } else {
      res.status(500).send({ message: "Käyttäjätunnuksen luominen epäonnistui." });
    }
  } catch(err) {
      res.status(500).send({ message: err.message });
  };
};

exports.signin = async (req, res) => {
  try {
    let user = await Person.getByEmail(req.body.data.email)
    if (!user) {
      return res.status(404).send({ 
        message: "Käyttäjätunnusta ei löydy." 
      });
    }
    let passwordIsValid = bcrypt.compareSync(
      req.body.data.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Väärä salasana."
      });
    }

    let token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400 // 24 tuntia
    });

    // If the user has a name defined, use it instead of the email
    let name = user.email;
    if (user.personal_data.first_name && user.personal_data.last_name) {
      if (user.personal_data.nickname) {
        name = user.personal_data.first_name.concat(" '", user.personal_data.nickname, "' ", user.personal_data.last_name);
      } else {
        name = user.personal_data.first_name.concat(" ", user.personal_data.last_name);
      }
    }
    // Return the user's data to the frontend
    res.status(200).send({
        id: user.id,
        email: user.email,
        name: name,
        personal_data: user.personal_data,
        profile_data: user.profile_data,
        admin: user.admin,
        accessToken: token
    });
  } catch(err) {
      res.status(500).send({ message: err.message });
  };
};