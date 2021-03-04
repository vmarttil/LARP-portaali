import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Alert, Row, Col, Modal } from 'react-bootstrap';
import { Redirect, useParams } from "react-router-dom";
import UserService from "../services/user.service";
import GameService from "../services/game.service";
import { useTextField, useTextArea, useDateField } from "../utils/hooks"
import { TextField, TextArea, DateField } from "./FormFields"
import { validateRequired, noValidate } from "../utils/validate"
import { errorMessage } from "../utils/messages";
import { XSquare, PlusSquare } from 'react-bootstrap-icons';

const EditGame = (props) => {

  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [isBusy, setBusy] = useState(true);
  const [organisers, setOrganisers] = useState([]);
  const [newOrganiserEmail, setNewOrganiserEmail] = useState("");
  const [newOrganiser, setNewOrganiser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  let { id } = useParams();

  /* Fields for game data */
  const nameField = useTextField("name", "Pelin nimi:", "text", 128, validateRequired, "", ["horizontal_3-9"]);
  const startDateField = useDateField("start_date", "Alkuajankohta:", new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 1)), validateRequired, new Date(), ["horizontal_3-3", "partialRow"]);
  const endDateField = useDateField("end_date", "Loppuajankohta:", new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 1)), validateRequired, new Date(), ["horizontal_3-3", "partialRow"]);
  const placeField = useTextField("place", "Paikka:", "text", 64, validateRequired, "", ["horizontal_3-9"]);
  const descriptionField = useTextArea("description", "Pelin kuvaus:", 5000, validateRequired, "", [], 8);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        let response = await GameService.getGame(id);
        let game = response.data.game;
        nameField.setValue(game.name);
        startDateField.setValue(new Date(game.start_date));
        endDateField.setValue(new Date(game.end_date));
        placeField.setValue(game.place);
        descriptionField.setValue(game.description);
        setOrganisers(game.organisers);
        setBusy(false);
      } catch (error) {
        setMessage(errorMessage(error));
        setBusy(false);
      };
    };
    fetchGame();
  }, []);

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


  const removeOrganiser = async (e) => {
    let organiserId = e.currentTarget.parentNode.id;
    setMessage("");
    setSuccessful(false);
    try {
      let response = await GameService.removeOrganiser(id, organiserId);
      setOrganisers(organisers.filter(org => org.id !== parseInt(organiserId)));
      setSuccessful(true);
      setMessage(response.data.message);

      if (parseInt(organiserId) === UserService.getCurrentUser().id) {
        setTimeout(() => setRedirect(true), 2000)
      }
    } catch (error) {
      setMessage(errorMessage(error));
      setSuccessful(false);
    }
  };

  const openModal = () => {
    setMessage("");
    setNewOrganiserEmail("");
    setNewOrganiser(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setMessage("");
    setNewOrganiserEmail("");
    setNewOrganiser(null);
    setShowModal(false);
  };

  const findPerson = async () => {
    setMessage("");
    try {
      let response = await UserService.findPerson(newOrganiserEmail);
      setNewOrganiser(response.data.person);
      setSuccessful(true);
    } catch (error) {
      setNewOrganiser(null);
      setMessage(errorMessage(error));
      setSuccessful(false);
    }
  };

  const addOrganiser = async (e) => {
    setMessage("");
    try {
      let response = await GameService.addOrganiser(id, newOrganiser.id);
      setShowModal(false);
      setSuccessful(true);
      setOrganisers([...organisers, newOrganiser]);
      setMessage(response.data.message);
    } catch (error) {
      setShowModal(false);
      setMessage(errorMessage(error));
      setSuccessful(false);
    }
  };


  const saveGameData = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessful(false);

    let gameData = {
      name: nameField.value,
      start_date: startDateField.value.toJSON(),
      end_date: endDateField.value.toJSON(),
      place: placeField.value,
      description: descriptionField.value
    };

    if (nameField.validate() &&
      startDateField.validate() &&
      endDateField.validate() &&
      placeField.validate() &&
      descriptionField.validate()) {
      try {
        let response = await GameService.updateGame(id, gameData)
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
    (!isBusy &&
      <>
        <Container>
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
                    <TextArea {...descriptionField} />

                    <Form.Group controlId="submit">
                      <Button variant="primary" type="submit" block>
                        <span>Päivitä pelin tiedot</span> 
                      </Button>
                    </Form.Group>

                    <Row>
                      <Col sm="2"><span>Järjestäjät: </span></Col>
                      <Col sm="10">
                        <ul className="list-unstyled">
                          {organisers.map(org => <li key={org.id} id={org.id}>{org.name}&nbsp;&nbsp;<a href="#" onClick={removeOrganiser}><XSquare className="align-text-top" /></a></li>)}
                          <li>
                            <a href="#" onClick={openModal}><PlusSquare className="align-text-top" /></a>
                          </li>
                        </ul>
                      </Col>
                    </Row>

                    <Alert show={message !== ""} variant={successful ? "success" : "danger"}>
                      {message}
                    </Alert>

                  </Form>
                </Card.Body>
              </Card>

              <Modal show={showModal} onHide={closeModal} animation={false} centered>
                <Modal.Header closeButton>
                  <Modal.Title>Lisää järjestäjä</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>Anna järjestäjäksi lisättävän henkilön sähköpostiosoite:</p>
                  <Form onSubmit={findPerson}>
                    <Row>
                      <Col sm="10">
                        <Form.Control type="text" value={newOrganiserEmail} onChange={(e) => { setNewOrganiserEmail(e.target.value) }} />
                      </Col>
                      <Col sm="2">
                        <Button variant="secondary" type="submit">Hae</Button>
                      </Col>
                    </Row>
                  </Form>
                  <Alert show={message !== ""} variant={successful ? "success" : "danger"} className="mt-4">
                    {message}
                  </Alert>
                  {(newOrganiser &&
                    <Alert variant={successful ? "success" : "danger"} className="text-center mt-4">
                      <span className="lead">{newOrganiser.name}</span>
                    </Alert>)}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={closeModal}>Peruuta</Button>
                  <Button variant="primary" onClick={addOrganiser} disabled={!newOrganiser}>Lisää järjestäjäksi</Button>
                </Modal.Footer>
              </Modal>

              {redirect && (
                <Redirect to={{ pathname: '/portal/organiser' }} />
              )
              }
            </Col>
            <Col sm="1"></Col>
          </Row>
        </Container>
      </>)
  );
};

export default EditGame;