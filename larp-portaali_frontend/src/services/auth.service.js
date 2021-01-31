import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

const register = (email, password) => {
  return axios.post(API_URL + "signup", {
    email,
    password,
  });
};

const login = async (email, password) => {
  let response = await axios.post(API_URL + "signin", {
      email,
      password
  });
  if (response.data.accessToken) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem("user");
};

export default {
  register,
  login,
  logout
};