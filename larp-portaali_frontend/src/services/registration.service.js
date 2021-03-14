import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "/api/";

const submitRegistration = async (registrationData) => {
  return await axios.post(API_URL + "registration/submit", { data: registrationData }, { headers: authHeader() });
};

const getRegistration = async (formId, personId) => {
  return await axios.get(API_URL + "form/" + formId + "/person/" + personId + "/registration", { headers: authHeader() });
};


let RegistrationService = {
  submitRegistration,
  getRegistration
};

export default RegistrationService;