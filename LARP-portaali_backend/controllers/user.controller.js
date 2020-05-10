exports.allAccess = (req, res) => {
  res.status(200).send("Kaikille avoin sisältö.");
};

exports.playerBoard = (req, res) => {
  res.status(200).send("Pelaajille avoin sisältö.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Ylläpitäjille avoin sisältö.");
};

exports.organiserBoard = (req, res) => {
  res.status(200).send("Järjestäjille avoin sisältö.");
};