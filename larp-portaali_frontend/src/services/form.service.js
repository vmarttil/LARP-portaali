import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/";

const getForm = async (formId) => {
  let form =  await axios.get(API_URL + "form/" + formId, { headers: authHeader() });
  return form;
};

const createForm = async (formData) => {
  let form =  await axios.post(API_URL + "form/create", { data: formData }, { headers: authHeader() });
  return form;
};

const editForm = async (formId) => {
  let form =  await axios.get(API_URL + "form/" + formId + "/edit", { headers: authHeader() });
  return form;
};

const updateForm = async (formData) => {
  let form =  await axios.put(API_URL + "form/" + formData.form_id + "/update", { data: formData }, { headers: authHeader() });
  return form;
};

const toggleRegistration = async (formId) => {
  return await axios.get(API_URL + "form/" + formId + "/toggle", { headers: authHeader() });
};

const checkStatus = async (formId) => {
  return await axios.get(API_URL + "form/" + formId + "/status");
};

const getFormRegistrations = async (formId) => {
  return await axios.get(API_URL + "form/" + formId + "/registrations");
}

let FormService = {
  getForm,
  createForm,
  editForm,
  updateForm,
  toggleRegistration,
  checkStatus,
  getFormRegistrations
};

export default FormService;