import React, { useState, Link } from "react";
import { isEmail, isPassword } from "../utils/validate"
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import AuthService from "../services/auth.service";

const Login = (props) => {

  const [email, setEmail] = useState({ value: "", error: null });
  const [password, setPassword] = useState({ value: "", error: null });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Form field handlers

  const onChangeEmail = (e) => {
    const email_field = e.target.value;
    setEmail({ ...email, value: email_field });
  };

  const onChangePassword = (e) => {
    const password_field = e.target.value;
    setPassword({ ...password, value: password_field });
  };

  // Validators

  const validateEmail = () => {
    if (email.value === "") {
      setEmail({ ...email, error: "Sähköpostiosoite on pakollinen." });
    } else if (!isEmail(email.value)) {
      setEmail({ ...email, error: "Syötä kelvollinen sähköpostiosoite." });
    } else {
      setEmail({ ...email, error: null });
    }
  };

  const validatePassword = () => {
    if (password.value === "") {
      setPassword({ ...password, error: "Salasana on pakollinen." });
    } else if (!isPassword(password.value)) {
      setPassword({ ...password, error: "Salasanan on oltava 8-40 merkkiä pitkä." });
    } else {
      setPassword({ ...password, error: null })
    }
  };

  // Form submission handler

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    if (!email.error && !password.error) {
      try {
        let response = await AuthService.login(email.value, password.value)
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

        <Form.Group controlId="email_field">
          <Form.Label>Sähköpostiosoite</Form.Label>
          <Form.Control
            type="email"
            value={email.value}
            onChange={onChangeEmail}
            onBlur={validateEmail} />
          {email.error && (
            <Form.Text className="text-danger">{email.error}</Form.Text>
          )}
        </Form.Group>

        <Form.Group controlId="password_field">
          <Form.Label>Salasana</Form.Label>
          <Form.Control
            type="password"
            value={password.value}
            onChange={onChangePassword}
            onBlur={validatePassword} />
          {password.error && (
            <Form.Text className="text-danger">{password.error}</Form.Text>
          )}
        </Form.Group>

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