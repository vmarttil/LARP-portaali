import React, { useState, useEffect } from "react";
import { Card, Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { Redirect, useParams } from "react-router-dom";
import UserService from "../services/user.service";
import GameService from "../services/game.service";
import FormService from "../services/form.service";
import { useTextField, useTextArea } from "../utils/hooks"
import { TextField, TextArea } from "./FormFields"
import { validateRequired, validateDate } from "../utils/validate"
import { errorMessage } from "../utils/messages";
import { formatDateRange } from "../utils/formatters";
import { getQueriesForElement } from "@testing-library/react";

const EditForm = (props) => {

  let { game_id, form_id } = useParams();
  
  const [successful, setSuccessful] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [message, setMessage] = useState("");
  
  const [formId, setFormId] = useState(false);
  const [availableQuestions, setAvailableQuestions] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [isOpen, setOpen] = useState(false);
  

  /* Fields for form data */
  const nameField = useTextField("name", "Lomakkeen nimi:", "text", 64, validateRequired, "", ["horizontal_3-9"]);
  const descriptionField = useTextArea("description", "Lomakkeen kuvaus:", 256, validateRequired, "", ["horizontal_3-9"], 3);

  useEffect(() => {
    const createNewForm = async () => {
      try {
        let gameResponse = await GameService.getGame(game_id);
        let game = gameResponse.data.game;
        let formData = {
          game_id: game_id,
          name: game.name + ": Ilmoittautuminen",
          description: "Tämä on " + formatDateRange(game.start_date, game.end_date) + " pidettävää " + game.name + " -larppia varten luotu ilmoittautumislomake."
        }
        let response = await FormService.createNewForm(formData);
        return response.data;
      } catch (error) {
        setMessage(errorMessage(error));
      };
    };

    const getEditForm = async (form_id) => {
      try {
        let response = await FormService.editForm(form_id);
        return response.data;
      } catch (error) {
        setMessage(errorMessage(error));
      };
    };

    let formData = null;
    if (form_id === 0) {
      formData = createNewForm();
    } else {
      formData = getEditForm(form_id);
    }
    let questionList = formData.form.questions.sort((a, b) => a.position - b.position);
    let availableQuestions = formData.available_questions;    
    let selectAvailableQuestion = (qid) => availableQuestions.find(q => q.question_id === qid)
    let questions = questionList.map((question) => selectAvailableQuestion(question.id));
    console.log(questions);
        
    nameField.setValue(formData.form.name);
    descriptionField.setValue(formData.form.description);
    setFormId(formData.form.form_id);
    setAvailableQuestions(availableQuestions);
    setQuestions(questions);
    setOpen(formData.form.is_open);
  }, [game_id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage('');
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);


  const saveGameData = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessful(false);

    let formData = {
      game_id: game_id,
      form_id: formId,
      name: nameField.value,
      description: descriptionField.value
    };
    let questionList = questions.map((q, index) => {
      return {question_id: q.question_id, position: (index + 1)}
    });
    formData.questions = questionList;

    if (nameField.validate() &&
      descriptionField.validate()) {
      try {
        let response = await FormService.updateForm(formData)
        setMessage(response.data.message);
        setSuccessful(true);

      } catch (error) {
        setMessage(errorMessage(error));
        setSuccessful(false);
      }
    } else {
      setMessage("Täytä puuttuvat tiedot.")
    };
  };


  return (
    <Container>
      <Row>
        <Col sm="12">
          <Card className="my-3">
            <Card.Body>
              <Card.Title>
                <h1>Uuden pelin luonti</h1>
              </Card.Title>
              <Card.Text>
                Tällä sivulla voit syöttää perustiedot pelistä, jolle haluat luoda ilmoittautumislomakkeen. Kun olet 
                tallentanut pelin tiedot, peli näkyy omien peliesi hallintasivulla, jossa voit muokata sen tietoja, luoda 
                sille ilmoittautumislomakkeen, avata ilmoittautumisen ja tarkastella siihen tehtyjä ilmoittautumisia. Pelin 
                järjestäjäksi merkitään sen luonut henkilö, mutta voit lisätä pelin tietoihin muita järjestäjiä pelin 
                tietojen muokkaussivulla ja halutessasi myös poistaa itsesi järjestäjien joukosta (kunhan pelille jää 
                vähintään yksi järjestäjä). Kun olet tallentanut pelin, se näkyy myös tulevien pelien luettelossa ja muut 
                käyttäjät voivat tarkastella sen tietoja. 
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
                <h2>Pelin tiedot</h2>
              </Card.Title>

              <Form className="align-items-center" onSubmit={saveGameData}>

                <TextField {...nameField} />
                <Row className="my-2">
                  <DateField {...startDateField} />
                  <DateField {...endDateField} />
                </Row>
                <TextField {...placeField} />
                <TextField {...priceField} />
                <TextArea {...descriptionField} />

                <Form.Group controlId="submit">
                  <Button variant="primary" type="submit" block>
                    <span>Tallenna uusi peli</span>
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

      {redirect && (
        <Redirect to={{ pathname: '/portal/organiser' }} />
      )
      }
    </Container>
  );
};

export default EditForm;