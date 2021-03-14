import React, { useState, useEffect } from "react";
import { Card, Form, Button, Alert, Container, Row, Col, Spinner } from 'react-bootstrap';
import { Redirect, useParams, useHistory } from "react-router-dom";
import RegistrationService from "../services/registration.service";
import FormService from "../services/form.service";
import PersonService from "../services/person.service";
import { TextQuestion, IntegerQuestion, CheckQuestion, TextAreaQuestion } from "./Question";
import { TextField, TextArea, DummyField } from "./FormFields"
import { errorMessage } from "../utils/messages";
import { prefill } from "../utils/prefill";
import { isEmpty } from "../utils/utilities";


const RegistrationForm = ({ currentUser }) => {
  const history = useHistory();

  const { game_id, form_id } = useParams();

  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [hasChanged, setHasChanged] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [redirect, setRedirect] = useState(false);
  const [gameId, setGameId] = useState();
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");

  useEffect(() => {
    fetchForm();
  }, [form_id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage('');
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    if (!isEmpty(answers)) {
      sessionStorage.setItem(`answers_${form_id}`, JSON.stringify(answers));
    }
  }, [answers]);


  const fetchForm = async () => {
    try {
      let response = await FormService.getForm(form_id);
      let questions = response.data.form.questions.sort((a, b) => a.position - b.position);

      setGameId(response.data.form.game_id);
      setFormName(response.data.form.name);
      setFormDescription(response.data.form.description);
      setQuestions(questions);
      if (sessionStorage.getItem(`answers_${form_id}`) == null || isEmpty(sessionStorage.getItem(`answers_${form_id}`))) {
        prefillForm(questions);
      } else {
        let storedAnswers = JSON.parse(sessionStorage.getItem(`answers_${form_id}`));
        setAnswers(storedAnswers);
      }
      setHasChanged(false);
      
    } catch (error) {
      setMessage(errorMessage(error));
    };
  };

  const prefillForm = async (questions) => {
    let prefilledAnswers = {};
    for (const question of questions) {
      if (question.prefill_tag !== null) {
        prefilledAnswers[question.question_id] = await prefill(question.prefill_tag);
      }
    }
    setAnswers(prefilledAnswers);
  };

  const onAnswerChange = (event) => {
    let question_id = event.target.id.split("_")[1];
    let answer = event.target.value;
    setAnswers({ ...answers, [question_id]: answer });
  };

  const onSelectionChange = (event) => {
    if (event.target.type === "radio") {
      setAnswers({ ...answers, [event.target.value.split("_")[0]]: event.target.value.split("_")[1] })
    } else {
      setAnswers({ ...answers, [event.target.value]: event.currentTarget.checked });
    }
  };

  const validateAnswers = () => {
    let answerKeys = Object.entries(answers).filter(e => !e[0].includes("_") || (e[0].includes("_") && e[1] == true)).map(e => parseInt(e[0].split("_")[0]));
    for (const question of questions) {
      if (!answerKeys.includes(question.question_id)) {
        return false;
      }
    }
    return true;
  };

  const exportAnswers = () => {
    let exportAnswers = {};
    for (const [key, value] of Object.entries(answers)) {
      if (key.includes("_")) {
        if (value == true) {
          let questionId = key.split("_")[0];
          let optionNumber = key.split("_")[1];
          if (exportAnswers.hasOwnProperty(questionId)) {
            exportAnswers[questionId] = [...exportAnswers[questionId], optionNumber];
          } else {
            exportAnswers[questionId] = [optionNumber];
          }
        }
      } else if (questions.find(q => q.question_id == parseInt(key)).question_type == "radio") {
        exportAnswers[key] = [value];
      } else {
        exportAnswers[key] = value;
      }
    }
    let answerList = [];
    for (const [question_id, answerContent] of Object.entries(exportAnswers)) {
      let answer = null;
      if (Array.isArray(answerContent)) {
        answer = {question_id: question_id, options: answerContent};
      } else {
        answer = {question_id: question_id, answer_text: answerContent};
      }
      answerList.push(answer);
    }
    return answerList;
  };

  const submitRegistration = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessful(false);

    if (validateAnswers()) {
      let registration = {
        user_id: currentUser.id,
        form_id: form_id,
        answers: exportAnswers()
      }
      try {
        let response = await RegistrationService.submitRegistration(registration)
        setMessage(response.data.message);
        setSuccessful(true);
        setHasChanged(false);
        sessionStorage.removeItem(`answers_${form_id}`);
        setTimeout(() => setRedirect(true), 3000)
      } catch (error) {
        setMessage(errorMessage(error));
        setSuccessful(false);
      }
    } else {
      setMessage("Täytä puuttuvat tiedot.")
    };
  };


  const questionList = () => {
    return (
      <>
        {questions.map(question => {
          return (
            <div key={question.question_id}>
              {question.question_type === "text" && (
                <TextQuestion
                  key={question.question_id}
                  question={question}
                  value={answers[question.question_id]}
                  onChange={onAnswerChange} />
              )
              }
              {question.question_type === "integer" && (
                <IntegerQuestion
                  key={question.question_id}
                  question={question}
                  value={answers[question.question_id]}
                  onChange={onAnswerChange} />
              )
              }
              {(question.question_type === "radio" ||
                question.question_type === "checkbox") && (
                  <CheckQuestion
                    key={`question_${question.question_id}`}
                    question={question}
                    value={answers}
                    onChange={onSelectionChange} />
                )
              }
              {question.question_type === "textarea" && (
                <TextAreaQuestion
                  key={question.question_id}
                  question={question}
                  value={answers[question.question_id]}
                  onChange={onAnswerChange} />
              )
              }
            </div>
          )
        })}
      </>
    )
  };



  return (
    <Container>
      <Row>
        <Col sm="1"></Col>
        <Col sm="10">
          <Card className="my-3">
            <Card.Body>
              <Card.Title>
                <h2>{formName}</h2>
              </Card.Title>
              <Card.Text>
                {formDescription}
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="my-3">
            <Card.Body>
              <Form className="align-items-center" onSubmit={submitRegistration}>
                <Container>

                  {questionList()}

                  <Row>
                    <Col sm={12}>
                      <Form.Group controlId="submit">
                        <Button variant="primary" type="submit" block>
                          <span>Lähetä ilmoittautuminen</span>
                        </Button>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Alert show={message !== ""} variant={successful ? "success" : "danger"}>
                    {message}
                  </Alert>

                </Container>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col sm="1"></Col>
      </Row>
      <Row>
        <Col sm="1"></Col>
        <Col sm="10">
          <Button variant="primary" type="button" size="sm" onClick={() => { history.goBack() }}>Takaisin</Button>
        </Col>
        <Col sm="1"></Col>
      </Row>

      {redirect && (
        <Redirect to={{ pathname: '/portal/player' }} />
      )}

    </Container>
  );
};

export default RegistrationForm;