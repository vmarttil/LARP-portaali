const db = require("../models");

// Portaalien sisällöt
exports.allAccess = (req, res) => {
  res.status(200).send("Kaikille avoin sisältö.");
};

exports.playerPortal = (req, res) => {
  res.status(200).send("Pelaajille avoin sisältö.");
};

exports.adminPortal = (req, res) => {
  res.status(200).send("Ylläpitäjille avoin sisältö.");
};

exports.organiserPortal = (req, res) => {
  res.status(200).send("Järjestäjille avoin sisältö.");
};

// Profiilien hallinta
exports.updateProfile = async (req, res) => {
  try {
    let user = await User.findOne({
      where: {
        username: req.body.username
      }
    })
    if (!user) {
      return res.status(404).send({ message: "Käyttäjätunnusta ei löydy." });
    }
    await user.update({
      // profileData: req.body.profileData
      profileData: db.Sequelize.fn('AES_ENCRYPT', req.body.profileData, process.env.DB_ENC_KEY)
    })
    if (req.body.roles) {
      let roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles
          }
        }
      });
      await user.setRoles(roles);
    }
    res.status(200).send({ message: "Profiili päivitetty." });
  } catch(err) {
    res.status(500).send({ message: err.message });
  };
};