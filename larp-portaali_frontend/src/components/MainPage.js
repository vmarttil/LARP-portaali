import { concat } from "lodash";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Alert, Container, Row, Col, Table, Badge } from 'react-bootstrap';

import GameService from "../services/game.service";
import PersonService from "../services/person.service";
import { formatDateRange } from "../utils/formatters"
import { errorMessage } from "../utils/messages"


const MainPage = ({ currentUser }) => {

  const [gameList, setGameList] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchGames = async () => {
      try {
        let response = await GameService.getGameList();
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

  const GameTable = () => {
    return (
      <Table borderless id="games" size="sm" className="mt-3">
        <thead>
          <tr className="d-flex">
            <th className="col-7">Nimi</th>
            <th className="col-2">Ajankohta</th>
            <th className="col-3">Paikka</th>
          </tr>
        </thead>
        <tbody>
          {gameList.map(row => {
            return (
              <tr key={`game_${row.id}`} className="d-flex">
                <td className="col-7">
                  <Link to={`/game/${row.id}`}>
                    {row.name} 
                    {row.is_open && currentUser && <Badge variant="primary" className="ml-3">Ilmoittaudu!</Badge>}
                  </Link> 
                </td>
                <td className="col-2">{formatDateRange(row.start_date, row.end_date)}</td>
                <td className="col-3">{row.place}</td>
              </tr>)
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
                <h1>LARP-portaali</h1>
              </Card.Title>
              <Card.Text>
                LARP-portaali on verkkosovellus, joka tarjoaa liveroolipelien (LARP) järjestäjille ja osallistujille helppokäyttöisen ja
                tarkoitusta varten suunnitellun ympäristön pelien ilmoittautumisten ja hahmojakojen toteutukseen ja hallintaan. Sovellus
                tarjoaa peleihin liittyvän tiedon tarkasteluun ja käsittelyyn erilliset käyttöliittymät pelinjärjestäjille ja pelaajille.
                LARP-portaalin tämänhetkisessä versiossa elinjärjestäjän käyttöliittymän kautta on mahdollista tarkastella, määritellä, ja hallinnoida peliin liittyviä
                tietoja, kuten pelin julkisia tietoja, ilmoittautumislomaketta ja ilmoittautumisia. Pelaajan käyttöliittymän kautta on 
                mahdollista tarkastella tarjolla olevia pelejä ja niihin liittyviä julkisia tietoja sekä täyttää pelien 
                ilmoittautumislomakkeita ja tarkastella omia ilmoittautumisiaan.
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
                <h2>Tulevat pelit</h2>
              </Card.Title>
              <GameTable />

              <Alert show={message !== ""} variant="danger">
                {message}
              </Alert>
            </Card.Body>
          </Card>
        </Col>
        <Col sm="1"></Col>
      </Row>
    </Container>
  );
};

export default MainPage;