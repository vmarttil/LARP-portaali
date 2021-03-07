const getAvailableQuestions = `
  SELECT DISTINCT
    fq.form_id AS form_id, 
    q.id AS question_id, 
    qt.name AS question_type, 
    q.question_text, 
    q.description,
    q.is_optional, 
    q.prefill_tag
  FROM question AS q
  JOIN form_question AS fq 
    ON q.id = fq.question_id
  JOIN question_type AS qt
    ON q.question_type_id = qt.id
  JOIN form AS f
    ON fq.form_id = f.id
  JOIN game AS g
    ON f.game_id = g.id
  JOIN game_organiser AS go
    ON g.id = go.game_id
  WHERE go.person_id = $1;
`
const getQuestion = `
  SELECT 
    q.id AS question_id, 
    qt.name AS question_type, 
    q.question_text, 
    q.description,
    q.is_optional, 
    q.prefill_tag
  FROM question AS q
  JOIN question_type AS qt
    ON q.question_type_id = qt.id
  WHERE q.id = $1;
`
const createQuestion = `
  INSERT INTO question (
    question_type_id,
    question_text,
    description,
    is_default,
    is_optional,
    prefill_tag
    )
  VALUES (
    (SELECT id FROM question_type WHERE name = $1),
    $2,
    $3,
    FALSE,
    TRUE,
    NULL
  )
  RETURNING 
    id AS question_id,
    $1 AS question_type,
    question_text AS text,
    description,
    is_optional,
    prefill_tag;
`
const associateToForm = `
  INSERT INTO form_question (
    form_id, 
    question_id, 
    position
    )
  VALUES
    (
    $1,
    $2,
    (SELECT MAX(position) FROM form_question WHERE form_id = $1) + 1
    )
  RETURNING position;
`
const updateQuestionData = `
  UPDATE question SET
    question_text = $2,
    description = $3
  WHERE id = $1;
`
const deleteQuestion = `
  DELETE FROM question WHERE id = $1;
`
const getOptions = `
  SELECT option_number AS number, option_text AS text
  FROM option
  WHERE question_id = $1;
`
const addOption = `
  INSERT INTO option (
    question_id, 
    option_number, 
    option_text
  )
  VALUES 
  (
    $1,
    $2,
    $3
  );
`
const updateOptionText = `
  UPDATE option SET
    option_text = $3
  WHERE question_id = $1 AND option_number = $2;
`
const removeOption = `
  DELETE FROM option WHERE question_id = $1 AND option_number = $2;
`
const countForms = `
  SELECT COUNT(*) AS count
  FROM form_question
  WHERE question_id = $1; 
`
const checkDefault = `
  SELECT is_default
  FROM question
  WHERE id = $1;
`
const checkOptional = `
  SELECT is_optional
  FROM question
  WHERE id = $1;
`


module.exports = {
  getAvailableQuestions,
  getQuestion,
  createQuestion,
  associateToForm,
  updateQuestionData,
  deleteQuestion,
  getOptions,
  addOption,
  updateOptionText,
  removeOption,
  countForms,
  checkDefault,
  checkOptional
};

