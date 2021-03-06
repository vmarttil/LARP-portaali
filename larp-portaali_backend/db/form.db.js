require('dotenv').config()
var bcrypt = require("bcryptjs");
const db = require("./index.js");
const queries = require("./form.queries.js")
const Question = require("./question.db.js")
const Game = require("./game.db.js")
const Person = require("./person.db.js")


create = async (formData) => {
  let parameters = [
    formData.game_id,
    formData.name,
    formData.description
  ];
  let { rows } = await db.query(queries.createForm, parameters);
  if (rows.length > 0) {
    let form = rows[0];
    await db.query(queries.addDefaultQuestions, [formId])
    form.questions = await getFormQuestions(form.id);
    return form;
  } else {
    return null;
  }
}

get = async (formId) => {
  let { rows } = await db.query(queries.getForm, [formId]);
  if (rows.length > 0) {
    let form = rows[0];
    form.questions = await getFormQuestions(formId);
    return form;
  } else {
    return null;
  }
}

getFormQuestions = async (formId) => {
  let { rows } = await db.query(queries.getFormQuestions, [formId]);
  return rows.length > 0 ? rows : null;
}

update = async (formId, formData) => {
  let parameters = [
    formId, 
    formData.name,
    formData.description
    ]
  await db.query(queries.updateFormData, parameters);
  
  let oldQuestions = getFormQuestions(formId);
  let newQuestions = formData.questions;
  for (question of newQuestions) {
    if (!oldQuestions.map(q => q.id).includes(question.id)) {
      // Add the new question
      await db.query(queries.addQuestion, [formId, question.question_id, question.position]);
    } else {
      if (oldQuestions.find(q => q.id === question.id).position !== question.position) {
        // Update the position of the existing question and remove it from the list of old questions
        await db.query(queries.updateQuestionPosition, [formId, question.question_id, question.position]);
        oldQuestions = oldQuestions.filter(q => q.id !== question.id);
      } else {
        // Just remove the question from the list of old questions
        oldQuestions = oldQuestions.filter(q => q.id !== question.id);
      }
    }
  }
  // Finally remove the old questions that were no longer in the new questions
  for (question of oldQuestions) {
    await db.query(queries.removeQuestion, [formId, question.question_id]);
    // If they are no longer used anywhere, remove them from the database
    if (await Question.countForms(question.question_id) === 0) {
      await db.query(queries.deleteQuestion, [question.question_id])
    }
  }
  return await get(formId);
}

isOpen = async (formId) => {
  let { rows } = await db.query(queries.isOpen, [formId]);
  return rows[0].is_open;
}

toggleRegistration = async (formId) => {
  let { rows } = await db.query(queries.toggleRegistration, [formId]);
  return rows.length > 0 ? rows[0].is_open : null;
}


module.exports = {
  create, 
  get,
  getFormQuestions,
  update,
  isOpen,
  toggleRegistration
};
