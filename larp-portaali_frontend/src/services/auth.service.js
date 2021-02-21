import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

const register = async (email, password) => {
  let response = axios.post(API_URL + "signup", {
    data: {
      email: email,
      password: password
    }
  });
  return response; 
};

const login = async (email, password) => {
  let response = await axios.post(API_URL + "signin", {
      data: {
        email: email,
        password: password
      }
  });
  if (response.data.accessToken) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem("user");
};

let AuthService = {
  register,
  login,
  logout
};

export default AuthService