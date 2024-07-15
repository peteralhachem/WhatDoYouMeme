import { Button, Card, FloatingLabel, Form } from "react-bootstrap";

import { useState } from "react";
import { useNavigate } from "react-router";

import { useSetSuccessMessage } from "../context/SuccessContext";
import { useSetErrorMessage } from "../context/ErrorContext";
import { useSetUser } from "../context/UserContext";

import PropTypes from "prop-types";

function LoginForm(props) {
  const { login } = props;

  // USER state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // context
  const setUser = useSetUser();
  const setErrorMessage = useSetErrorMessage();
  const setSuccessMessage = useSetSuccessMessage();

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const user = await login({
        username: username,
        password: password,
      });

      setErrorMessage("");
      setSuccessMessage("");

      if (!user) {
        setErrorMessage("Incorrect username or password. Please try again");
        return;
      }

      // login was successful
      setUser(user); // set user context
      setSuccessMessage(`Welcome @${user.username}!\n
           Now you can start guessing memes , or you can review your history! `);
      setTimeout(() => setSuccessMessage(""), 5000);
      navigate("/");
    } catch (err) {
      setSuccessMessage("");
      setErrorMessage("Something went wrong with your login. Please try again");
      return;
    }
  }

  return (
    <Card className="login-form">
      <Card.Title as="h3" className="py-1">
        Sign In
      </Card.Title>

      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <FloatingLabel
            label="Username"
            controlId="floatingInput"
            className="my-3 form-field"
          >
            <Form.Control
              type="text"
              value={username}
              required={true}
              placeholder="username"
              onChange={(event) => setUsername(event.target.value)}
            />
          </FloatingLabel>

          <FloatingLabel
            label="Password"
            controlId="floatingPassword"
            className="my-3 form-field"
          >
            <Form.Control
              type="password"
              value={password}
              required={true}
              placeholder="password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </FloatingLabel>

          <Form.Group className="my-3 login-button" align="center">
            <Button variant="success" type="submit" className="mt-3 py-2">
              Login
            </Button>
          </Form.Group>
          <Form.Group className="my-3 login-button" align="center">
            <Button
              variant="outline-secondary guest-button"
              onClick={() => navigate("/")}
              className="mt-1 py-2"
            >
              Continue as guest
            </Button>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
}

// props validation

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
};

export default LoginForm;
