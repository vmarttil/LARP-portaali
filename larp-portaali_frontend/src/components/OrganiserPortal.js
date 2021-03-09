import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { Card, Button, Alert, Container, Row, Col } from 'react-bootstrap';

import GameService from "../services/game.service";
import FormService from "../services/form.service";
import { formatDateRange } from "../utils/formatters"
import { errorMessage } from "../utils/messages"


const OrganiserPortal = (props) => {

  const [gameList, setGameList] = useState([]);
  const [message, setMessage] = useState("");
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        let response = await GameService.getOrganiserGames();
        setGameList(response.data.games);
      } catch (error) {
        setMessage(errorMessage(error));
      };
    };
    fetchGames();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage('');
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const toggleRegistration = async (event) => {
    let index = gameList.map(game => game.id).indexOf(parseInt(event.target.value));
    try {
      let response = await GameService.toggleRegistration(event.target.value);
      let newGameList = [...gameList];
      let newGame = { ...newGameList[index] };
      newGame.is_open = response.data.is_open;
      newGameList[index] = newGame;
      setGameList(newGameList);
    } catch (error) {
      setMessage(errorMessage(error));
    }
  };

  const createNewForm = async (e) => {
    let game_id = e.currentTarget.parentNode.parentNode.id.split("_")[1]
    console.log(game_id);
    console.log(gameList);
    let form_game = gameList.find(game => game.id == game_id);
    console.log(form_game);
    let formData = {
      game_id: form_game.id,
      name: form_game.name + ": Ilmoittautuminen",
      description: "Tämä on " + formatDateRange(form_game.start_date, form_game.end_date) + " pidettävää " + form_game.name + " -larppia varten luotu ilmoittautumislomake."
    }
    let response = await FormService.createForm(formData);
    let formId = response.data.form_id;
    let redirectPath = "/game/" + form_game.id + "/form/" + formId + "/edit"
    console.log(redirectPath)
    setRedirect(redirectPath)
    console.log(redirect)
  };

  const GameList = () => {
    return (
      <>
        {gameList.map(row => {
          return (
            <Card className="my-3" key={row.id} id={`game_${row.id}`}>
              <Card.Body>
                <Card.Title>{row.name}</Card.Title>
                <Card.Subtitle>{formatDateRange(row.start_date, row.end_date)}, {row.place} ({row.price} €)</Card.Subtitle>
                <Card.Text className="mt-3">
                  {row.description}
                </Card.Text>

                <Link to={`/game/${row.id}/edit`}>
                  <Button variant="primary" role="button" size="sm" className="mr-1">Muokkaa tietoja</Button>
                </Link>
                {!row.form_id && (
                  <Button variant="primary" role="button" size="sm" className="mx-1" onClick={createNewForm}>Luo lomake</Button>
                )}
                {(row.form_id && !row.open && row.registrations === 0) && (
                  <Link to={`/game/${row.id}/editForm`}>
                    <Button variant="primary" role="button" size="sm" className="mx-1">Muokkaa lomaketta</Button>
                  </Link>
                )}
                {(row.form_id) &&
                  <Button variant="primary" role="button" size="sm" className="mx-1" onClick={toggleRegistration} value={row.id}>
                    {row.open ? "Sulje ilmoittautuminen" : "Avaa ilmoittautuminen"}
                  </Button>
                }
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
          <Alert show={message !== ""} variant="danger">
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