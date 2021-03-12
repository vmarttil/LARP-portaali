import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/";

const submitRegistration = async (registrationData) => {
  return await axios.post(API_URL + "registration/submit", { data: registrationData }, { headers: authHeader() });
}

let RegistrationService = {
  submitRegistration
  
};

export default RegistrationService;