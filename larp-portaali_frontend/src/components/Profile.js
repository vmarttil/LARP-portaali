import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import UserService from "../services/user.service";
import { useTextField, useTextArea, useRadioField, useDateField } from "../utils/hooks"
import { TextField, TextArea, RadioField, DateField } from "./FormFields"
import { noValidate, validateRequired, validateEmail, validatePassword, validatePhoneNumber, validateDate } from "../utils/validate"
import { errorMessage } from "../utils/messages"

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const Profile = (props) => {

  const currentUser = UserService.getCurrentUser();
  const userId = currentUser.id;

  /* Fields for user profile data */
  const emailField = useTextField("email", "Sähköposti:", "email", 32, validateEmail, currentUser.email, ["horizontal_3-6"]);
  const passwordField = useTextField("password", "Salasana:", "password", 32, validatePassword, currentUser.password, ["horizontal_3-6"]);

  /* Fields for personal data */
  const firstNameField = useTextField("first_name", "Etunimi:", "text", 32, validateRequired, currentUser.personal_data.first_name ?? "", ["horizontal_3-6"]);
  const lastNameField = useTextField("last_name", "Sukunimi:", "text", 32, validateRequired, currentUser.personal_data.last_name ?? "", ["horizontal_3-6"]);
  const nicknameField = useTextField("nickname", "Lempinimi:", "text", 32, noValidate, currentUser.personal_data.nickname ?? "", ["horizontal_3-6"]);
  const phoneField = useTextField("phone", "Puhelinnumero:", "text", 0, validatePhoneNumber, currentUser.personal_data.phone ?? "", ["horizontal_3-6"]);
  const hometownField = useTextField("hometown", "Kotipaikkakunta:", "text", 32, noValidate, currentUser.personal_data.hometown ?? "", ["horizontal_3-6"]);
  const genderOptions = { 1: "Mies", 2: "Nainen", 9: "Muu" };
  const genderField = useRadioField("gender", "Sukupuoli:", false, genderOptions, currentUser.personal_data.gender ?? null, ["inline", "horizontal_3-9"]);
  const birthdateField = useDateField("birthdate", "Syntymäaika:", new Date('1900-01-01'), new Date(), validateRequired, currentUser.personal_data.birthdate ? new Date(currentUser.personal_data.birthdate) : new Date(), ["horizontal_3-6"]);
  const dietaryRestrictionsField = useTextArea("dietary_restrictions", "Ruokavaliorajoitteet:", 3000, noValidate, currentUser.personal_data.dietary_restrictions ?? "", [], 8);
  const healthInformationField = useTextArea("health_information", "Terveystiedot:", 3000, noValidate, currentUser.personal_data.health_information ?? "", [], 8);

  /* Fields for profile data */
  const playerProfileField = useTextArea("player_profile", "Pelaajaprofiili:", 0, noValidate, currentUser.profile_data.player_profile ?? "", [], 12);
  const plotPreferencesField = useTextArea("plot_preferences", "Juonimieltymykset:", 0, noValidate, currentUser.profile_data.plot_preferences ?? "", [], 12);

  const [successful, setSuccessful] = useState(false);
  const [saveType, setSaveType] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage('');
      setSaveType(null)
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);

  // Form submission handlers

  const saveAccountData = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessful(false);

    let updateData = {
      id: userId,
      email: emailField.value,
      password: passwordField.value
    };

    if (emailField.validate() && passwordField.validate()) {
      currentUser.email = emailField.value;
      UserService.updateCurrentUser(currentUser);
      setSaveType("account");
      saveData(updateData);
    } else {
      setSaveType("account");
      setMessage("Täytä puuttuvat tiedot.")
    };
  };

  const savePersonalData = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessful(false);

    let updateData = {
      id: userId,
      personal_data: {
        first_name: firstNameField.value,
        last_name: lastNameField.value,
        nickname: nicknameField.value,
        phone: phoneField.value,
        hometown: hometownField.value,
        gender: genderField.value,
        birthdate: birthdateField.value.toJSON(),
        dietary_restrictions: dietaryRestrictionsField.value,
        health_information: healthInformationField.value
      }
    };

    if (firstNameField.validate() &&
      lastNameField.validate() &&
      nicknameField.validate() &&
      phoneField.validate() &&
      hometownField.validate() &&
      genderField.validate() &&
      birthdateField.validate() &&
      dietaryRestrictionsField.validate() &&
      healthInformationField.validate()) {
      currentUser.personal_data = updateData.personal_data;
      UserService.updateCurrentUser(currentUser);
      setSaveType("personal");
      saveData(updateData);
    } else {
      setSaveType("personal");
      setMessage("Täytä puuttuvat tiedot.")
    };
  };

  const saveProfileData = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessful(false);

    let updateData = {
      id: userId,
      profile_data: {
        player_profile: playerProfileField.value,
        plot_preferences: plotPreferencesField.value
      }
    };

    if (playerProfileField.validate() && plotPreferencesField.validate()) {
      currentUser.profile_data = updateData.profile_data;
      UserService.updateCurrentUser(currentUser);
      setSaveType("profile");
      saveData(updateData);
    } else {
      setSaveType("profile");
      setMessage("Täytä puuttuvat tiedot.")
    };
  };

  async function saveData(updateData) {
    try {
      let response = await UserService.saveUserProfile(updateData)
      setMessage(response.data.message);
      setSuccessful(true);
    } catch (error) {
      setMessage(errorMessage(error));
      setSuccessful(false);
    }
  }

  return (
    <Container>
      <Row>
        <Col sm="1"></Col>
        <Col sm="10">
          <Card className="my-3">
          <Card.Body>
            <Card.Title>
            <h2>Käyttäjätilin tiedot</h2>
            </Card.Title>
            
            <Form className="align-items-center" onSubmit={saveAccountData}>
              
              <TextField {...emailField} />
              <TextField {...passwordField} />
              <Form.Group controlId="submit" className="mb-0 mt-3">
                <Button variant="primary" type="submit" block>
                  <span>Tallenna käyttäjätilin tiedot</span>
                </Button>
              </Form.Group>
            
              <Alert show={message !== "" && saveType === "account"} variant={successful ? "success" : "danger"}>
                {message}
              </Alert>
            
            </Form>
            
            </Card.Body>
          </Card>
        </Col>
        <Col sm="1"></Col>
      </Row>
      <Row>
        <Col sm="1"></Col>
        <Col sm="10">
          <Card className="my-3">
          <Card.Body>
            <Card.Title>
            <h2>Henkilökohtaiset tiedot</h2>
            </Card.Title>
            
            <Form className="align-items-center" onSubmit={savePersonalData}>
              
              <TextField {...firstNameField} />
              <TextField {...lastNameField} />
              <TextField {...nicknameField} />
              <TextField {...phoneField} />
              <TextField {...hometownField} />
              <RadioField {...genderField} />
              <DateField {...birthdateField} />
              <TextArea {...dietaryRestrictionsField} />
              <TextArea {...healthInformationField} />
              <Form.Group controlId="submit" className="mb-0 mt-3">
                <Button variant="primary" type="submit" block>
                  <span>Tallenna henkilökohtaiset tiedot</span>
                </Button>
              </Form.Group>

              <Alert show={message !== "" && (saveType === "personal")} variant={successful ? "success" : "danger"}>
                {message}
              </Alert>

            </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col sm="1"></Col>
      </Row>
      <Row>
        <Col sm="1"></Col>
        <Col sm="10">
          <Card className="my-3">
            <Card.Body>
              <Card.Title>
            <h2>Profiilitiedot</h2>
            </Card.Title>

            <Form className="align-items-center" onSubmit={saveProfileData}>

              <TextArea {...playerProfileField} />
              <TextArea {...plotPreferencesField} />

              <Form.Group controlId="submit" className="mb-0 mt-3">
                <Button variant="primary" type="submit" block>
                  <span>Tallenna profiilitiedot</span>
                </Button>
              </Form.Group>

              <Alert show={message !== "" && (saveType === "profile")} variant={successful ? "success" : "danger"}>
                {message}
              </Alert>

            </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;