import React, { useState, useEffect } from "react";
import { Card, Form, Button, Alert, Container, Row, Col, Spinner } from 'react-bootstrap';
import { Redirect, useParams } from "react-router-dom";
import UserService from "../services/user.service";
import GameService from "../services/game.service";
import FormService from "../services/form.service";
import { useTextField, useTextArea, useSelectField, useRadioField } from "../utils/hooks"
import { TextField, TextArea, DummyField, SelectField } from "./FormFields"
import { validateRequired, noValidate } from "../utils/validate"
import { errorMessage } from "../utils/messages";
import { formatDateRange } from "../utils/formatters";
import { getQueriesForElement } from "@testing-library/react";
import { Trash, PencilSquare, PlusSquare } from 'react-bootstrap-icons';
import "../css/Button.css";


const EditForm = (props) => {

  const { game_id, form_id } = useParams();

  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [hasChanged, setHasChanged] = useState(false);
  const [formId, setFormId] = useState(null);
  const [formClasses, setformClasses] = useState({});
  const [questionTypes, setQuestionTypes] = useState({});
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [addableQuestions, setAddableQuestions] = useState({});
  const [questions, setQuestions] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [busy, setBusy] = useState(true);


  /* Fields for form data */
  const nameField = useTextField("name", "Lomakkeen nimi:", "text", 64, validateRequired, "", ["horizontal_3-9"]);
  const descriptionField = useTextArea("description", "Lomakkeen kuvaus:", 256, validateRequired, "", ["horizontal_3-9"], 4);
  const formClassField = useRadioField("form_class", "Ilmoittautumisen tyyppi:", true, formClasses, null, ["inline", "horizontal_3-9"]);
  const addQuestionField = useSelectField("addQuestion", "Valmiit kysymykset:", false, addableQuestions, "Valitse...", ["horizontal_3-8", "partialRow"]);
  const createQuestionField = useSelectField("createQuestion", "Luo uusi kysymys:", false, questionTypes, "Valitse tyyppi...", ["horizontal_3-6", "partialRow"]);

  useEffect(() => {
    console.log("Triggeröityykö tämä?")
    fetchForm();
    setBusy(false);
  }, [form_id]);

  useEffect(() => {
    let selectItems = {};
    for (const question of availableQuestions) {
      selectItems[question.question_id] = questionTypes[question.question_type]  + ": " + question.question_text; 
    }
    setAddableQuestions(selectItems);
    console.log(addQuestionField.value)
  }, [availableQuestions]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage('');
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    setHasChanged(true);
    console.log(questions);
  }, [questions, nameField.value, descriptionField.value]
  )

  const fetchForm = async () => {
    try {
      let response = await FormService.editForm(form_id);
      let formData = response.data;
      let questions = formData.form.questions.sort((a, b) => a.position - b.position);
      questions = questions.map(({ position, ...others }) => others)

      let questionTypeList = response.data.types.map(type => [type.name, type.display_text] );
      let questionTypes = Object.fromEntries(questionTypeList);
      console.log(questionTypes);
      setQuestionTypes(questionTypes);

      nameField.setValue(formData.form.name);
      descriptionField.setValue(formData.form.description);
      setFormId(formData.form.form_id);
      setAvailableQuestions(formData.available_questions);
      setQuestions(questions);
      setOpen(formData.form.is_open);
      setHasChanged(false);
      setBusy(false);
    } catch (error) {
      setMessage(errorMessage(error));
    };
  };

  const removeQuestion = (e) => {
      let question_id = e.currentTarget.value;
      let question = questions.find(q => q.question_id == question_id);
    if (question.is_optional) {  
      let newQuestions = [...questions];
      newQuestions = newQuestions.filter(q => q.question_id != question_id);
      setQuestions(newQuestions);
      let newAvailableQuestions = [...availableQuestions];
      newAvailableQuestions.push(question);
      newAvailableQuestions.sort(((a, b) => a.question_id - b.question_id))
      console.log(newAvailableQuestions)
      setAvailableQuestions(newAvailableQuestions);
    }
  };

  const addQuestion = () => {
    let question_id = addQuestionField.value;
    let question = availableQuestions.find(q => q.question_id == question_id);
    let newQuestions = [...questions];
    newQuestions.push(question);
    setQuestions(newQuestions);
    let newAvailableQuestions = [...availableQuestions];
    newAvailableQuestions = newAvailableQuestions.filter(q => q.question_id != question_id);
    setAvailableQuestions(newAvailableQuestions);
  };

  const createQuestion = () => {


  };

  const saveFormData = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessful(false);

    let formData = {
      game_id: game_id,
      form_id: formId,
      form_class: formClassField.value,
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
            <Card key={question.question_id} className="mx-0 my-3 p-0">
              <Card.Header className="d-flex justify-content-end p-1">
                <Button variant="outline-dark" size="xs" value={question.question_id}><PencilSquare className="lead mx-1" /></Button>
                <Button variant="outline-dark" size="xs" value={question.question_id} onClick={removeQuestion} disabled={!question.is_optional}><Trash className="lead mx-1" /></Button>
              </Card.Header>
              <Card.Body className="p-2">
                <DummyField type={question.question_type} text={question.question_text} description={question.description} options={question.options ? question.options : []} />
              </Card.Body>

            </Card>
          )
        })}


        <Card className="mx-0 my-3 p-0">
          <Card.Header className="py-1 px-2 lead align-items-center"><PlusSquare className="mb-1 mr-1"/> Lisää kysymys</Card.Header>
          <Card.Body className="p-2">

          <Row className="my-2">
            <SelectField {...addQuestionField} />
              <Button variant="primary" size="sm" onClick={addQuestion}>Lisää</Button> 
          </Row>
          <Row className="my-2">
            <SelectField {...createQuestionField} />
              <Button variant="primary" size="sm" onClick={createQuestion}>Luo kysymys</Button> 
          </Row>

          </Card.Body>
        </Card>
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
              {!busy &&
                <Form className="align-items-center" onSubmit={saveFormData}>
                  <TextField {...nameField} />
                  <TextArea {...descriptionField} />
                  <h2>Kysymykset</h2>

                  <QuestionList />

                  <Form.Group controlId="submit" className="mb-0 mt-3">
                    <Button variant="primary" type="submit" disabled={!hasChanged} block>
                      <span>Tallenna lomake</span>
                    </Button>
                  </Form.Group>

                  <Alert show={message !== ""} variant={successful ? "success" : "danger"}>
                    {message}
                  </Alert>

                </Form>
              }
            </Card.Body>
          </Card>
        </Col>
        <Col sm="1"></Col>
      </Row>
    </Container>
  );
};

export default EditForm;