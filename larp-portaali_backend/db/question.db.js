require('dotenv').config()
var bcrypt = require("bcryptjs");
const db = require("./index.js");
const queries = require("./question.queries.js")


createQuestion = async (questionData) => {
  let parameters = [
    questionData.question_type,
    questionData.question_text,
    questionData.description
  ];
  let { rows } = await db.query(queries.createQuestion, parameters);
  let newQuestion = rows[0];
  let association = await db.query(queries.associateToForm, [questionData.form_id, newQuestion.question_id]);
  newQuestion.position = association.rows[0].position
  console.log(questionData)
  if (questionData.hasOwnProperty('options')) {
    for (option of questionData.options) {
      await db.query(queries.addOption, [newQuestion.question_id, option.number, option.text]);
    }
    newQuestion.options = questionData.options;
  }
  return rows.length > 0 ? newQuestion : null;
}

getQuestion = async (questionId) => {
  let { rows } = await db.query(queries.getQuestion, [questionId]);
  if (rows.length > 0) {
    let question = rows[0];
    if (question.question_type === "radio" || question.question_type === "checkbox") {
      question.options = await getQuestionOptions(question.question_id);
    }
    return question;
  } else {
    return null;
  }
}

getAvailableQuestions = async (personId) => {
  let { rows } = await db.query(queries.getAvailableQuestions, [personId]);
  if (rows.length > 0) {
    let questionList = [];
    for (row of rows) {
      if (row.question_type === "radio" || row.question_type === "checkbox") {
        row.options = await getQuestionOptions(row.question_id);
      }
      questionList.push(row);
    }
    return questionList;
  } else {
    return null;
  }
}

getQuestionOptions = async (questionId) => {
  let { rows } = await db.query(queries.getOptions, [questionId]);
  return rows.length > 0 ? rows : null;
}

updateQuestion = async (questionId, questionData) => {
  let parameters = [
    questionId,
    questionData.question_text,
    questionData.description
  ]
  await db.query(queries.updateQuestionData, parameters);
  // If the question has options, update them as well
  if (questionData.question_type === "radio" || questionData.question_type === "checkbox") {
    let newOptions = questionData.options;
    let oldOptions = await getQuestionOptions(questionId);
    for (option of newOptions) {
      if (!oldOptions.map(o => o.number).includes(option.number)) {
        // Add the new option
        await db.query(queries.addOption, [questionId, option.number, option.text]);
      } else {
        if (oldOptions.find(o => o.number === option.number).text !== option.text) {
          // Update the text of the existing option and remove it from the list of old options
          await db.query(queries.updateOptionText, [questionId, option.number, option.text]);
          oldOptions = oldOptions.filter(o => o.number !== option.number);
        } else {
          // Just remove the option from the list of old options
          oldOptions = oldOptions.filter(o => o.number !== option.number);
        }
      }
    }
    // Finally remove the old options that were no longer in the new options
    for (option of oldOptions) {
      await db.query(queries.removeOption, [questionId, option.number]);
    }
  }
  return await getQuestion(questionId);
}

deleteQuestion = async (questionId) => {
  let { rowCount } = await db.query(queries.deleteQuestion, [questionId]);
  return rowCount > 0;
}

isEditable = async (questionId) => {
  let formCount = await countForms(questionId);
  let is_default = await isDefault(questionId);
  return formCount < 2 && is_default === false;
}

isRemovable = async (questionId) => {
  let formCount = await countForms(questionId);
  let is_default = await isDefault(questionId);
  return formCount < 1 && is_default === false;
}

isOptional = async (questionId) => {
  let { rows } = await db.query(queries.checkOptional, [questionId]);
  return rows[0].is_optional;
}

countForms = async (questionId) => {
  let { rows } = await db.query(queries.countForms, [questionId]);
  return rows[0].count;
}

isDefault = async (questionId) => {
  let { rows } = await db.query(queries.checkDefault, [questionId]);
  return rows[0].is_default;
}

module.exports = {
  createQuestion,
  getQuestion,
  getAvailableQuestions,
  getQuestionOptions,
  updateQuestion,
  deleteQuestion,
  isEditable,
  isRemovable,
  isOptional
};
