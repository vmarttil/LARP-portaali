import React, { useState, useEffect } from "react";
import { Card, Row, Col, Container, Spinner, Button } from 'react-bootstrap';
import { Link, useParams, useHistory } from "react-router-dom";
import GameService from "../services/game.service";
import PersonService from "../services/person.service";
import { errorMessage } from "../utils/messages";
import { formatDateRange } from "../utils/formatters";

const Game = ({ currentUser }) => {
  const history = useHistory();

  const [message, setMessage] = useState("");
  const [game, setGame] = useState(null);

  let { game_id } = useParams();

  useEffect(() => {
    const fetchGame = async () => {
      try {
        let response = await GameService.getGame(game_id);
        setGame(response.data.game);
      } catch (error) {
        setMessage(errorMessage(error));
      };
    };
    fetchGame();
  }, [game_id]);

  const RegistrationButtons = () => {
    let openForms = game.forms.filter(form => form.is_open)
    return (
      <>
        {openForms.map(form => {
          return (
            <Link key={form.id} to={`/game/${game_id}/form/${form.id}/register`} className="mx-3 mt-3 mb-1">
              <Button key={form.id} variant="primary" type="button" size="sm">{form.button_text}</Button>
            </Link>
          )
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
                {currentUser &&
                  <RegistrationButtons />
                }
                </Row>
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
          <Link to={`/`}>
            <Button variant="primary" type="button" size="sm">Takaisin pääsivulle</Button>
          </Link>
        </Col>
        <Col sm="1"></Col>
      </Row>
    </Container>
  );
};

export default Game;