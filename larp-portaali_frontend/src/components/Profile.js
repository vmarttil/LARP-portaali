import React, { useState, useRef } from "react";
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import produce from "immer";
import { set, has } from "lodash";

function enhancedReducer(state, updateArg) {
  // tarkista onko updateArg callback-funktio
  if (updateArg.constructor === Function) {
    return { ...state, ...updateArg(state) };
  }
  // jos updateArg on objekti
  if (updateArg.constructor === Object) {
    // jos objektilla on _path- ja _value-avaimet,
    // käytä niitä objektin syvempien tasojen päivittämiseen
    if (has(updateArg, "_path") && has(updateArg, "_value")) {
      const { _path, _value } = updateArg;

      return produce(state, draft => {
        set(draft, _path, _value);
      });
    } else {
      return { ...state, ...updateArg };
    }
  }
}

/*
const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        Tämä kenttä on pakollinen.
      </div>
    );
  }
};

const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        Sähköpostiosoite on virheellinen.
      </div>
    );
  }
};

const vpassword = (value) => {
  if (value.length < 8 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        Salasanan tulee olla 8–40 merkin mittainen.
      </div>
    );
  }
};


const Profile = () => {
  const currentUser = UserService.getCurrentUser();

  return (
    <div className="container">
      <header className="jumbotron">
        <h1>
          <strong>{currentUser.username}</strong>
        </h1>
      </header>


      <p>
        <strong>Tunniste:</strong> {currentUser.accessToken.substring(0, 20)} ...{" "}
        {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
      </p>
      <p>
        <strong>Käyttäjänumero:</strong> {currentUser.id}
      </p>
      <p>
        <strong>Sähköpostiosoite:</strong> {currentUser.profileData.email}
      </p>
      <strong>Valtuudet:</strong>
      <ul>
        {currentUser.roles &&
          currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
      </ul>
    </div>
  );
};

*/



const Profile = (props) => {
  const form = useRef();
  const checkBtn = useRef();

  const currentUser = UserService.getCurrentUser();
  const username = currentUser.username;
  
  let initialProfileData = {};
  
  if (currentUser.profileData) {
    initialProfileData = {
      name: {
        first: currentUser.profileData.name.first,
        last: currentUser.profileData.name.last,
        nick: currentUser.profileData.name.nick
      },
      email: currentUser.profileData.email,
      phone: currentUser.profileData.phone,
      hometown: currentUser.profileData.hometown,
      gender: currentUser.profileData.gender,
      birthDate: currentUser.profileData.birthDate,
      playerPreferences: currentUser.profileData.playerPreferences,
      dietaryRestrictions: currentUser.profileData.dietaryRestrictions,
      healthInformation: currentUser.profileData.healthInformation,
      isPlayer: currentUser.roles.includes('ROLE_PLAYER'),
      isOrganiser: currentUser.roles.includes('ROLE_ORGANISER'),
    };
  } else {
    initialProfileData = {
      name: {
        first: "",
        last: "",
        nick: ""
      },
      email: "",
      phone: "",
      hometown: "",
      gender: "",
      birthDate: "",
      playerPreferences: "",
      dietaryRestrictions: "",
      healthInformation: "",
      isPlayer: currentUser.roles.includes('ROLE_PLAYER'),
      isOrganiser: currentUser.roles.includes('ROLE_ORGANISER'),
    }
  }

  const [password, setPassword] = useState(currentUser.password);
  const [name, setName] = useState(initialProfileData.profileData.name); 
  const [email, setEmail] = useState("");
  
  const [phone, setPhone] = useState(initialProfileData.profileData.phone);
  const [hometown, setHometown] = useState(initialProfileData.profileData.hometown);
  const [gender, setGender] = useState(initialProfileData.profileData.gender);
  const [birthDate,setBirthDate] = useState(initialProfileData.profileData.birthDate);
  const [playerProfile,setPlayerProfile] = useState(initialProfileData.profileData.playerProfile);
  const [dietaryRestrictions,setDietaryRestrictions] = useState(initialProfileData.profileData.dietaryRestrictions);
  const [healthInformation,setHealthInformation] = useState(initialProfileData.profileData.healthInformation);
  
  
  const [login, setLogin] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  
  const onChangeFirstName = (e) => {
    const firstName = e.target.value;
    setName({first: firstName, last: name.last, nick: name.nick});
  };

  const onChangeLastName = (e) => {
    const lastName = e.target.value;
    setName({first: name.first, last: lastName, nick: name.nick});
  };

  const onChangeNickName = (e) => {
    const nickName = e.target.value;
    setName({first: name.first, last: name.first, nick: nickName});
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleRegister = (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.register(username, email, password).then(
        (response) => {
          setMessage(response.data.message);
          setSuccessful(true);
          setTimeout(() => setLogin(true), 2000)
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setMessage(resMessage);
          setSuccessful(false);
        }
      );
    }
  };

  return (
    <div className="col-md-12">
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />

        <Form onSubmit={handleRegister} ref={form}>
          {!successful && (
            <div>
              <div className="form-group">
                <label htmlFor="username">Käyttäjätunnus</label>
                <label>{username}</label>
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
                  validations={[required, vpassword]}
                />
              </div>

              <div className="form-group">
                <button className="btn btn-primary btn-block">Rekisteröidy</button>
              </div>
            </div>
          )}

          {message && (
            <div className="form-group">
              <div
                className={ successful ? "alert alert-success" : "alert alert-danger" }
                role="alert"
              >
                {message}
              </div>
            </div>
          )}

          {login && (
            AuthService.login(username, password).then(
              () => {
                props.history.push("/profile");
                window.location.reload();
              }
            )
          )}

          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
      </div>
    </div>
  );
};



export default Profile;