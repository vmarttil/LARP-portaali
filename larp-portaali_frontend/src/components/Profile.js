import React, { useState, useEffect } from "react";
import { Card, Form, Button, Alert } from 'react-bootstrap';
import UserService from "../services/user.service";
import { useTextField, useTextArea, useRadioField } from "../utils/hooks"
import { TextField, TextArea, RadioField } from "./FormFields"
import { noValidate, validateRequired, validateEmail, validatePassword, validatePhoneNumber, validateDate } from "../utils/validate"
import { errorMessage } from "../utils/messages"

const Profile = (props) => {

  const currentUser = UserService.getCurrentUser();
  const userId = currentUser.id;

  /* Fields for user profile data */
  const emailField = useTextField("email", "Sähköposti:", "email", 32, validateEmail, currentUser.email, ["horizontal_3-6"]);
  const passwordField = useTextField("password", "Salasana:", "password", 32, validatePassword, currentUser.password, ["horizontal_3-6"]);

  /* Fields for personal data */
  const firstNameField = useTextField("first_name", "Etunimi:", "text", 32, validateRequired, currentUser.personalData.first_name ?? "", ["horizontal_3-6"]);
  const lastNameField = useTextField("last_name", "Sukunimi:", "text", 32, validateRequired, currentUser.personalData.last_name ?? "", ["horizontal_3-6"]);
  const nicknameField = useTextField("nickname", "Lempinimi:", "text", 32, noValidate, currentUser.personalData.nickname ?? "", ["horizontal_3-6"]);
  const phoneField = useTextField("phone", "Puhelinnumero:", "text", 0, validatePhoneNumber, currentUser.personalData.phone ?? "", ["horizontal_3-6"]);
  const hometownField = useTextField("hometown", "Kotipaikkakunta:", "text", 32, noValidate, currentUser.personalData.hometown ?? "", ["horizontal_3-6"]);
  const genderOptions = { 1: "Mies", 2: "Nainen", 9: "Muu" };
  const genderField = useRadioField("gender", "Sukupuoli:", false, genderOptions, currentUser.personalData.gender ?? null, ["inline", "horizontal_3-9"]);
  const birthdateField = useTextField("birthdate", "Syntymäaika:", "text", 10, validateDate, currentUser.personalData.birthdate ?? "", ["horizontal_3-6"]);
  const dietaryRestrictionsField = useTextArea("dietary_restrictions", "Ruokavaliorajoitteet:", 3000, noValidate, currentUser.personalData.dietary_restrictions ?? "", [], 8);
  const healthInformationField = useTextArea("health_information", "Terveystiedot:", 3000, noValidate, currentUser.personalData.health_information ?? "", [], 8);

  /* Fields for profile data */
  const playerProfileField = useTextArea("player_profile", "Pelaajaprofiili:", 0, noValidate, currentUser.profileData.player_profile ?? "", [], 12);
  const plotPreferencesField = useTextArea("plot_preferences", "Juonimieltymykset:", 0, noValidate, currentUser.profileData.plot_preferences ?? "", [], 12);

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

    if (!emailField.error && !passwordField.error) {
      currentUser.email = emailField.value;
      UserService.updateCurrentUser(currentUser);
      setSaveType("account");
      saveData(updateData);
    }
  };

  const savePersonalData = async (e) => {
    e.preventDefault();
    setMessage("");
    let updateData = {
      id: userId,
      personalData: {
        first_name: firstNameField.value,
        last_name: lastNameField.value,
        nickname: nicknameField.value,
        phone: phoneField.value,
        hometown: hometownField.value,
        gender: genderField.value,
        birthdate: birthdateField.value,
        dietary_restrictions: dietaryRestrictionsField.value,
        health_information: healthInformationField.value
      }
    };
    if (!firstNameField.error &&
      !lastNameField.error &&
      !nicknameField.error &&
      !phoneField.error &&
      !hometownField.error &&
      !genderField.error &&
      !birthdateField.error &&
      !dietaryRestrictionsField.error &&
      !healthInformationField.error) {
      currentUser.personalData = updateData.personalData;
      UserService.updateCurrentUser(currentUser);
      setSaveType("personal");
      saveData(updateData);
    };
  };

  const saveProfileData = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessful(false);

    let updateData = {
      id: userId,
      profileData: {
        player_profile: playerProfileField.value,
        plot_preferences: plotPreferencesField.value
      }
    };
    if (!playerProfileField.error && !plotPreferencesField.error) {
      currentUser.profileData = updateData.profileData;
      UserService.updateCurrentUser(currentUser);
      setSaveType("profile");
      saveData(updateData);
    }
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
    <>
      <Card style={{ width: "48rem" }}>
        <Card.Img variant="top" src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt="profile-img" className="profile-img-card" />
        <h2>Käyttäjätilin tiedot</h2>
        <Form className="align-items-center" onSubmit={saveAccountData}>

          <TextField {...emailField} />
          <TextField {...passwordField} />

          <Form.Group controlId="submit">
            <Button variant="primary" type="submit" block>
              <span>Tallenna käyttäjätilin tiedot</span>
            </Button>
          </Form.Group>

          <Alert show={message !== "" && saveType === "account"} variant={successful ? "success" : "danger"}>
            {message}
          </Alert>

        </Form>
      </Card>

      <Card style={{ width: "48rem" }}>
        <h2>Henkilökohtaiset tiedot</h2>
        <Form className="align-items-center" onSubmit={savePersonalData}>

          <TextField {...firstNameField} />
          <TextField {...lastNameField} />
          <TextField {...nicknameField} />
          <TextField {...phoneField} />
          <TextField {...hometownField} />
          <RadioField {...genderField} />
          <TextField {...birthdateField} />
          <TextArea {...dietaryRestrictionsField} />
          <TextArea {...healthInformationField} />

          <Form.Group controlId="submit">
            <Button variant="primary" type="submit" block>
              <span>Tallenna henkilökohtaiset tiedot</span>
            </Button>
          </Form.Group>

          <Alert show={message !== "" && (saveType === "personal")} variant={successful ? "success" : "danger"}>
            {message}
          </Alert>

        </Form>
      </Card>

      <Card style={{ width: "48rem" }}>
        <h2>Profiilitiedot</h2>
        <Form className="align-items-center" onSubmit={saveProfileData}>

          <TextArea {...playerProfileField} />
          <TextArea {...plotPreferencesField} />

          <Form.Group controlId="submit">
            <Button variant="primary" type="submit" block>
              <span>Tallenna profiilitiedot</span>
            </Button>
          </Form.Group>

          <Alert show={message !== "" && (saveType === "profile")} variant={successful ? "success" : "danger"}>
            {message}
          </Alert>

        </Form>
      </Card>
    </>
  );
};



export default Profile;