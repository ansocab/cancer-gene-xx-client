import { useRef, useContext, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { UserContext } from "../Helpers/user";

export default function LoginForm({ callback }) {
  const emailValue = useRef();
  const passwordValue = useRef();
  const { serverUrl, setUser } = useContext(UserContext);
  const [showLoginError, setShowLoginError] = useState(false);

  const login = (mail, pw) => {
    fetch(`${serverUrl}/login`, {
      method: "POST",
      body: JSON.stringify({ email: mail, password: pw }),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      "Access-Control-Allow-Origin": serverUrl,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success === true) {
          setUser(res.user);
          callback("loggedIn");
        } else {
          console.log(res);
          setShowLoginError(true);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSubmission = (e) => {
    e.preventDefault();
    login(emailValue.current.value, passwordValue.current.value);
  };

  return (
    <>
      <Form onSubmit={handleSubmission}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            ref={emailValue}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            ref={passwordValue}
          />
        </Form.Group>

        {showLoginError && (
          <p className="text-danger">
            Sorry, we couldn't log you in. Please check the correct spelling of
            your username and password and try again.
          </p>
        )}

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <p
        className="mt-4 text-info link-style"
        onClick={() => callback("goToRegister")}
      >
        New to TCGA Searcher? Register here
      </p>
    </>
  );
}
