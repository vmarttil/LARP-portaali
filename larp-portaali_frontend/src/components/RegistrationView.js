import React, { useState, useEffect } from "react";
import { Card, Form, Alert, Container, Row, Col, Button } from 'react-bootstrap';
import { useParams, useHistory } from "react-router-dom";
import RegistrationService from "../services/registration.service";
import { TextQuestion, IntegerQuestion, CheckQuestion, TextAreaQuestion } from "./Question";
import { errorMessage } from "../utils/messages";


const RegistrationView = ({ currentUser }) => {
  const history = useHistory();

  const { form_id, person_id } = useParams();

  const [message, setMessage] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");

  useEffect(() => {
    fetchRegistration();
  }, [form_id, person_id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage('');
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);


  const fetchRegistration = async () => {
    try {
      let response = await RegistrationService.getRegistration(form_id, person_id);
      let registrationData = response.data;
      let questions = registrationData.form.questions.sort((a, b) => a.position - b.position);
      let answerList = registrationData.registration.answers;
      setFormName(registrationData.form.name);
      setFormDescription(registrationData.form.description);
      setQuestions(questions);

      let answerObject = {};
      for (const answer of answerList) {
        if (questions.find(question => parseInt(question.question_id) === parseInt(answer.question_id)).question_type === "checkbox") {
          for (const option of answer.options) {
            answerObject[`${answer.question_id}_${option.option_number}`] = true;
          }
        } else if (questions.find(question => parseInt(question.question_id) === parseInt(answer.question_id)).question_type === "radio") {
          answerObject[answer.question_id] = answer.options[0].option_number;
        } else {
          answerObject[answer.question_id] = answer.answer_text;
        }
      }
      setAnswers(answerObject);
    } catch (error) {
      setMessage(errorMessage(error));
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
                  onChange={null} />
              )
              }
              {question.question_type === "integer" && (
                <IntegerQuestion
                  key={question.question_id}
                  question={question}
                  value={answers[question.question_id]}
                  onChange={null} />
              )
              }
              {(question.question_type === "radio" ||
                question.question_type === "checkbox") && (
                  <CheckQuestion
                    key={`question_${question.question_id}`}
                    question={question}
                    value={answers}
                    onChange={null} />
                )
              }
              {question.question_type === "textarea" && (
                <TextAreaQuestion
                  key={question.question_id}
                  question={question}
                  value={answers[question.question_id]}
                  onChange={null} />
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
              <Form className="align-items-center">
                <Container>
                  {questionList()}
                  <Alert show={message !== ""} variant="danger">
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

    </Container>
  );
};

export default RegistrationView;