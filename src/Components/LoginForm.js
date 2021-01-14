import { useRef, useContext } from "react";
import { setSessionCookie, SessionContext } from "../Helpers/session";
import { Form, Button } from "react-bootstrap";

export default function LoginForm({ callback }) {
  const emailValue = useRef();
  const passwordValue = useRef();
  const { setSession } = useContext(SessionContext);

  const login = (mail, pw) => {
    fetch("http://localhost:4000/login", {
      method: "POST",
      body: JSON.stringify({ email: mail, password: pw }),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      "Access-Control-Allow-Origin": "http://localhost:4000",
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res.userID);
        if (res.success === true) {
          setSessionCookie(res);
          setSession(res);
          callback("loggedIn");
        } else {
          console.log(res);
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

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <p
        className="mt-4 text-info link-style"
        onClick={() => callback("goToRegister")}
      >
        New to BestNameEver? Register here
      </p>
    </>
  );
}
