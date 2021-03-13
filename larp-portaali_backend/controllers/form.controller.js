const logger = require("../utils/logger");
const Question = require("../db/question.db");
const Form = require("../db/form.db");
const Game = require("../db/game.db");
const Person = require("../db/person.db");


exports.createForm = async (req, res) => {
  let formData = req.body.data;
  // Check whether the user is an organiser of the game for which the form is being created
  if (await Game.checkOrganiserStatus(formData.game_id, req.userId)) {
    // Save the new form to the database and populate it with the default questions
    try {
      let form = await Form.createForm(formData);
      if (form.id) {
        res.status(201).send({ form_id: form.id });
      } else {
        res.status(500).send({ message: "Uuden lomakkeen luonti ei onnistunut." });
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  } else {
    res.status(403).send({ message: "Et ole kyseisen pelin järjestäjä." });
  }
}

exports.getForm = async (req, res) => {
  // Return the form with its associated array of questions
  try {
    let form = await Form.getForm(req.params.form_id);
    if (form) {
      res.status(200).send({ form: form });
    } else {
      res.status(404).send({ message: "Lomaketta ei löytynyt." });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.editForm = async (req, res) => {
  // Return the form for editing with its associated array of questions and a list of all questions available for the user
  // Check whether the form is open and whether there are answers for it
  let userId = req.userId;
  let formId = req.params.form_id;
  if (await Form.isEditable(formId)) {
    try {
      let types = await Form.getQuestionTypes();
      let classes = await Form.getFormClasses();
      let form = await Form.getForm(formId);
      let available = await Question.getAvailableQuestions(userId, formId);
      if (form) {
        res.status(200).send({ form_classes: classes, form: form, available_questions: available, types: types });
      } else {
        res.status(404).send({ message: "Lomaketta ei löytynyt." });
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  } else {
    res.status(403).send({ message: "Lomaketta ei voi muokata, koska ilmoittautuminen on auki tai peliin on jo ilmoittautumisia." });
  }
}

exports.updateForm = async (req, res) => {
  let formId = req.params.form_id;
  let userId = req.userId;
  let formData = req.body.data;
  // Checks whether the logged in user is an organiser of the game
  if (await Game.checkOrganiserStatus(formData.game_id, userId)) {
    // Check whether the form is open and whether there are answers for it
    if (await Form.isOpen(formId) === false && await Form.countFormRegistrations(formId) === 0) {
      // Updates the content and structure of the form
      try {
        console.log(formData)
        let updatedForm = await Form.updateForm(formId, formData);
        let available = await Question.getAvailableQuestions(userId, formId);
        if (updatedForm) {
          res.status(200).send({ message: "Lomakkeen tallennus onnistui.", form: updatedForm, available_questions: available });
        } else {
          res.status(404).send({ message: "Lomakkeen tallennus ei onnistunut." });
        }
      } catch (err) {
        res.status(500).send({ message: err.message });
      }
    } else {
      res.status(403).send({ message: "Lomaketta ei voi muokata, koska ilmoittautuminen on auki tai peliin on jo ilmoittautumisia." });
    }
  } else {
    res.status(403).send({ message: "Et ole pelin järjestäjä." });
  }
}

exports.getAvailableQuestions = async (req, res) => {
  // Gets all questions available for the user
  try {
    let result = await Question.getAvailableQuestions(req.userId);
    if (result) {
      res.status(200).send({ available_questions: result });
    } else {
      res.status(404).send({ message: "Ei kysymyksiä käytettävissä." });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.getQuestion = async (req, res) => {
  // Gets a question by id
  try {
    let result = await Question.getQuestion(req.params.question_id);
    if (result) {
      res.status(200).send({ question: result });
    } else {
      res.status(404).send({ message: "Kysymystä ei löydy." });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.toggleRegistration = async (req, res) => {
  let formId = req.params.form_id;
  let userId = req.userId;
  // Checks whether the logged in user is an organiser of the game with which the form is associated
  if (await Form.checkOrganiserStatus(formId, userId)) {
    // Toggles the status of the form
    try {
      let formToggle = await Form.toggleRegistration(formId);
      if (formToggle.success == null) {
        res.status(404).send({ message: "Ilmoittautumisen ".concat(formToggle.target ? "avaaminen" : "sulkeminen", " ei onnistunut.") });
      } else if (formToggle.success) {
        res.status(200).send({ message: "Ilmoittautuminen ".concat(formToggle.target ? "avattu" : "suljettu", ".") });
      } else {
        res.status(404).send({ message: "Pelille ei voi avata useampaa saman tyyppistä ilmoittautumista." });
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  } else {
    res.status(403).send({ message: "Et ole pelin järjestäjä." });
  }
}

exports.checkStatus = async (req, res) => {
  // Checks whether the form is editable
  try {
    let formStatus = await Form.isEditable(req.params.form_id);
    res.status(200).send({ is_editable: formStatus });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.getFormRegistrations = async (req, res) => {
  let formId = req.params.form_id;
  let userId = req.userId;
  // Checks whether the logged in user is an organiser of the game associated with the form
  if (await Form.checkOrganiserStatus(formId, userId)) {
    // Return a list of the form's registrations form and person ids, submitter names and submission times
    try {
      let registrations = await Form.getFormRegistrations(formId);
      if (registrations.length > 0) {
        res.status(200).send({ registrations: registrations });
      } else {
        res.status(404).send({ message: "Ei ilmoittautumisia." });
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  }
}