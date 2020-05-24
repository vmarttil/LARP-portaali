import React from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

const Main = () => {
  return (
    <div className="Main">
      <h1>LARP-portaali</h1>
      <p>LARP-portaali on verkkosovellus, joka tarjoaa liveroolipelien (LARP) järjestäjille ja osallistujille 
        helppokäyttöisen ja tarkoitusta varten suunnitellun ympäristön pelien ilmoittautumisten ja hahmojakojen 
        tekemiseen, tarkasteluun ja hallintaan.</p>
      <h2>Pelaajille</h2>
      <p>Sovellukseen pelaajina kirjautuneet käyttäjät voivat tarkastella avoinna olevia peli-ilmoituksia, 
        ilmoittautua peleihin, tarkastella omia ilmoittautumisiaan ja tallentaa profiiliinsa usein käytettyjä 
        ilmoittautumistietoja ilmoittautumislomakkeiden automaattista täyttämistä varten. </p>
      <h2>Pelinjärjestäjille</h2>
      <p>Pelinjärjestäjät voivat luoda pelilleen peli-ilmoituksen ja ilmoittautumislomakkeen käyttäen valmiita 
        mallipohjia ja apuvälineitä ja hallinnoida niitä sekä tarkastella pelin ilmoittautumisia ja niihin liittyviä 
        tilatotietoja. Lisäksi pelinjärjestäjät voivat syöttää sovellukseen ilmoittautumislomakkeen kysymyksiä 
        vastaavat profiilit pelin hahmoista ja käyttää sovelluksen hahmojakotyökaluja hahmojen ja ilmoittautumisten 
        yhteensopivuuden ja yhteensopivuudeltaan optimoitujen hahmojakojen laskemiseen määrittelemiensä parametrien 
        mukaisesti.</p>
        <Login />
        <Register />
    </div>
  );
}

const Login = () => {
  return (
      <Grid container direction="column" justify="flex-start" alignItems="center" spacing={2}>
        <Grid item>
          <TextField id="username" label="Käyttäjätunnus"/>
        </Grid>
        <Grid item>
          <TextField id="password" label="Salasana"/>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary">Kirjaudu sisään</Button>
        </Grid>
      </Grid>
  );
}

const Register = () => {
  return (
      <Grid container direction="column" justify="flex-start" alignItems="center" spacing={2}>
        <Grid item>
          <Button variant="contained" color="primary">Luo käyttäjätunnus</Button>
        </Grid>
      </Grid>
  );
}


export default Main;
