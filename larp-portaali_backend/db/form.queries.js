const getQuestionTypes = `
  SELECT name, display_text FROM question_type;
`
const getFormClasses = `
  SELECT name, button_text FROM form_class;
`
const createForm = `
  INSERT INTO form (
    game_id, 
    name, 
    description, 
    is_open, 
    form_class_id
  ) VALUES (
    $1, 
    $2, 
    $3, 
    FALSE, 
    (SELECT id FROM form_class WHERE name = $4)
    ) RETURNING id, game_id, name, description, is_open, $4;
`
const addDefaultQuestions = `
  INSERT INTO form_question (form_id, question_id, position)
  SELECT $1, id, id
  FROM question
  WHERE is_default = TRUE;
`
const getForm = `
  SELECT 
    f.id AS form_id, 
    f.game_id, 
    f.name, 
    f.description, 
    f.is_open, 
    fc.name AS form_class,
    fc.button_text
  FROM form As f
  JOIN form_class AS fc
    ON f.form_class_id = fc.id
  WHERE f.id = $1;
`
const getFormQuestionList = `
  SELECT question_id, position
  FROM form_question 
  WHERE form_id = $1;
`
const getFormQuestions = `
  SELECT 
    q.id AS question_id, 
    qt.name AS question_type, 
    q.question_text, 
    q.description,
    q.is_optional, 
    q.prefill_tag,
    fq.position
  FROM question AS q
  JOIN form_question AS fq 
    ON q.id = fq.question_id
  JOIN question_type AS qt
    ON q.question_type_id = qt.id
  WHERE fq.form_id = $1;
`
const updateFormData = `
  UPDATE form 
  SET 
    name = $2,
    description = $3,
    form_class_id = (SELECT id FROM form_class WHERE name = $4)
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
  UPDATE form SET is_open = NOT is_open 
  WHERE id = $1
  RETURNING is_open;
`
const checkOrganiserStatus = `
  SELECT * 
  FROM game_organiser AS go
  JOIN game AS g ON go.game_id = g.id
  JOIN form AS f ON g.id = f.game_id
  WHERE f.id = $1 AND go.person_id = $2;
`
const isOpen = `
  SELECT is_open FROM form WHERE id = $1;
`
const countFormRegistrations = `
  SELECT COUNT(*)
  FROM registration
  WHERE form_id = $1;
`
const getFormGame = `
  SELECT game_id FROM form WHERE id = $1;
`

module.exports = {
  getQuestionTypes,
  getFormClasses,
  createForm,
  addDefaultQuestions,
  getForm,
  getFormQuestionList,
  getFormQuestions,
  updateFormData,
  addQuestion,
  updateQuestionPosition,
  removeQuestion,
  toggleRegistration,
  checkOrganiserStatus,
  isOpen,
  countFormRegistrations,
  getFormGame
};

