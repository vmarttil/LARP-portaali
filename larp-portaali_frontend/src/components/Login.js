import React, { useState} from "react";
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import AuthService from "../services/auth.service";
import useField from "../utils/useField"
import { TextField } from "./FormFields"
import { validateEmail, validatePassword } from "../utils/validate"

const Login = (props) => {

  const emailField = useField("Sähköposti","email", validateEmail);
  const passwordField = useField("Salasana","password", validatePassword);

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
        props.history.push("/profile");
        window.location.reload();
      } catch (error) {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage);
      };
    } else {
      setLoading(false);
    }
  };

  return (
    <Card style={{ width: "24rem" }}>
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

        <Alert show={message} variant={"danger"}>
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