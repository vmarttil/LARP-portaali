import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { Card, Button, Alert, Container, Row, Col, Table } from 'react-bootstrap';

import GameService from "../services/game.service";
import FormService from "../services/form.service";
import { formatDateRange } from "../utils/formatters"
import { errorMessage } from "../utils/messages"
import { CheckCircleFill, XCircleFill } from 'react-bootstrap-icons';


const OrganiserPortal = (props) => {

  const [gameList, setGameList] = useState([]);
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage('');
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const fetchGames = async () => {
    try {
      let response = await GameService.getOrganiserGames();
      setGameList(response.data.games);
    } catch (error) {
      setMessage(errorMessage(error));
    };
  };

  const createNewForm = async (e) => {
    let game_id = e.currentTarget.parentNode.parentNode.parentNode.id.split("_")[1]
    let form_game = gameList.find(game => game.id == game_id);
    let formData = {
      game_id: form_game.id,
      name: form_game.name + ": Ilmoittautuminen",
      description: "Tämä on " + formatDateRange(form_game.start_date, form_game.end_date) + " pidettävää " + form_game.name + " -larppia varten luotu ilmoittautumislomake.",
      form_class: "player"
    }
    try {
      let response = await FormService.createForm(formData);
      let formId = response.data.form_id;
      let redirectPath = "/game/" + form_game.id + "/form/" + formId + "/edit"
      setRedirect(redirectPath)
    } catch (error) {
      setMessage(errorMessage(error));
    }
  };

  const toggleRegistration = async (e) => {
    setSuccessful(false);
    let formId = e.target.value;
    try {
      await FormService.toggleRegistration(formId);
      await fetchGames();
      setSuccessful(true);
    } catch (error) {
      setMessage(errorMessage(error));
    }
  };

  const GameList = () => {
    return (
      <>
        {gameList.map(game => {
          return (
            <Card className="my-3" key={game.id} id={`game_${game.id}`}>
              <Card.Body>
                <Card.Title>{game.name}</Card.Title>
                <Card.Subtitle>{formatDateRange(game.start_date, game.end_date)}, {game.place} ({game.price} €)</Card.Subtitle>
                <Card.Text className="mt-3">
                  {game.description}
                </Card.Text>
                <Row className="m-0">
                  <Link to={`/game/${game.id}/edit`}>
                    <Button variant="primary" role="button" size="sm" className="mr-1">Muokkaa tietoja</Button>
                  </Link>
                  <Button variant="primary" role="button" size="sm" className="mx-1" onClick={createNewForm}>Luo uusi lomake</Button>
                </Row>
                <Table borderless size="sm" className="mt-3">
                  <thead>
                    <tr className="d-flex">
                      <th className="col-7">Lomake</th>
                      <th className="d-flex col-1 justify-content-center">Ilm. #</th>
                      <th className="col-4"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {game.forms.map(form => {
                      return (
                        <tr key={form.id} className="d-flex align-items-center">
                          <td className="col-7">
                            {form.is_open ? (<><CheckCircleFill className="text-success mb-1"/> {form.name}</>) : (<><XCircleFill className="text-danger mb-1"/> <span className="text-muted">{form.name}</span></>)}
                            </td>
                          <td className="d-flex col-1 justify-content-center">{form.registrations}</td>
                          <td className="d-flex col-4 justify-content-end">
                            <Link to={`/game/${game.id}/form/${form.id}/edit`}>
                              <Button role="button" variant="primary" size="sm" className="mx-1">Muokkaa</Button>
                            </Link>
                            <Button role="button" variant="primary" size="sm" onClick={toggleRegistration} className="mx-1" value={form.id}>
                              {form.is_open ? "Sulje ilmoittautuminen" : "Avaa ilmoittautuminen"}
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>)
        })}
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
                <h1>Omien pelien hallinta</h1>
              </Card.Title>
              <Card.Text>
                Tällä sivulla näet luettelon peleistä, joissa olet järjestäjänä, ja voit muokata niiden tietoja, hallinnoida niiden
                ilmoittautumislomakkeita ja muita asetuksia. Pääset tarkastelemaan pelin tietoja ja siihen tehtyjä ilmoittautumisia
                valitsemalla pelin nimen luettelosta.
          </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col sm="1"></Col>
        <Col sm="10">
          <GameList />
          <Alert show={message !== ""} variant={successful ? "success" : "danger"}>
            {message}
          </Alert>
        </Col>
        <Col sm="1"></Col>
      </Row>

      {redirect && (
        <Redirect to={redirect} />
      )
      }
    </Container>
  );
};

export default OrganiserPortal;