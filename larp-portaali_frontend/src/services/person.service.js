import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/";

const getPlayerPortal = async () => {
  return await axios.get(API_URL + "portal/player", { headers: authHeader() });
};

const getOrganiserPortal = async () => {
  return await axios.get(API_URL + "portal/organiser", { headers: authHeader() });
};

const getAdminPortal = async () => {
  return await axios.get(API_URL + "portal/admin", { headers: authHeader() });
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const updateCurrentUser = (newUser) => {
  localStorage.setItem("user", JSON.stringify(newUser));
};

const getPersonProfile = async () => {
  return await axios.get(API_URL + "person/profile/", { headers: authHeader() });
}

const savePersonProfile = async (userProfileData) => {
  return await axios.put(API_URL + "person/profile", { data: userProfileData }, { headers: authHeader() });
};

const findPerson = async (email) => {
  return await axios.post(API_URL + "person", { data: {email: email} });
};

let PersonService = {
  getPlayerPortal,
  getOrganiserPortal,
  getAdminPortal,
  getCurrentUser,
  updateCurrentUser,
  getPersonProfile,
  savePersonProfile,
  findPerson
};

export default PersonService;