import React, { useState, useEffect } from "react";
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useParams, useLocation } from "react-router-dom";
import AuthService from "../services/auth.service";
import { useTextField } from "../utils/hooks"
import { TextField } from "./FormFields"
import { validateEmail, validatePassword } from "../utils/validate"
import { errorMessage } from "../utils/messages"

const Register = (props) => {

  const emailField = useTextField("email", "Sähköposti:", "email", 32, validateEmail, "", []);
  const passwordField = useTextField("password", "Salasana:", "password", 32, validatePassword, "", []);

  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  const [login, setLogin] = useState(false);
  const [redirect, setRedirect] = useState(false);
  
  useEffect(() => {
    const loginUser = async () => {
      if (login) {
        try {
          await AuthService.login(emailField.value, passwordField.value);
          setRedirect(true);
        } catch (error) {
          setMessage(errorMessage(error));
        }
      }
    };
    loginUser();
  }, [emailField.value, passwordField.value, login]);

  // Form submission handler

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);
    if (!emailField.error && !passwordField.error) {
      try {
        let response = await AuthService.register(emailField.value, passwordField.value)
        setMessage(response.data.message);
        setSuccessful(true);
        setTimeout(() => setLogin(true), 2000)
      } catch (error) {
        setMessage(errorMessage(error));
        setSuccessful(false);
      };
    };
  };

  return (
      <Card style={{ width: "24rem" }}>
        <Card.Img variant="top" src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt="profile-img" className="profile-img-card" />
        
        <Form className="align-items-center" onSubmit={handleRegister}>
          
          {!successful && (
            <>
              <TextField {...emailField} />
              <TextField {...passwordField} />

              <Form.Group controlId="submit">
                <Button variant="primary" type="submit" block>Rekisteröidy</Button>
              </Form.Group>
            </>
          )}

          <Alert show={message !== ""} variant={successful ? "success" : "danger"}>
            {message}
          </Alert>

          {redirect && (
            <Redirect to={{pathname: '/profile'}} />
            )
          }

        </Form>
      </Card>
  );
};

export default Register;