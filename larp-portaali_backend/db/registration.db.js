require('dotenv').config()
var bcrypt = require("bcryptjs");
const db = require("./index.js");
const queries = require("./registration.queries.js")
const Game = require("./game.db.js")
const Form = require("./form.db.js")
const Question = require("./question.db.js")

submitRegistration = async (personId, registrationData) => {
  let { rowCount } = await db.query(queries.createRegistration, [registrationData.form_id, personId]);
  let formId = registrationData.form_id;
  if (rowCount == 1) {
    console.log("Registration saved")
    for (answer of registrationData.answers) {
      console.log(answer)
      if (answer.hasOwnProperty("options")) {
        console.log("Answer has options")
        await db.query(queries.insertAnswer, [personId, formId, answer.question_id, null]);
        for (option of answer.options) {
          await db.query(queries.insertAnswerOption, [personId, formId, answer.question_id, option]);
        }
      } else {
        console.log("Answer does not have options")
        await db.query(queries.insertAnswer, [personId, formId, answer.question_id, answer.answer_text]);
      }
    }
    return true;
  } else {
    return false;
  }
};

getRegistration = async (personId, formId) => {
  let { rows } = await db.query(queries.getRegistration, [personId, formId]);
  if (rows.length > 0) {
    let submitted = rows[0].submitted;
    let { rows } = await db.query(queries.getAnswers, [personId, formId]);
    if (rows.length > 0) {
      let answerObject = {};
      for (answer of rows) {
        if (answer.answer_text == null) {
          if (answerObject.hasOwnProperty(answer.question_id)) {
            answerObject[answer.question_id] = [...answerObject[answer.question_id], {option_number: answer.option_number, option_text: answer.option_text}];
          } else {
            answerObject[answer.question_id] = [{option_number: answer.option_number, option_text: answer.option_text}];
          }
        } else {
          answerObject[answer.question_id] = answer.answer_text;
        }
      }
      let answerList = [];
        for (const [question_id, answerContent] of Object.entries(answerObject)) {
          let answer = null;
          if (Array.isArray(answerContent)) {
            answer = {question_id: question_id, options: answerContent};
          } else {
            answer = {question_id: question_id, answer_text: answerContent};
        }
        answerList.push(answer);
      }
    let registration = {
      person_id: personId,
      form_id: formId,
      submitted: submitted,
      answers: answerList
    };
    return registration;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

checkOrganiserStatus = async (formId, personId, userId) => {
  let { rows } = await db.query(queries.checkOrganiserStatus, [formId, personId, userId]);
  return rows.length > 0;
};

module.exports = {
  submitRegistration,
  getRegistration,
  checkOrganiserStatus
};
