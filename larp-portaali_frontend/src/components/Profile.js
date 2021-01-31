import React, { useState, useRef } from "react";
import { isEmail, isPhoneNumber } from '../utils/validate.js';
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";


const required = (value) => {
  if (!value) {
    return (<div className="alert alert-danger" role="alert">Tämä kenttä on pakollinen.</div>);
  }
};

const validEmail = (value) => {
  if (!isEmail(value)) {
    return (<div className="alert alert-danger" role="alert">Sähköpostiosoite on virheellinen.</div>);
  }
};

const validPassword = (value) => {
  if (value.length < 8 || value.length > 40) {
    return (<div className="alert alert-danger" role="alert">Salasanan tulee olla 8–40 merkin mittainen.</div>);
  }
};

const validPhoneNumber = (value) => {
  if (!isPhoneNumber(value)) {
    return (<div className="alert alert-danger" role="alert">Puhelinnumeron tulee olla muodossa +xxx xx xxx xxxx.</div>);
  }
};

const Profile = (props) => {
  const accountDataForm = useRef();
  const personalDataForm = useRef();
  const profileDataForm = useRef();
  const checkAccountDataBtn = useRef();
  const checkPersonalDataBtn = useRef();
  const checkProfileDataBtn = useRef();

  const currentUser = UserService.getCurrentUser();
  const userId = currentUser.id;
  
  /* States for user profile data form */
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState(currentUser.password);
  /*
  const [name, setName] = useState(currentUser.personalData.name); 
  const [phone, setPhone] = useState(currentUser.personalData.phone ?? "");
  const [hometown, setHometown] = useState(currentUser.personalData.hometown ?? "");
  const [gender, setGender] = useState(currentUser.personalData.gender ?? "");
  const [birthDate,setBirthDate] = useState(currentUser.personalData.birthDate ?? "");
  const [dietaryRestrictions,setDietaryRestrictions] = useState(currentUser.personalData.dietaryRestrictions ?? "");
  const [healthInformation,setHealthInformation] = useState(currentUser.personalData.healthInformation ?? "");
  */
  const [personalData, setPersonalData] = useState(currentUser.personalData) 
  /*
  const [playerProfile,setPlayerProfile] = useState(currentUser.profileData.playerProfile ?? "");
  const [answerTemplates,setAnswerTemplates] = useState(currentUser.profileData.answerTemplates ?? []);
  */
 const [profileData, setProfileData] = useState(currentUser.profileData) 

  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  /* Event handlers for form fields */ 
  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const saveAccountData = async (e) => {
    e.preventDefault();
    setMessage("");
    accountDataForm.current.validateAll();
    let updateData =  {id: userId, 
                      email: email, 
                      password: password}
    if (checkAccountDataBtn.current.context._errors.length === 0) {
      saveData(updateData)
    }
  };

/*
  const onChangeFirstName = (e) => {
    setName({first: e.target.value, last: name.last, nick: name.nick});
  };

  const onChangeLastName = (e) => {
    setName({first: name.first, last: e.target.value, nick: name.nick});
  };

  const onChangeNickname = (e) => {
    setName({first: name.first, last: name.last, nick: e.target.value});
  };

  const onChangePhone = (e) => {
    setPhone(e.target.value);
  };
*/

  const onChangePersonalData = (e) => {
    setPersonalData({...personalData, [e.target.name]: e.target.value});
  };

  const savePersonalData = async (e) => {
    e.preventDefault();
    setMessage("");
    personalDataForm.current.validateAll();
    let updateData =  {id: userId, 
                      personalData: personalData}
    if (checkPersonalDataBtn.current.context._errors.length === 0) {
      saveData(updateData)
    }
  };

  const onChangeProfileData = (e) => {
    setProfileData({...profileData, [e.target.name]: e.target.value});
  };

  const saveProfileData = async (e) => {
    e.preventDefault();
    setMessage("");
    profileDataForm.current.validateAll();
    let updateData =  {id: userId,
                      profileData: profileData}
    if (checkProfileDataBtn.current.context._errors.length === 0) {
      saveData(updateData)
    }
  };

  async function saveData(updateData) {
    try {
      let response = await UserService.saveUserProfile(updateData)
      setMessage(response.data.message);
      setSuccessful(true);
    } catch (error) {
      const resMessage =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      setMessage(resMessage);
      setSuccessful(false);
    }
  }

  return (
    <div className="col-md-12">
      <div className="card card-container">
        <h2>Käyttäjätilin tiedot</h2>
        <Form onSubmit={saveAccountData} ref={accountDataForm}>
            <div>
              <div className="form-group">
                <label>Käyttäjänumero</label>
                <label>{userId}</label>
              </div>
              <div className="form-group">
                <label htmlFor="email">Sähköpostiosoite</label>
                <Input
                  type="text"
                  className="form-control"
                  name="email"
                  value={email}
                  onChange={onChangeEmail}
                  validations={[required, validEmail]}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Salasana</label>
                <Input
                  type="password"
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={onChangePassword}
                  validations={[required, validPassword]}
                />
              </div>
              <div className="form-group">
                <button className="btn btn-primary btn-block">Tallenna käyttäjätilin tiedot</button>
              </div>
            </div>

          {message && (
            <div className="form-group">
              <div className={ successful ? "alert alert-success" : "alert alert-danger" } role="alert">
                {message}
              </div>
            </div>
          )}

          <CheckButton ref={checkAccountDataBtn} />
        </Form>


        <h2>Henkilökohtaiset tiedot</h2>
        <Form onSubmit={savePersonalData} ref={personalDataForm}>
            <div>
              <div className="form-group">
                <label htmlFor="firstName">Etunimi</label>
                <Input
                  type="text"
                  className="form-control"
                  name="firstName"
                  value={personalData.firstName}
                  onChange={onChangePersonalData}
                  validations={[required]}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Sukunimi</label>
                <Input
                  type="text"
                  className="form-control"
                  name="lastName"
                  value={personalData.lastName}
                  onChange={onChangePersonalData}
                  validations={[required]}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Lempinimi</label>
                <Input
                  type="text"
                  className="form-control"
                  name="nickname"
                  value={personalData.nickname}
                  onChange={onChangePersonalData}
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Puhelinnumero</label>
                <Input
                  type="text"
                  className="form-control"
                  name="phone"
                  value={personalData.phone}
                  onChange={onChangePersonalData}
                  validations={[validPhoneNumber]}
                />
              </div>
              <div className="form-group">
                <label htmlFor="hometown">Kotipaikkakunta</label>
                <Input
                  type="text"
                  className="form-control"
                  name="hometown"
                  value={personalData.hometown}
                  onChange={onChangePersonalData}
                />
              </div>
              <div className="form-group">
                <label htmlFor="gender">Sukupuoli</label>
                <div className="radio">
                  <label>
                    <Input
                      type="radio"
                      className="form-control"
                      name="gender"
                      value="2"
                      checked={personalData.gender === "2"}
                      onChange={onChangePersonalData}
                    />
                    Nainen
                  </label>
                </div>
                <div className="radio">
                  <label>
                    <Input
                      type="radio"
                      className="form-control"
                      name="gender"
                      value="1"
                      checked={personalData.gender === "1"}
                      onChange={onChangePersonalData}
                    />
                    Mies
                  </label>
                </div>
                <div className="radio">
                  <label>
                    <Input
                      type="radio"
                      className="form-control"
                      name="gender"
                      value="9"
                      checked={personalData.gender === "9"}
                      onChange={onChangePersonalData}
                    />
                    Muu
                  </label>
                </div>
              </div>
              

birthDate: birthDate,
dietaryRestrictions: dietaryRestrictions,
healthInformation: healthInformation





              <div className="form-group">
                <button className="btn btn-primary btn-block">Tallenna käyttäjätilin tiedot</button>
              </div>
            </div>

          {message && (
            <div className="form-group">
              <div className={ successful ? "alert alert-success" : "alert alert-danger" } role="alert">
                {message}
              </div>
            </div>
          )}

          <CheckButton ref={checkAccountDataBtn} />
        </Form>









      </div>
    </div>
  );
};



export default Profile;