import React, { useState, useEffect } from "react";
import { Link, Redirect, useParams } from "react-router-dom";
import { Card, Button, Alert, Container, Row, Col, Table } from 'react-bootstrap';
import PersonService from "../services/person.service";
import GameService from "../services/game.service";
import FormService from "../services/form.service";
import { formatDateTime } from "../utils/formatters"
import { errorMessage } from "../utils/messages"
import { CheckCircleFill, XCircleFill } from 'react-bootstrap-icons';


const GameRegistrations = ({ currentUser }) => {

  const { game_id } = useParams();

  const [game, setGame] = useState([]);
  const [registrationList, setRegistrationList] = useState([]);
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage('');
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const fetchRegistrations = async () => {
    try {
      let gameResult = await GameService.getGame(game_id);
      setGame(gameResult.data.game);
      let registrationResult = await GameService.getGameRegistrations(game_id);
      setRegistrationList(registrationResult.data.registrations);
    } catch (error) {
      setMessage(errorMessage(error));
    };
  };

  const RegistrationTable = ({ type }) => {
    return (
      <Table borderless id="registrations" size="sm" className="mt-3">
        <thead>
          <tr className="d-flex">
            <th className="col-9">Ilmoittautujan nimi</th>
            <th className="col-3">Lähetetty</th>
          </tr>
        </thead>
        <tbody>
          {registrationList.filter(reg => reg.form_class == type).map(reg => {
            return (
              <tr key={`form_${reg.form_id}_person_${reg.person_id}`} className="d-flex">
                <td className="col-9">
                  <Link to={`/game/${game_id}/registration/${reg.form_id}/${reg.person_id}`}>
                    {reg.name}
                  </Link>
                </td>
                <td className="col-3">{formatDateTime(reg.submitted)}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    )
  }

  return (
    <Container>
      <Row>
        <Col sm="12">
          <Card className="my-3">
            <Card.Body>
              <Card.Title>
                <h2>{game.name}</h2>
              </Card.Title>
              <Card.Text>
                {game.description}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col sm="1"></Col>
        <Col sm="10">

          {(registrationList.filter(reg => reg.form_class == "player").length > 0) &&
            <Card className="my-3">
              <Card.Body>
                <Card.Title>
                  <h3>Pelaajailmoittautumiset</h3>
                </Card.Title>
                <RegistrationTable type="player" />
              </Card.Body>
            </Card>
          }

          {(registrationList.filter(reg => reg.form_class == "npc").length > 0) &&
            <Card className="my-3">
              <Card.Body>
                <Card.Title>
                  <h3>NPC-ilmoittautumiset</h3>
                </Card.Title>
                <RegistrationTable type="npc" />
              </Card.Body>
            </Card>
          }

          {(registrationList.filter(reg => reg.form_class == "helper").length > 0) &&
            <Card className="my-3">
              <Card.Body>
                <Card.Title>
                  <h3>Avustajailmoittautumiset</h3>
                </Card.Title>
                <RegistrationTable type="helper" />
              </Card.Body>
            </Card>
          }

        </Col>
        <Col sm="1"></Col>
      </Row>
      <Row>
        <Col sm="1"></Col>
        <Col sm="10">
          <Alert show={message !== ""} variant={successful ? "success" : "danger"}>
            {message}
          </Alert>
        </Col>
        <Col sm="1"></Col>
      </Row>


      {!currentUser && (
        <Redirect to={{ pathname: '/' }} />
      )
      }

    </Container>
  );
};

export default GameRegistrations;