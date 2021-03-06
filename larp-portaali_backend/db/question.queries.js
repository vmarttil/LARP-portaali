const getAvailableQuestions = `
  SELECT DISTINCT
    fq.form_id AS form_id, 
    q.id AS question_id, 
    qt.name AS type, 
    q.question_text AS text, 
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
    qt.name AS type, 
    q.question_text AS text, 
    q.description,
    q.is_optional, 
    q.prefill_tag,
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
    (SELECT id FROM question_type WHERE name = $2),
    $3,
    $4,
    FALSE,
    TRUE,
    NULL
  )
  RETURNING *;
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
    );
`
const updateQuestionData = `
  UPDATE question SET
    question_text = $2,
    description = $3
  WHERE id = $1;
`
const getOptions = `
  SELECT option_number AS number, option_text AS text
  FROM options
  WHERE question_id = $1;
`
const addOption = `

`
const updateOptionText = `

`
const removeOption = `

`
const countForms = `
  SELECT COUNT(*) 
  FROM form_question 
  WHERE question_id = $1; 
`



module.exports = {
  getAvailableQuestions,
  getQuestion,
  getQuestionOptions,
  createQuestion,
  updateQuestionData,
  addQuestionOption
};

