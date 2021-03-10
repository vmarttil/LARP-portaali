import React, { useState, useEffect } from "react";
import { Card, Form, Button, Alert, Container, Row, Col, Modal } from 'react-bootstrap';
import { Redirect, useParams } from "react-router-dom";
import FormService from "../services/form.service";
import { useTextField, useTextArea, useSelectField, useRadioField } from "../utils/hooks"
import { TextField, TextArea, DummyField, SelectField, RadioField } from "./FormFields"
import { validateRequired, noValidate } from "../utils/validate"
import { errorMessage } from "../utils/messages";
import { Trash, PencilSquare, PlusSquare, XSquare } from 'react-bootstrap-icons';
import "../css/Button.css";


const EditForm = (props) => {

  const { game_id, form_id } = useParams();

  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [hasChanged, setHasChanged] = useState(false);
  const [formId, setFormId] = useState(null);
  const [formClasses, setFormClasses] = useState({});
  const [questionTypes, setQuestionTypes] = useState({});
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [addableQuestions, setAddableQuestions] = useState({});
  const [questions, setQuestions] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [busy, setBusy] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editQuestion, setEditQuestion] = useState({});
  const [newOptionText, setNewOptionText] = useState("");
  const [editQuestionOptions, setEditQuestionOptions] = useState([]);

  /* Fields for form data */
  const nameField = useTextField("name", "Lomakkeen nimi:", "text", 64, validateRequired, "", ["horizontal_3-9"]);
  const descriptionField = useTextArea("description", "Lomakkeen kuvaus:", 256, validateRequired, "", ["horizontal_3-9"], 4);
  const formClassField = useRadioField("form_class", "Ilmoittautumisen tyyppi:", true, formClasses, null, ["horizontal_3-9"]);
  const addQuestionField = useSelectField("addQuestion", "Valmiit kysymykset:", false, addableQuestions, "Valitse...", ["horizontal_3-7", "partialRow", "size_sm"]);
  /* Fields for the question creating/editing modal */
  const questionTypeField = useSelectField("createQuestion", "Kysymystyyppi:", true, questionTypes, "Valitse...", ["horizontal_3-3"]);
  const questionTextField = useTextArea("question_text", "Kysymysteksti:", 0, validateRequired, "", ["horizontal_3-9"], 2);
  const questionDescriptionField = useTextArea("question_description", "Kysymyksen tarkennus:", 0, noValidate, "", ["horizontal_3-9"], 4);

  useEffect(() => {
    fetchForm();
    setBusy(false);
  }, [form_id]);

  useEffect(() => {
    let selectItems = {};
    for (const question of availableQuestions) {
      selectItems[question.question_id] = questionTypes[question.question_type] + ": " + question.question_text;
    }
    setAddableQuestions(selectItems);
  }, [availableQuestions]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage('');
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    setHasChanged(true);
  }, [questions, nameField.value, descriptionField.value, formClassField.value]
  )

  const fetchForm = async () => {
    try {
      let response = await FormService.editForm(form_id);
      let formData = response.data;
      let questions = formData.form.questions.sort((a, b) => a.position - b.position);
      questions = questions.map(({ position, ...others }) => others)

      let questionTypeList = response.data.types.map(type => [type.name, type.display_text]);
      let questionTypes = Object.fromEntries(questionTypeList);
      setQuestionTypes(questionTypes);

      let formClassList = response.data.form_classes.map(c => [c.name, c.button_text]);
      let formClasses = Object.fromEntries(formClassList);
      setFormClasses(formClasses);

      nameField.setValue(formData.form.name);
      descriptionField.setValue(formData.form.description);
      formClassField.setValue(formData.form.form_class);
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
      if (!question_id.includes("new_")) {
        let newAvailableQuestions = [...availableQuestions];
        newAvailableQuestions.push(question);
        newAvailableQuestions.sort(((a, b) => a.question_id - b.question_id))
        setAvailableQuestions(newAvailableQuestions);
      }
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

  const openModal = (e) => {
    let blankQuestion = {
      question_id: e.target.value,
      question_type: 0,
      question_text: "",
      description: "",
      is_optional: true,
      prefill_tag: null,
    }

    let editedQuestion = questions.find(q => q.question_id == e.currentTarget.value) ?? blankQuestion;
    setEditQuestion({ ...editedQuestion });

    questionTypeField.setValue(editedQuestion.question_type);
    questionTextField.setValue(editedQuestion.question_text);
    questionDescriptionField.setValue(editedQuestion.description);
    if (editedQuestion.question_type === "radio" || editedQuestion.question_type === "checkbox") {
      setEditQuestionOptions(editedQuestion.options.map(o => o.text));
    } else {
      setEditQuestionOptions([]);
    }
    setShowModal(true);
  };

  const createNewQuestionId = () => {
    let createdQuestions = questions.filter(q => q.question_id.toString().includes("new_"));
    let maxId = Math.max(createdQuestions.map(q => parseInt(q.question_id.split("_")[1])));
    return "new_".concat(maxId + 1);
  };

  const removeOption = (e) => {
    let optionIndex = e.currentTarget.value;
    let newOptions = [...editQuestionOptions];
    newOptions.splice(optionIndex, 1);
    setEditQuestionOptions(newOptions);
  };

  const onNewOptionTextChange = (e) => {
    setNewOptionText(e.target.value);
  };

  const addOption = () => {
    let newOptions = [...editQuestionOptions];
    newOptions.push(newOptionText);
    setEditQuestionOptions(newOptions);
    setNewOptionText("");
  };

  const closeModal = () => {
    questionTypeField.setValue(0);
    questionTextField.setValue("");
    questionDescriptionField.setValue("");
    setNewOptionText("");
    setEditQuestion({});
    setShowModal(false);
  };

  const saveQuestion = () => {
    setSuccessful(false);
    if (!questionTypeField.validate() ||
      !questionTextField.validate() ||
      !questionDescriptionField.validate()) {
      setMessage("Täytä puuttuvat tiedot.")
    } else if ((questionTypeField.value == "radio" || questionTypeField.value == "checkbox") && editQuestionOptions.length < 2) {
      setMessage("Määritä vähintään kaksi valintaa.")
    } else {
      let newQuestion = {
        question_id: editQuestion.question_id,
        question_type: questionTypeField.value,
        question_text: questionTextField.value,
        description: questionDescriptionField.value,
        is_optional: true,
        prefill_tag: null
      };
      if (questionTypeField.value == "radio" || questionTypeField.value == "checkbox") {
        let optionList = editQuestionOptions.map((option, index) => ({ number: index, text: option }));
        newQuestion.options = optionList;
      }
      let newQuestions = [...questions]

      let questionIndex = questions.findIndex(q => q.question_id == newQuestion.question_id);
      if (questionIndex >= 0) {
        newQuestions.splice(questionIndex, 1, newQuestion);
      } else {
        newQuestions.push(newQuestion);
      }
      setQuestions(newQuestions);
      setSuccessful(true);
      closeModal();
    }
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
      descriptionField.validate() &&
      formClassField.validate()) {
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
      <>
      <div>
        {questions.map((question, index) => {
          return (
            <Card key={question.question_id} className="mx-0 my-3 p-0">
              <Card.Header className="d-flex justify-content-end p-1">
                <Button variant="outline-dark" size="xs" onClick={openModal} disabled={!question.is_optional} value={question.question_id}><PencilSquare className="lead mx-1" /></Button>
                <Button variant="outline-dark" size="xs" onClick={removeQuestion} disabled={!question.is_optional} value={question.question_id}><Trash className="lead mx-1" /></Button>
              </Card.Header>
              <Card.Body className="p-2">
                <DummyField type={question.question_type} text={question.question_text} description={question.description} options={question.options ? question.options : []} />
              </Card.Body>

            </Card>
          )
        })}
      </div>
        <Card className="mx-0 my-3 p-0">
          <Card.Header className="py-1 px-2 lead align-items-center"><PlusSquare className="mb-1 mr-1" /> Lisää kysymys</Card.Header>
          <Card.Body className="p-2">

            <Row className="my-2">
              <SelectField {...addQuestionField} />
              <Col sm={2}>
                <Button variant="primary" size="sm" onClick={addQuestion} className="w-100">Lisää</Button>
              </Col>
            </Row>
            <Row className="my-2">
              <Col sm={12}>
                <Button variant="primary" block size="sm" onClick={openModal} value={createNewQuestionId()}>Luo uusi kysymys</Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

      </>
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
                  <RadioField {...formClassField} />
                  <h2>Kysymykset</h2>

                  <QuestionList />

                  <Form.Group controlId="submit" className="mb-0 mt-3">
                    <Button variant="primary" type="submit" disabled={!hasChanged} className="mb-2 mt-4" size="lg" block>
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

      <Modal show={showModal} onHide={closeModal} animation={false} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Luo uusi kysymys</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <SelectField {...questionTypeField} />
            <TextArea {...questionTextField} />
            <TextArea {...questionDescriptionField} />
            {(questionTypeField.value == "radio" || questionTypeField.value == "checkbox") ? (
              <Row className="my-2">
                <Col sm={3}>
                  <Form.Label>Valinnat: </Form.Label>
                </Col>
                <Col sm={9}>
                  <ul className="list-unstyled">
                    {editQuestionOptions.map((option, index) => {
                      return (
                        <li key={`${editQuestion.question_id}_${index}`}>
                          <Form.Check type="radio" id={`${editQuestion.id}_${index}`} disabled>
                            <Form.Check.Input type="radio" disabled />
                            <Form.Check.Label className="text-dark">{option}</Form.Check.Label>
                            <Button variant="link" size="xs" value={index} onClick={removeOption} className="ml-2"><XSquare className="lead mx-1 mb-1" /></Button>
                          </Form.Check>
                        </li>
                      )
                    })}
                    <li>
                      <Row>
                        <Col sm={9} className="pl-1">
                          <Form.Control
                            id="newOptionText"
                            type="text"
                            value={newOptionText}
                            onChange={onNewOptionTextChange}
                            size="sm" />
                        </Col>
                        <Col sm={2}>
                          <Button variant="primary" onClick={addOption} size="sm" className="w-100">Lisää</Button>
                        </Col>
                      </Row>
                    </li>
                  </ul>
                </Col>
              </Row>)
              :
              <></>
            }
          </Form>

          <Alert show={message !== ""} variant={successful ? "success" : "danger"} className="mt-4">
            {message}
          </Alert>

        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Peruuta</Button>
          <Button variant="primary" onClick={saveQuestion} disabled={!questionTypeField.validate ||
            !questionTextField.validate ||
            !questionDescriptionField.validate}>
            {editQuestion.question_id == 0 ? "Lisää kysymys" : "Tallenna kysymys"}
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default EditForm;