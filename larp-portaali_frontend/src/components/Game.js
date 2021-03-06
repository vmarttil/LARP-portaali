import React, { useState, useEffect } from "react";
import { Card, Row, Col, Container, Spinner, Button } from 'react-bootstrap';
import { Link, useParams, useLocation } from "react-router-dom";
import UserService from "../services/user.service";
import GameService from "../services/game.service";
import { errorMessage } from "../utils/messages";
import { formatDateRange } from "../utils/formatters";

const Game = (props) => {

  const currentUser = UserService.getCurrentUser();
  const userId = currentUser.id;
  const [message, setMessage] = useState("");
  const [game, setGame] = useState(null);

  let { id } = useParams();

  useEffect(() => {
    const fetchGame = async () => {
      try {
        let response = await GameService.getGame(id);
        setGame(response.data.game);
      } catch (error) {
        setMessage(errorMessage(error));
      };
    };
    fetchGame();
  }, [id]);

  

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setMessage('');
  //   }, 3000);
  //   return () => clearTimeout(timer);
  // }, [message]);
  
  return (
    <>
      <Card style={{ width: "48rem" }}>
      {game ? (
        <>
        <Container fluid>
          <Row>
          <h2>{game.name}</h2>
          </Row>
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
              <ul class="list-unstyled">
                {game.organisers.map(org => <li>{org.name}</li>)}
              </ul>
              </Col>
          </Row>
          <Row>
            <Col sm="12">
            {game.description}
            </Col>
          </Row>
        </Container>
        </>
      ) : 
      <Spinner animation="border" role="status" />}
    </Card>
    <Container style={{ width: "48rem", padding: "0px" }}>
      <Link to={`/`}>
        <Button variant="primary" type="button" size="sm">Takaisin pääsivulle</Button>
      </Link>
    </Container>
    </>
  );
};

export default Game;