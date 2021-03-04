import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/";

const getGameList = async () => {
  return await axios.get(API_URL + "gameList");
};

const getGame = async (gameId) => {
  let game =  await axios.get(API_URL + "game/" + gameId);
  return game;
};

const getOrganiserGames = async () => {
  let gameList = await axios.get(API_URL + "organiserGameList", { headers: authHeader() });
  return gameList;
};

const saveNewGame = async (gameData) => {
  return await axios.post(API_URL + "game", { data: gameData }, { headers: authHeader() });
};

const updateGame = async (gameId, gameData) => {
  return await axios.put(API_URL + "game/" + gameId, { data: gameData }, { headers: authHeader() });
};

const addOrganiser = async (gameId, organiserId) => {
  return await axios.post(API_URL + "game/" + gameId + "/addOrganiser", { data: {id : organiserId} }, { headers: authHeader() });
};

const removeOrganiser = async (gameId, organiserId) => {
  return await axios.post(API_URL + "game/" + gameId + "/removeOrganiser", { data: {id : organiserId} }, { headers: authHeader() });
};

const toggleRegistration = async (gameId) => {
  return await axios.put(API_URL + "game/" + gameId + "/toggle", { headers: authHeader() });
};

let GameService = {
  getGameList,
  getGame,
  getOrganiserGames,
  saveNewGame,
  updateGame,
  addOrganiser,
  removeOrganiser,
  toggleRegistration
};

export default GameService;