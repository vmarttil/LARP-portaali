import React, { useState, useEffect } from "react";
import { Card, Row, Col, Container, Spinner, Button, Alert } from 'react-bootstrap';
import { Link, useParams, useHistory } from "react-router-dom";
import GameService from "../services/game.service";
import PersonService from "../services/person.service";
import { errorMessage } from "../utils/messages";
import { formatDateRange } from "../utils/formatters";

const Game = ({ currentUser }) => {
  const history = useHistory();
  let { game_id } = useParams();

  const [successful, setSuccessful] = useState("");
  const [message, setMessage] = useState("");
  const [game, setGame] = useState(null);
  const [registrationStatuses, setRegistrationStatuses] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage('');
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    const fetchGame = async () => {
      setSuccessful(false);
      try {
        let response = await GameService.getGame(game_id);
        setGame(response.data.game);
        if (response.data.game.forms) {  
          let statuses = await PersonService.checkPersonRegistrations(response.data.game.forms.map(f => f.id));
          setRegistrationStatuses(statuses.data.registrations);
        }
        setSuccessful(true);

      } catch (error) {
        setSuccessful(false);
        setMessage(errorMessage(error));
      };
    };
    fetchGame();
  }, [game_id]);

  const RegistrationButtons = ({ game }) => {
    let openForms = game.forms.filter(form => form.is_open);
    return (
      <>
        {openForms.map(form => {
          if (registrationStatuses[form.id]) {
            return (
              <Link key={form.id} to={`/game/${game_id}/registration/${form.id}/${currentUser.id}`} className="mx-3 mt-3 mb-1">
                <Button key={form.id} variant="primary" type="button" size="sm">
                  {form.form_class === "player" && "Tarkastele pelaajailmoittautumistasi"}
                  {form.form_class === "npc" && "Tarkastele NPC-ilmoittautumistasi"}
                  {form.form_class === "helper" && "Tarkastele avustajailmoittautumistasi"}
                </Button>
              </Link>
            )
          } else {
            return (
              <Link key={form.id} to={`/game/${game_id}/form/${form.id}/register`} className="mx-3 mt-3 mb-1">
                <Button key={form.id} variant="primary" type="button" size="sm">
                  {form.form_class === "player" && "Ilmoittaudu pelaajaksi"}
                  {form.form_class === "npc" && "Ilmoittaudu NPC-rooliin"}
                  {form.form_class === "helper" && "Ilmoittaudu avustajaksi"}
                </Button>
              </Link>
            )
          }
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
            {game ? (
              <Card.Body>
                <Card.Title>
                  <h2>{game.name}</h2>
                </Card.Title>
                <Row>
                  <Col sm="2"><span>Ajankohta: </span></Col>
                  <Col sm="10">{formatDateRange(game.start_date, game.end_date)}</Col>
                </Row>
                <Row>
                  <Col sm="2"><span>Paikka: </span></Col>
                  <Col sm="10">{game.place}</Col>
                </Row>
                <Row>
                  <Col sm="2"><span>Hinta: </span></Col>
                  <Col sm="10">{game.price} €</Col>
                </Row>
                <Row>
                  <Col sm="2"><span>Järjestäjät: </span></Col>
                  <Col sm="10">
                    <ul className="list-unstyled">
                      {game.organisers.map(org => <li key={org.id}>{org.name}</li>)}
                    </ul>
                  </Col>
                </Row>
                <Row>
                  <Col sm="12">
                    {game.description}
                  </Col>
                </Row>
                <Row>
                  {(currentUser && game.hasOwnProperty("forms") && game.forms != null && game.forms.filter(form => form.is_open) != null) &&
                    <RegistrationButtons game={game} />
                  }
                </Row>
                <Alert show={message !== ""} variant={successful ? "success" : "danger"}>
                  {message}
                </Alert>
              </Card.Body>
            ) :
              <Spinner animation="border" role="status" />}
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

export default Game;