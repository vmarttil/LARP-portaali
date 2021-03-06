import React, { useState, useEffect } from "react";
import { Card, Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import UserService from "../services/user.service";
import GameService from "../services/game.service";
import { useTextField, useTextArea, useDateField } from "../utils/hooks"
import { TextField, TextArea, DateField } from "./FormFields"
import { validateRequired, validateDate } from "../utils/validate"
import { errorMessage } from "../utils/messages";

const NewGame = (props) => {

  const [successful, setSuccessful] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [message, setMessage] = useState("");

  /* Fields for game data */
  const nameField = useTextField("name", "Pelin nimi:", "text", 128, validateRequired, "", ["horizontal_3-9"]);
  const startDateField = useDateField("start_date", "Alkuajankohta:", new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 1)), validateRequired, new Date(), ["horizontal_3-3", "partialRow"]);
  const endDateField = useDateField("end_date", "Loppuajankohta:", new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 1)), validateRequired, new Date(), ["horizontal_3-3", "partialRow"]);
  const placeField = useTextField("place", "Paikka:", "text", 64, validateRequired, "", ["horizontal_3-9"]);
  const priceField = useTextField("price", "Hinta:", "number", 4, validateRequired, "", ["horizontal_3-3", "currency"]);
  const descriptionField = useTextArea("description", "Pelin kuvaus:", 5000, validateRequired, "", [], 8);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage('');
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    if (startDateField.value > endDateField.value) {
      endDateField.onChange(startDateField.value);
    }
    endDateField.updateMinDate(startDateField.value);
  }, [startDateField.value]);

  const saveGameData = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessful(false);

    let gameData = {
      name: nameField.value,
      start_date: startDateField.value.toJSON(),
      end_date: endDateField.value.toJSON(),
      place: placeField.value,
      price: priceField.value,
      description: descriptionField.value
    };

    if (nameField.validate() &&
      startDateField.validate() &&
      endDateField.validate() &&
      placeField.validate() &&
      priceField.validate() &&
      descriptionField.validate()) {
      try {
        let response = await GameService.saveNewGame(gameData)
        setMessage(response.data.message);
        setSuccessful(true);
        setTimeout(() => setRedirect(true), 2000)

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

export default NewGame;