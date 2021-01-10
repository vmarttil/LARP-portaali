const db = require("../models");
const config = require("../config/auth.config");
const database = require("../middlewares/database");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  // Save the user to the database
  try {
    let personalData = JSON.stringify({
    });
    let profileData = JSON.stringify({
    });
    let user = await User.create({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      personalData: db.Sequelize.fn('PGP_SYM_ENCRYPT', personalData, process.env.DB_ENC_KEY),
      profileData: db.Sequelize.fn('PGP_SYM_ENCRYPT', profileData, process.env.DB_ENC_KEY),
      admin: req.body.admin
    });
    res.send({ message: "Käyttäjätunnuksen luominen onnistui." });  
  } catch(err) {
      res.status(500).send({ message: err.message });
  };
};

exports.signin = async (req, res) => {
  try {
    let user = await database.getUser(req.body.email)
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
      accessToken: token
    });
  } catch(err) {
      res.status(500).send({ message: err.message });
    };
};