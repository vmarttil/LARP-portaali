const db = require("../models");
const config = require("../config/auth.config");
const db_user = require("../db/db_user");
const User = db.user;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  // Save the user to the database
  try {
    let user = await db_user.createUser(req.body)
    console.log("Here we should have the user in the controller:")
    console.log(user)
    if (user.id) {
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
    let user = await db_user.getUser(req.body.email)
    console.log(user)
    if (!user.id) {
      return res.status(404).send({ message: "Käyttäjätunnusta ei löydy." });
    }
    let passwordIsValid = bcrypt.compareSync(
      req.body.password,
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
    if (user.personalData.name) {
      if (user.personalData.name.nick) {
        name = user.personalData.name.first.concat(" '", user.personalData.name.nick, "' ", user.personal.name.last);
      } else {
        name = user.personalData.name.first.concat(" ", user.personalData.name.last);
      }
    }
    // Return the user's data to the frontend
    res.status(200).send({
      id: user.id,
      email: user.email,
      name: name,
      personalData: user.personalData,
      profileData: user.profileData,
      admin: user.admin,
      accessToken: token
    });
  } catch(err) {
      res.status(500).send({ message: err.message });
    };
};