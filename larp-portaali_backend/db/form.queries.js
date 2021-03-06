const createForm = `
  INSERT INTO form (game_id, name, description)
    VALUES ($1, $2, $3) RETURNING *;
`
const addDefaultQuestions = `
  INSERT INTO form_question (form_id, question_id, position)
  SELECT $1, id, id
  FROM question
  WHERE is_default = TRUE;
`
const getForm = `
  SELECT game_id, name, description, is_open
  FROM form
  WHERE id = $1;
`
const getFormQuestions = `
  SELECT question_id, order
  FROM form_question 
  WHERE form_id = $1;
`
const updateFormData = `
  UPDATE form 
  SET 
    name = $2,
    description = $3
  WHERE id = $1;
`
const addQuestion = `
  INSERT INTO form_question (form_id, question_id, position)
  VALUES ($1, $2, $3);
`
const updateQuestionPosition = `
  UPDATE form_question 
  SET position = $3
  WHERE form_id = $1 AND question_id = $2;
`
const removeQuestion = `
  DELETE FROM form_question 
  WHERE form_id = $1 AND question_id = $2; 
`
const toggleRegistration = `
  UPDATE form SET 
    is_open = NOT is_open 
  WHERE id = $1;
`
const isOpen = `
  SELECT is_open FROM form WHERE id = $1 RETURNING is_open;
`


module.exports = {
  createForm,
  addDefaultQuestions,
  getForm,
  getFormQuestions,
  updateFormData,
  addQuestion,
  updateQuestionPosition,
  removeQuestion,
  toggleRegistration,
  isOpen
};

