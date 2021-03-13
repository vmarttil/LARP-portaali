require('dotenv').config()
var bcrypt = require("bcryptjs");
const db = require("./index.js");
const queries = require("./form.queries.js")
const question_queries = require("./question.queries.js")
const Game = require("./game.db.js")
const Question = require("./question.db.js")
const Person = require("./person.db.js")

getQuestionTypes = async () => {
  let { rows } = await db.query(queries.getQuestionTypes, []);
  return rows.length > 0 ? rows : [];
};

getFormClasses = async () => {
  let { rows } = await db.query(queries.getFormClasses, []);
  return rows.length > 0 ? rows : [];
};

createForm = async (formData) => {
  let parameters = [
    formData.game_id,
    formData.name,
    formData.description,
    formData.form_class
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
};

getFormQuestionList = async (formId) => {
  let { rows } = await db.query(queries.getFormQuestionList, [formId]);
  return rows.length > 0 ? rows : [];
};

getForm = async (formId) => {
  let { rows } = await db.query(queries.getForm, [formId]);
  if (rows.length > 0) {
    let form = rows[0];
    form.questions = await getFormQuestions(formId);
    return form;
  } else {
    return null;
  }
};

getFormQuestions = async (formId) => {
  let { rows } = await db.query(queries.getFormQuestions, [formId]);
  if (rows.length > 0) {
    let questions = [];
    for (row of rows) {
      if (row.question_type === "radio" || row.question_type === "checkbox") {
        row.options = await getQuestionOptions(row.question_id);
      }
      questions.push(row);
    }
    return questions
  } else {
    return [];
  }
};

updateForm = async (formId, formData) => {
  let parameters = [
    formId,
    formData.name,
    formData.description,
    formData.form_class
  ]
  console.log(parameters)
  await db.query(queries.updateFormData, parameters);
  let newQuestions = formData.questions
  console.log("New questions: ")
  console.log(newQuestions)
  let oldQuestions = await getFormQuestionList(formId);
  console.log("Old questions: ")
  console.log(oldQuestions)
  for (const [index, question] of newQuestions.entries()) {
    console.log("Index: ", index)
    if (question.question_id.toString().includes("new_")) {
      // If the id of a question contains 'new_', i.e. it is a new question, create it in the database, ignoring the temporary id
      console.log("New question: ", question)
      let newQuestion = await Question.createQuestion(question);
      // Link the question to the form using the ID and setting the position
      await db.query(queries.addQuestion, [formId, newQuestion.question_id, (index + 1)]);
    } else {
      if (await Question.isChanged(question)) {
        // If the question is an existing question that has been edited
        if (await Question.isEditable(question.question_id)) {
          console.log("Changed editable question: ", question)
          // If the question is unique to this form, update the question in the database
          let updatedQuestion = await Question.updateQuestion(question.question_id, question);
          // Add the question to the form if it is not included
          if (!oldQuestions.find(q => q.question_id == question.question_id)) {
            await db.query(queries.addQuestion, [formId, question.question_id, (index + 1)]);
          } else if (oldQuestions.find(q => q.question_id == question.question_id).position != index + 1) {
            // Update the position of the question in the form if it has changed
            console.log("Position has changed: ", question)
            await db.query(queries.updateQuestionPosition, [formId, updatedQuestion.question_id, (index + 1)]);
          }
        } else {
          console.log("Changed non-editable question: ", question)
          // If the question is a default question or question used also elsewhere, create a new question in the database
          let newQuestion = await Question.createQuestion(formId, question);
          // Remove the old question from the form if it was included and link the new version to the form using the ID and setting the position
          if (oldQuestions.find(q => q.question_id == question.question_id)) { }
          await db.query(queries.removeQuestion, [formId, question.question_id]);
        }
        await db.query(queries.addQuestion, [formId, newQuestion.question_id, (index + 1)]);
      } else {
        console.log("Identical question: ", question)
        // Add the question to the form if it is not included
        if (!oldQuestions.find(q => q.question_id == question.question_id)) {
          await db.query(queries.addQuestion, [formId, question.question_id, (index + 1)]);
        } else if (oldQuestions.find(q => q.question_id == question.question_id)?.position != index + 1) {
          // Or just update the position of the question in the form if it has changed
          console.log("Position has changed: ", question)
          await db.query(queries.updateQuestionPosition, [formId, question.question_id, (index + 1)]);
        }
      }
      // Remove the question from the list of old questions
      oldQuestions = oldQuestions.filter(q => q.question_id !== question.question_id);
    }
  }
  // Finally remove the old questions that were no longer in the new questions
  console.log("Old questions left over: ", oldQuestions)
  for (question of oldQuestions) {
    await db.query(queries.removeQuestion, [formId, question.question_id]);
    // If they are not default questions and no longer used anywhere, remove them from the database
    if (await Question.isRemovable(question.question_id)) {
      await db.query(question_queries.deleteQuestion, [question.question_id])
    }
  }
  // Get and return the updated form
  return await getForm(formId);
};

getFormGameId = async (formId) => {
  let { rows } = await db.query(queries.getFormGame, [formId]);
  return rows[0].game_id;
};

isOpen = async (formId) => {
  let { rows } = await db.query(queries.isOpen, [formId]);
  return rows.length > 0 ? rows[0].is_open : null;
};

toggleRegistration = async (formId) => {
  let gameId = await getFormGameId(formId);
  let gameForms = await Game.getGameForms(gameId);
  let toggledForm = gameForms.find(form => form.id == formId)
  let sameClassForms = gameForms.filter(form => form.form_class === toggledForm.form_class)
  // If the toggled form is open or none of the forms of the same type are open, allow the toggle and return true, else return false
  if (toggledForm.is_open || sameClassForms.every(form => !form.is_open)) {
    let { rows } = await db.query(queries.toggleRegistration, [formId]);
    if (rows.length > 0) {
      return { success: true, target: !toggledForm.is_open };
    } else {
      return { success: null, target: !toggledForm.is_open };
    }
  } else {
    return { success: false, target: !toggledForm.is_open };
  }
};

getFormRegistrations = async (form_id) => {
  let { rows } = await db.query(queries.getFormRegistrations, [formId]);
  if (rows.length > 0) {
    registrations = [];
    for (row of rows) {
      let name = Person.getName(row.person_id);
      let registration = {form_id: row.form_id, person_id: row.person_id, name: name, submitted: submitted};
      registrations.push(registration);
    }
    return registrations;
  } else {
    return [];
  }
};

checkOrganiserStatus = async (formId, personId) => {
  let { rows } = await db.query(queries.checkOrganiserStatus, [formId, personId]);
  return rows.length > 0;
}

countFormRegistrations = async (formId) => {
  let { rows } = await db.query(queries.countFormRegistrations, [formId]);
  return rows[1].count;
};

isEditable = async (formId) => {
  let open = await isOpen(formId);
  let registrations = await countFormRegistrations(formId);
  return !open && registrations == 0;
};

module.exports = {
  getQuestionTypes,
  getFormClasses,
  createForm,
  getForm,
  getFormQuestions,
  updateForm,
  getFormGameId,
  isOpen,
  getFormRegistrations,
  toggleRegistration,
  checkOrganiserStatus,
  countFormRegistrations,
  isEditable
};
