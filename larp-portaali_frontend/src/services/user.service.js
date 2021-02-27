import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/";

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

const updateCurrentUser = (newUser) => {
  localStorage.setItem("user", JSON.stringify(newUser));
};

const getUserProfile = () => {
  return axios.get(API_URL + "user/profile/", { headers: authHeader() });
}

const saveUserProfile = (userProfileData) => {
  return axios.put(API_URL + "user/profile", { data: userProfileData }, { headers: authHeader() });
};

let UserService = {
  getPlayerPortal,
  getOrganiserPortal,
  getAdminPortal,
  getCurrentUser,
  updateCurrentUser,
  getUserProfile,
  saveUserProfile
};

export default UserService;