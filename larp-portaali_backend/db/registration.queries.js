const checkOrganiserStatus = `
  SELECT * 
  FROM game_organiser AS go
  JOIN game AS g ON go.game_id = g.id
  JOIN form AS f ON g.id = f.game_id
  JOIN registration AS r ON f.id = r.form_id
  WHERE 
    r.form_id = $1 AND
    r.person_id = 2 AND 
    go.person_id = $3; 
`
const createRegistration = `
  INSERT INTO registration (
    form_id, 
    person_id, 
    submitted
  ) VALUES (
    $1,
    $2,
    localtimestamp
  );
`
const insertAnswer = `
  INSERT INTO answer (
    person_id, 
    form_id, 
    question_id, 
    answer_text
  ) VALUES (
    $1, 
    $2, 
    $3, 
    $4
  );
`
const insertAnswerOption = `
  INSERT INTO answer_option (
    person_id, 
    form_id, 
    question_id,
    option_number
  ) VALUES (
    $1, 
    $2, 
    $3, 
    $4
  );
`
const getRegistration = `
  SELECT 
    person_id,
    form_id,
    submitted
  FROM registration
  WHERE person_id = $1
    AND form_id = $2;
`
const getAnswers = `
  SELECT 
    a.person_id,
    a.form_id,
    a.question_id, 
    a.answer_text,
    ao.option_number,
    o.option_text
  FROM answer AS a
  LEFT JOIN answer_option AS ao
    ON  a.person_id = ao.person_id 
    AND a.form_id = ao.form_id 
    AND a.question_id = ao.question_id
  LEFT JOIN option AS o
    ON  ao.question_id = o.question_id
    AND ao.option_number = o.option_number 
  WHERE a.person_id = $1
    AND a.form_id = $2;
`

module.exports = {
  checkOrganiserStatus,
  createRegistration,
  insertAnswer,
  insertAnswerOption,
  getRegistration,
  getAnswers
};

