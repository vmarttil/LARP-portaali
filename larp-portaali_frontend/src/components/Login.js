import React, { useState } from "react";
import { Card, Form, Button, Alert, Spinner, Col, Row, Container } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useParams, useLocation } from "react-router-dom";
import AuthService from "../services/auth.service";
import { useTextField } from "../utils/hooks"
import { TextField } from "./FormFields"
import { validateEmail, validatePassword } from "../utils/validate"
import { errorMessage } from "../utils/messages"

const Login = ({ setCurrentUser }) => {

  const emailField = useTextField("email", "Sähköposti:", "email", 32, validateEmail, "", []);
  const passwordField = useTextField("password", "Salasana:", "password", 32, validatePassword, "", []);

  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Form submission handler

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    if (!emailField.error && !passwordField.error) {
      try {
        let response = await AuthService.login(emailField.value, passwordField.value)
        setCurrentUser(response);
        setRedirect(true);
      } catch (error) {
        setLoading(false);
        setMessage(errorMessage(error));
      };
    } else {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row>
        <Col sm="4"></Col>
        <Col sm="4">
          <Card className="my-3">
            <Card.Img variant="top" src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt="profile-img" className="profile-img-card" />
            <Card.Header>
              <h4 className="mb-0">Sisäänkirjautuminen</h4>
            </Card.Header>
            <Card.Body>

              <Form className="align-items-center" onSubmit={handleLogin}>

                <TextField {...emailField} />
                <TextField {...passwordField} />

                <Form.Group controlId="submit">
                  <Button variant="primary" type="submit" block>
                    {loading && (
                      <Spinner as="span" animation="border" role="status" size="sm" />
                    )}
                    <span>Kirjaudu</span>
                  </Button>
                </Form.Group>

                <Alert show={message !== ""} variant={"danger"}>
                  {message}
                </Alert>

              </Form>
            </Card.Body>
            <Card.Footer>
              Jos et ole vielä luonut käyttäjätunnusta, voit luoda sen <a href="/register">rekisteröitymissivulla</a>.
      </Card.Footer>
          </Card>
        </Col>
        <Col sm="4"></Col>
      </Row>
      {redirect && (
        <Redirect to={{ pathname: '/portal/player' }} />
      )}
    </Container>
  );
};

export default Login;