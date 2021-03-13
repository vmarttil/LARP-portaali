const Registration = require("../db/registration.db")
const Form = require("../db/form.db");


exports.submitRegistration = async (req, res) => {
  let userId = req.userId;
  let registrationData = req.body.data;
  try {
    // Check that the form that the registration is submitted is open
    if (await Form.isOpen(req.body.data.form_id)) {
      // Save the registration
      try {
        console.log(registrationData);
        let result = await Registration.submitRegistration(userId, registrationData);
        if (result) {
          res.status(200).send({ message: "Ilmoittautuminen tallennettu." });
        } else {
          if (Registration.getRegistration(registrationData.form_id, userId)) {
            res.status(500).send({ message: "Ilmoittautumisen lähetys ei onnistunut, koska olet jo ilmoittautunut tähän peliin." });
          } else {
            res.status(500).send({ message: "Ilmoittautumisen tallennus ei onnistunut." });
          }
        }
      } catch (err) {
        res.status(500).send({ message: err.message });
      }
    } else {
      res.status(403).send({ message: "Ilmoittautumisen lähetys ei onnistunut, koska ilmoittautuminen on suljettu." });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.getRegistration = async (req, res) => {
  let userId = req.userId;
  let formId = req.params.form_id;
  let personId = req.params.person_id;
  // Check whether the user is either the person who submitted the registration or an 
  // organiser of the game with which the registration is associated
  if (req.params.person_id == userId || await Registration.checkOrganiserStatus(formId, personId, userId)) {
    // Return the registration with its associated array of answers and the corresponding form with its array of questions
    try {
      let registration = await Registration.getRegistration(personId, formId);
      let form = await Form.getForm(formId);
      if (registration & form) {
        res.status(200).send({ registration: registration, form: form });
      } else {
        res.status(404).send({ message: "Lomaketta tai ilmoittautumista ei löytynyt." });
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  } else {
    res.status(403).send({ message: "Ei tarkasteluoikeutta tähän ilmoittautumiseen." });
  }
};


