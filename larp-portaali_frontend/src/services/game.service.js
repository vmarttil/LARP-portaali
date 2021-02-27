import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/";

const getGameList = () => {
  return axios.get(API_URL + "gameList");
};

const getGame = (game_ID) => {
  let game =  axios.get(API_URL + "game/" + game_ID);
  console.log(game);
  return game;
};

let GameService = {
  getGameList,
  getGame
};

export default GameService;