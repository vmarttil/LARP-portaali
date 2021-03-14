import React, { useState, useEffect } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { Card, Button, Alert, Container, Row, Col, Table } from 'react-bootstrap';
import PersonService from "../services/person.service";
import GameService from "../services/game.service";
import FormService from "../services/form.service";
import { formatDateRange, formatDateTime, truncateString } from "../utils/formatters"
import { errorMessage } from "../utils/messages"
import { CheckCircleFill, XCircleFill } from 'react-bootstrap-icons';


const PlayerPortal = ({ currentUser }) => {
  const history = useHistory();

  const [gameList, setGameList] = useState([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("error");
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
      let response = await PersonService.getPersonRegistrations();
      setGameList(response.data.games);
    } catch (error) {
      error.response.status == 404 ? setStatus("primary") : setStatus("danger");
      setMessage(errorMessage(error));
    };
  };

  const RegistrationList = () => {
    return (
      <>
        {gameList.map(game => {
          return (
            <Card className="my-3" key={`game_${game.id}`} id={`game_${game.id}`}>
              <Card.Body>
                <Card.Title><Link to={`/game/${game.id}`}>{game.name}</Link></Card.Title>
                <Card.Subtitle>{formatDateRange(game.start_date, game.end_date)}, {game.place} ({game.price} €)</Card.Subtitle>
                <Card.Text className="mt-3">
                  {game.description.length > 280 ? truncateString(game.description, 280) : game.description}
                  {game.description.length > 280 && <Link to={`/game/${game.id}`}>[Lue lisää]</Link>}
                </Card.Text>
                <ul>
                  {game.registrations.map(reg => {
                    return (
                      <li key={`form_${reg.form_id}_person_${reg.person_id}`}>
                        <Link to={`/game/${game.id}/registration/${reg.form_id}/${reg.person_id}`}>
                          <span className="font-weight-bold">
                            {reg.form_class == "player" && "Pelaajailmoittautuminen"}
                            {reg.form_class == "npc" && "NPC-ilmoittautuminen"}
                            {reg.form_class == "helper" && "Avustajailmoittautuminen"}
                          </span>
                        </Link> lähetetty {formatDateTime(reg.submitted)}
                      </li>
                    )
                  })}
                </ul>
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
                <h1>Omien ilmoittautumisten hallinta</h1>
              </Card.Title>
              <Card.Text>
                Tällä sivulla näet luettelon omista ilmoittautumistasi peleihin pelaajana, NPC:nä tai avustajana ja voit tarkastella
                ilmoittautumiseen antamiasi vastauksia.
          </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col sm="1"></Col>
        <Col sm="10">

          <RegistrationList />

          <Alert show={message !== ""} variant={status}>
            {message}
          </Alert>
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

      {redirect && (
        <Redirect to={redirect} />
      )
      }

    </Container>
  );
};

export default PlayerPortal;