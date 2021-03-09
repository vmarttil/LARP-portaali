import React, { useState, useEffect } from "react";
import { Card, Form, Button, Alert, Container, Row, Col, Spinner } from 'react-bootstrap';
import { Redirect, useParams } from "react-router-dom";
import UserService from "../services/user.service";
import GameService from "../services/game.service";
import FormService from "../services/form.service";
import { useTextField, useTextArea } from "../utils/hooks"
import { TextField, TextArea, DummyField } from "./FormFields"
import { validateRequired, validateDate } from "../utils/validate"
import { errorMessage } from "../utils/messages";
import { formatDateRange } from "../utils/formatters";
import { getQueriesForElement } from "@testing-library/react";
import { Trash, PencilSquare } from 'react-bootstrap-icons';


const RegistrationForm = (props) => {

  const { game_id, form_id } = useParams();

  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [hasChanged, setHasChanged] = useState(false);
  const [formId, setFormId] = useState(null);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isOpen, setOpen] = useState(false);


  /* Fields for form data */
  const nameField = useTextField("name", "Lomakkeen nimi:", "text", 64, validateRequired, "", ["horizontal_3-9"]);
  const descriptionField = useTextArea("description", "Lomakkeen kuvaus:", 256, validateRequired, "", ["horizontal_3-9"], 4);

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
    setHasChanged(true);
  }, [questions, nameField.value, descriptionField.value]
  )        

  const fetchForm = async () => {
    try {
      let response = await FormService.editForm(form_id);
      let formData = response.data;
      let questions = formData.form.questions.sort((a, b) => a.position - b.position);

      nameField.setValue(formData.form.name);
      descriptionField.setValue(formData.form.description);
      setFormId(formData.form.form_id);
      setAvailableQuestions(formData.available_questions);
      setQuestions(questions);
      setOpen(formData.form.is_open);
      setHasChanged(false);
    } catch (error) {
      setMessage(errorMessage(error));
    };
  };

  const saveFormData = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessful(false);

    let formData = {
      game_id: game_id,
      form_id: formId,
      name: nameField.value,
      description: descriptionField.value,
      questions: questions
    };

    if (nameField.validate() &&
      descriptionField.validate()) {
      try {
        let response = await FormService.updateForm(formData)
        setMessage(response.data.message);
        setSuccessful(true);
        await fetchForm();
        setHasChanged(false);
      } catch (error) {
        setMessage(errorMessage(error));
        setSuccessful(false);
      }
    } else {
      setMessage("Täytä puuttuvat tiedot.")
    };
  };



  const QuestionList = () => {
    return (
      <div>
          {questions.map((question, index) => {
            return (
              <Card key={question.question_id} className="mx-0 my-3 p-0 bg-white">
                <Card.Header className="d-flex justify-content-end p-1" style={{ backgroundColor: "#e9ecef" }}>
                  <PencilSquare className="lead mx-1"/>
                  <Button variant="outline-dark" size="sm"><Trash className="lead mx-1"/></Button>
                </Card.Header>
                <Card.Body className="p-2">
                  <DummyField type={question.question_type} text={question.question_text} description={question.description} options={question.options ? question.options : []}/>
                </Card.Body>

              </Card>
            )
          })}
      </div>
    )
  }




  return (
    <Container>
      <Row>
        <Col sm="12">
          <Card className="my-3">
            <Card.Body>
              <Card.Title>
                <h1>Ilmoittautumislomakkeen muokkaus</h1>
              </Card.Title>
              <Card.Text>
                Tällä sivulla voit muokata peliin ilmoittautumiseen käytettävää lomaketta poistamalla tai muokkaamalla
                oletuskysymyksiä, lisäämällä uusia kysymyksiä ja muuttamalla kysymysten järjestystä. Kokonaan uusien kysymysten
                luomisen lisäksi voit myös lisätä peliin kysymyksiä mahdollisista muista peleistä, joissa olet järjestäjänä ja
                muokata niitä tarvittaessa. Myös uusille lomakkeille määritetyt oletuskysymykset ja muokattavasta lomakkeesta poistamasi
                kysymykset ovat aina lisättävissä (kunnes tallennat lomakkeen, jolloin poistetut kysymykset poistuvat pysyvästi elleivät
                ne ole oletuskysymyksiä tai käytössä jollakiin muulla lomakkeella). Ainoat pakolliset kysymykset ovat ilmoittautujan nimi
                ja sähköpostiosoite. Voit myös luoda useita lomakkeita samalle pelille (esim. avustaja- tai NPC-ilmoittautumisia varten)
                ja hallinnoida niitä erikseen.
          </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col sm="1"></Col>
        <Col sm="10">
          <Card className="my-3">
              <Card.Body>
                <Card.Title>
                  <h2>Lomakkeen tiedot</h2>
                </Card.Title>
                <Form className="align-items-center" onSubmit={saveFormData}>
                  <TextField {...nameField} />
                  <TextArea {...descriptionField} />
                  <h2>Kysymykset</h2>
                  
                  <QuestionList/>

                  <Form.Group controlId="submit">
                    <Button variant="primary" type="submit" disabled={!hasChanged} block>
                      <span>Tallenna lomake</span>
                    </Button>
                  </Form.Group>

                  <Alert show={message !== ""} variant={successful ? "success" : "danger"}>
                    {message}
                  </Alert>

                </Form>
              </Card.Body>
          </Card>
        </Col>
        <Col sm="1"></Col>
      </Row>
    </Container>
  );
};

export default RegistrationForm;