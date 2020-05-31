import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/test/";

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const getPlayerPortal = () => {
  return axios.get(API_URL + "player", { headers: authHeader() });
};

const getOrganiserPortal = () => {
  return axios.get(API_URL + "organiser", { headers: authHeader() });
};

const getAdminPortal = () => {
  return axios.get(API_URL + "admin", { headers: authHeader() });
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export default {
  getPublicContent,
  getPlayerPortal,
  getOrganiserPortal,
  getAdminPortal,
  getCurrentUser
};