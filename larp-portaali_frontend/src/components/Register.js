import React, { useState, useRef, useEffect } from "react";
import { isEmail, isPassword } from "../utils/validate"
import { Form, Button, Alert } from 'react-bootstrap';
import AuthService from "../services/auth.service";

const Register = (props) => {
  const firstRender = useRef(true);

  const [email, setEmail] = useState({value: "", error: null});
  const [password, setPassword] = useState({value: "", error: null});

  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  
  const [login, setLogin] = useState(false);

// onChange handlers

  const onChangeEmail = (e) => {
    const email_field = e.target.value;
    setEmail({...email, value: email_field});
  };

  const onChangePassword = (e) => {
    const password_field = e.target.value;
    setPassword({...password, value: password_field});
  };

// Validators

  const validateEmail = () => {
    if (email.value === "") {
      setEmail({...email, error: "Sähköpostiosoite on pakollinen."});
    } else if (!isEmail(email.value)) {
      setEmail({...email, error: "Syötä kelvollinen sähköpostiosoite."});
    } else {
      setEmail({...email, error: null});
    }
  };

  const validatePassword = () => {
    if (password.value === "") {
      setPassword({...password, error: "Salasana on pakollinen."});
    } else if (!isPassword(password.value)) {
      setPassword({...password, error: "Salasanan on oltava 8-40 merkkiä pitkä."});
    } else {
      setPassword({...password, error: null})
    }
  };

  // Form submission handler

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);
    if (!email.error && !password.error) {
      try {
        let response = await AuthService.register(email.value, password.value)
        setMessage(response.data.message);
        setSuccessful(true);
        setTimeout(() => setLogin(true), 2000)
      } catch(error) {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setSuccessful(false);
      }
    }
  };

  // useEffect(() => {
  //   if (firstRender.current) {
  //     firstRender.current = false
  //     return
  //   }
  //   setButtonDisabled( !validatePassword() || !validateEmail() )
  // }, [email.value, password.value])

  return (
    <div className="col-md-12">
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />
        <Form className="align-items-center" onSubmit={handleRegister}>
          {!successful && (
            <>
              <Form.Group controlId="email_field">
                <Form.Label>Sähköpostiosoite</Form.Label>
                <Form.Control 
                  type="email" 
                  value={email.value}
                  onChange={onChangeEmail}
                  onBlur={validateEmail}/>
                {email.error && (
                  <Form.Text className="text-muted red">{email.error}</Form.Text>
                )}
              </Form.Group>

              <Form.Group controlId="password_field">
                <Form.Label>Salasana</Form.Label>
                <Form.Control 
                  type="password" 
                  value={password.value}
                  onChange={onChangePassword}
                  onBlur={validatePassword}/>
                {password.error && (
                  <Form.Text className="text-muted red">{password.error}</Form.Text>
                )}
              </Form.Group>
              <Form.Group controlId="submit">
                <Button variant="primary" type="submit" block>Rekisteröidy</Button>
              </Form.Group>
            </>
          )}
          <Alert show={message} variant={ successful ? "success" : "danger"}>
            {message}
          </Alert>

          {login && (
            AuthService.login(email.value, password.value).then(
              () => {
                props.history.push("/profile");
                window.location.reload();
              }
            )
          )}
        </Form>
      </div>
    </div>
  );
};

export default Register;