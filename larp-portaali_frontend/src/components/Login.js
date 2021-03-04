import React, { useState} from "react";
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useParams, useLocation } from "react-router-dom";
import AuthService from "../services/auth.service";
import { useTextField } from "../utils/hooks"
import { TextField } from "./FormFields"
import { validateEmail, validatePassword } from "../utils/validate"
import { errorMessage } from "../utils/messages"

const Login = ({ setCurrentUser }) => {

  const emailField = useTextField("email", "Sähköposti:","email", 32, validateEmail, "", []);
  const passwordField = useTextField("password", "Salasana:","password", 32, validatePassword, "", []);

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
        // props.history.push("/portal/player");
        // window.location.reload();
      } catch (error) {
        setLoading(false);
        setMessage(errorMessage(error));
      };
    } else {
      setLoading(false);
    }
  };

  return (
    <Card style={{ width: "24rem" }}>
      {redirect && (
        <Redirect to={{pathname: '/portal/player'}} />
      )}
      <Card.Img variant="top" src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt="profile-img" className="profile-img-card" />
      
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
      <Card.Footer>
        Jos et ole vielä luonut käyttäjätunnusta, voit luoda sen <a href="/register">rekisteröitymissivulla</a>.
      </Card.Footer>
    </Card>
  );
};

export default Login;