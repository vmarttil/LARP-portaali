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