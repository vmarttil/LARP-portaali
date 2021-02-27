import { concat } from "lodash";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Card, Button, Alert, Jumbotron } from 'react-bootstrap';

import GameService from "../services/game.service";
import { formatDateRange } from "../utils/formatters"
import { errorMessage } from "../utils/messages"


const MainPage = (props) => {
  const [gameList, setGameList] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchGames = async () => {
      let response = await GameService.getGameList();
      try {
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
    return  (
      <table id="games">
        <thead>
          <tr>
            <th>Nimi</th>
            <th>Ajankohta</th>
            <th>Paikka</th>
          </tr>
          </thead>
          <tbody>
          {gameList.map(row => {
            return (
            <tr key={`game_${row.id}`} >
              <td>
                <Link to={`/game/${row.id}`}>
                  {row.name}
                </Link>
              </td>
              <td>{formatDateRange(row.start_date, row.end_date)}</td>
              <td>{row.place}</td>
            </tr>)
          })}
        </tbody>
      </table>
    )
  }

  return (
    <>
        <h1>LARP-portaali</h1>
        <p>LARP-portaali on verkkosovellus, joka tarjoaa liveroolipelien (LARP) järjestäjille ja osallistujille helppokäyttöisen ja 
          tarkoitusta varten suunnitellun ympäristön pelien ilmoittautumisten ja hahmojakojen toteutukseen ja hallintaan. Sovellus 
          tarjoaa peleihin liittyvän tiedon tarkasteluun ja käsittelyyn erilliset käyttöliittymät pelinjärjestäjille ja pelaajille. 
          Pelinjärjestäjän käyttöliittymän kautta on mahdollista tarkastella, määritellä, laskea ja hallinnoida peliin liittyviä 
          tietoja, kuten pelin julkisia tietoja, sen hahmoprofiileja, ilmoittautumislomaketta, ilmoittautumisia ja hahmojakoon 
          liittyviä tilastotietoja. Pelaajan käyttöliittymän kautta on mahdollista tarkastella tarjolla olevia pelejä ja niihin 
          liittyviä julkisia tietoja sekä täyttää pelien ilmoittautumislomakkeita ja tarkastella ilmoittautumiseen liittyviä 
          tilannetietoja.</p>
      <Card style={{ width: "48rem" }}>
        <h2>Avoimet pelit</h2>
        <GameTable />
        
        <Alert show={message !== ""} variant="danger">
            {message}
          </Alert>
      </Card>
    </>
  );
};

export default MainPage;