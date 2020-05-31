const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  // Tallennetaan käyttäjä tietokantaan
  try {
    let user = await User.create({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
      profileData: {}
    });
    if (req.body.roles) {
      let roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles
          }
        }
      });
      await user.setRoles(roles);
      res.send({ message: "Käyttäjätunnuksen luominen onnistui." });
    } else {
      // käyttäjän rooli = 1
      await user.setRoles([1]); 
      res.send({ message: "Käyttäjätunnuksen luominen onnistui." });  
    }
  } catch(err) {
      res.status(500).send({ message: err.message });
  };
};

exports.signin = async (req, res) => {
  try {
    let user = await User.findOne({
      where: {
        username: req.body.username
      }
    })
    if (!user) {
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

    let authorities = [];
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        authorities.push("ROLE_" + roles[i].name.toUpperCase());
      }
      console.log(user.profileData)
      res.status(200).send({
        id: user.id,
        username: user.username,
        profileData: db.Sequelize.fn('AES_DECRYPT', user.profileData, process.env.DB_ENC_KEY),
        //profileData: user.profileData,
        roles: authorities,
        accessToken: token
      });
    });
  } catch(err) {
      res.status(500).send({ message: err.message });
    };
};