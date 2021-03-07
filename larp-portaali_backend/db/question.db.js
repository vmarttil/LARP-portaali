require('dotenv').config()
var bcrypt = require("bcryptjs");
const db = require("./index.js");
const queries = require("./question.queries.js")


createQuestion = async (questionData) => {
  let parameters = [
    questionData.type,
    questionData.text,
    questionData.description
  ];
  let { rows } = await db.query(queries.createQuestion, parameters);
  let newQuestion = rows[0];
  await db.query(queries.associateToForm, [newQuestion.id, questionData.formId]);
  
  for (option of questionData.options) {
    await db.query(queries.addOption, [rows[0].id, option.number, option.text]);
  }
  newQuestion.options = questionData.options;
  return rows.length > 0 ? rows : null;
}

getQuestion = async (questionId) => {
  let { rows } = await db.query(queries.getQuestion, [questionId]);
  if (rows.length > 0) {
    let question = rows[0];
    question.options = await getQuestionOptions(questionId);
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
      if (row.type === "radio" || row.type === "checkbox") {
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
    questionData.text,
    questionData.description
    ]
  await db.query(queries.updateQuestionData, parameters);
  
  let newOptions = questionData.options;
  let oldOptions = getQuestionOptions(questionId);
  for (option of newOptions) {
    if (!oldOptions.map(o => o.number).includes(option.number)) {
      // Add the new option
      await db.query(queries.addOption, [questionId, option.number, option.text]);
    } else {
      if (oldQuestions.find(o => o.number === option.number).text !== option.text) {
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
  return await getQuestion(questionId);
}

deleteQuestion = async (questionId) => {
  let { rowCount } = await db.query(queries.deleteQuestion, [questionId]);
  return rowCount > 0;
}

countForms = async (questionId) => {
  let { rows } = await db.query(queries.countForms, [questionId]);
  return rows[0].count;
}

module.exports = {
  createQuestion, 
  getQuestion,
  getAvailableQuestions,
  getQuestionOptions,
  updateQuestion,
  deleteQuestion,
  countForms
};
