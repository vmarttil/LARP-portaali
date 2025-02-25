import React, { useState, useEffect } from "react";
import { Card, Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useParams, useLocation } from "react-router-dom";
import AuthService from "../services/auth.service";
import { useTextField } from "../utils/hooks"
import { TextField } from "./FormFields"
import { validateEmail, validatePassword } from "../utils/validate"
import { errorMessage } from "../utils/messages"

const Register = ({ setCurrentUser }) => {

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
          let response = await AuthService.login(emailField.value, passwordField.value)
          setCurrentUser(response);
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

    <Container>
      <Row>
        <Col sm="4"></Col>
        <Col sm="4">
          <Card className="my-3">
            <Card.Img variant="top" src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt="profile-img" className="profile-img-card" />
            <Card.Header>
              <h4 className="mb-0">Rekisteröityminen</h4>
            </Card.Header>
            <Card.Body>

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
                  <Redirect to={{ pathname: '/profile' }} />
                )
                }

              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col sm="4"></Col>
      </Row>
    </Container>
  );
};

export default Register;