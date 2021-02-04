import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/";

const getMainPage = () => {
  return axios.get(API_URL + "mainPage");
};

const getPlayerPortal = () => {
  return axios.get(API_URL + "portal/player", { headers: authHeader() });
};

const getOrganiserPortal = () => {
  return axios.get(API_URL + "portal/organiser", { headers: authHeader() });
};

const getAdminPortal = () => {
  return axios.get(API_URL + "portal/admin", { headers: authHeader() });
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};


const saveUserProfile = (userProfileData) => {
  return axios.put(API_URL + "profile", {headers: authHeader(), data: userProfileData });
};

let UserService = {
  getMainPage,
  getPlayerPortal,
  getOrganiserPortal,
  getAdminPortal,
  getCurrentUser,
  saveUserProfile
};

export default UserService;