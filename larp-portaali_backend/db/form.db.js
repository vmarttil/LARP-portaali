require('dotenv').config()
var bcrypt = require("bcryptjs");
const db = require("./index.js");
const queries = require("./form.queries.js")
const Question = require("./question.db.js")


createForm = async (formData) => {
  let parameters = [
    formData.game_id,
    formData.name,
    formData.description
  ];
  let { rows } = await db.query(queries.createForm, parameters);
  if (rows.length > 0) {
    let form = rows[0];
    await db.query(queries.addDefaultQuestions, [form.id])
    form.questions = await getFormQuestionList(form.id);
    return form;
  } else {
    return null;
  }
}

editForm = async (formId) => {
  let { rows } = await db.query(queries.getForm, [formId]);
  if (rows.length > 0) {
    let form = rows[0];
    form.questions = await getFormQuestionList(formId);
    return form;
  } else {
    return null;
  }
}

getFormQuestionList = async (formId) => {
  let { rows } = await db.query(queries.getFormQuestionList, [formId]);
  return rows.length > 0 ? rows : null;
}

getForm = async (formId) => {
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
  if (rows.length > 0) {
    let questions = [];
    for (row of rows) {
      if (row.type === "radio" || row.type === "checkbox") {
        row.options = await getQuestionOptions(row.id);
      }
      questions.push(row);
    }
    return questions
  } else {
    return null;
  }
}

updateForm = async (formId, formData) => {
  let parameters = [
    formId, 
    formData.name,
    formData.description
    ]
  await db.query(queries.updateFormData, parameters);
  
  let oldQuestions = await getFormQuestions(formId);
  let newQuestions = formData.questions;
  for (question of newQuestions) {
    if (!oldQuestions.map(q => q.question_id).includes(question.question_id)) {
      // Add the new question
      await db.query(queries.addQuestion, [formId, question.question_id, question.position]);
    } else {
      if (oldQuestions.find(q => q.question_id === question.question_id).position !== question.position) {
        // Update the position of the existing question and remove it from the list of old questions
        await db.query(queries.updateQuestionPosition, [formId, question.question_id, question.position]);
        oldQuestions = oldQuestions.filter(q => q.question_id !== question._question_id);
      } else {
        // Just remove the question from the list of old questions
        oldQuestions = oldQuestions.filter(q => q.question_id !== question.question_id);
      }
    }
  }
  // Finally remove the old questions that were no longer in the new questions
  for (question of oldQuestions) {
    await db.query(queries.removeQuestion, [formId, question.question_id]);
    // If they are no longer used anywhere, remove them from the database
    console.log("Form count: ", await Question.countForms(question.question_id))
    if (await Question.countForms(question.question_id) === 0) {
      await db.query(queries.deleteQuestion, [question.question_id])
    }
  }
  return await getForm(formId);
}

isOpen = async (formId) => {
  let { rows } = await db.query(queries.isOpen, [formId]);
  return rows[0].is_open;
}

toggleRegistration = async (formId) => {
  let { rows } = await db.query(queries.toggleRegistration, [formId]);
  return rows.length > 0 ? rows[0].is_open : null;
}

countRegistrations = async (formId) => {
  // To be implemented with registrations
  return 0;
}

module.exports = {
  createForm, 
  editForm,
  getForm,
  getFormQuestions,
  updateForm,
  isOpen,
  toggleRegistration,
  countRegistrations
};
