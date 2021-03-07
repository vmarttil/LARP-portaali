const logger = require("../utils/logger");
const Question = require("../db/question.db");
const Form = require("../db/form.db");
const Game = require("../db/game.db");
const Person = require("../db/person.db");


// Ilmoittautumislomakkeiden hallinta


exports.createForm = async (req, res) => {
  // Check whether the user is an organiser of the game for which the form is being created
  if (await Game.checkOrganiserStatus(req.body.data.game_id, req.userId)) {
    // Save the new form to the database and populate it with the default questions
    try {
      let form = await Form.createForm(req.body.data);
      let available = await Question.getAvailableQuestions(req.UserId); 
      if (form.id) {
        res.status(201).send({ form: form, available_questions: available });
      } else {
        res.status(500).send({ message: "Uuden lomakkeen luominen ei onnistunut." });
      }
    } catch(err) {
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
  } catch(err) {
    res.status(500).send({ message: err.message });
  }
}

exports.editForm = async (req, res) => {
  // Return the form for editing with its associated array of questions and a list of all questions available for the user
  // Check whether the form is open and whether there are answers for it
  // if (await Form.isOpen(req.params.form_id) === false && await Form.countRegistrations(req.params.form_id) === 0) {
    try {
      let form = await Form.editForm(req.params.form_id);
      let available = await Question.getAvailableQuestions(req.userId); 
      if (form) {
        res.status(200).send({ form: form, available_questions: available });
      } else {
        res.status(404).send({ message: "Lomaketta ei löytynyt." });
      }
    } catch(err) {
      res.status(500).send({ message: err.message });
    }
  // } else {
  //   res.status(403).send({ message: "Lomaketta ei voi muokata, koska ilmoittautuminen on auki tai peliin on jo ilmoittautumisia." });
  // }
}

exports.updateForm = async (req, res) => {
  // Checks whether the logged in user is an organiser of the game
  if (await Game.checkOrganiserStatus(req.body.data.game_id, req.userId)) {
    // Updates the content and structure of the form
    try {
      let result = await Form.updateForm(req.params.form_id, req.body.data);
      if (result) {
        res.status(200).send({ message: "Lomakkeen tiedot päivitetty." });
      } else {
        res.status(404).send({ message: "Lomaketta ei löytynyt." });
      }
    } catch(err) {
      res.status(500).send({ message: err.message });
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
  } catch(err) {
    res.status(500).send({ message: err.message });
  }
}

exports.createQuestion = async (req, res) => {
  // Check whether the user is an organiser of the game for which the question is being created
  if (await Game.checkOrganiserStatus(req.body.data.game_id, req.userId)) {
    // Save the new question to the database and associate it with the current form
    try {
      let question = await Question.createQuestion(req.body.data);
      if (question.id) {
        res.status(201).send({ message: "Uuden kysymyksen luonti onnistui.", question: question});
      } else {
        res.status(500).send({ message: "Uuden kysymyksen luominen ei onnistunut." });
      }
    } catch(err) {
      res.status(500).send({ message: err.message });
    }
  } else {
    res.status(403).send({ message: "Et ole kyseisen pelin järjestäjä." });
  }
}

exports.updateQuestion = async (req, res) => {
  // Check whether the user is an organiser of the game for which the question is being edited
  if (await Game.checkOrganiserStatus(req.body.data.game_id, req.userId)) {
    try {  
      let question = null;
      // Check if the current form is open or used in another form
      if (await Form.isOpen(req.body.data.form_id) || await Question.countForms(req.body.data.question_id) > 1) {
        // Create a copy of the question
        question = await Question.createQuestion(req.body.data.question_data);
      } else {
        // Update the existing question
        question = await Question.updateQuestion(req.body.data.question_id, req.body.data.question_data);
      }
      if (question.id) {
        res.status(201).send({ message: "Kysymys päivitetty.", question: question});
      } else {
        res.status(500).send({ message: "Kysymyksen päivitys ei onnistunut." });
      } 
    } catch(err) {
      res.status(500).send({ message: err.message });
    }
  } else {
    res.status(403).send({ message: "Et ole kyseisen pelin järjestäjä." });
  }
}

