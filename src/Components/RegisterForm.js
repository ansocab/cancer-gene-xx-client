import { useRef, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { UserContext } from "../Helpers/user";

export default function RegisterForm({ callback }) {
  const nameValue = useRef();
  const emailValue = useRef();
  const passwordValue = useRef();
  const { serverUrl } = useContext(UserContext);

  const register = (data) => {
    fetch(`${serverUrl}/register`, {
      method: "POST",
      body: JSON.stringify(data),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      "Access-Control-Allow-Origin": serverUrl,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.success === true) {
          callback("registered");
        } else {
          console.log(res);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSubmission = (e) => {
    e.preventDefault();
    const registerData = {
      email: emailValue.current.value,
      name: nameValue.current.value,
      password: passwordValue.current.value,
    };

    register(registerData);
  };

  return (
    <>
      <Form onSubmit={handleSubmission}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="Enter name" ref={nameValue} />
        </Form.Group>

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
        onClick={() => callback("goToLogin")}
      >
        Already registered? Login here
      </p>
    </>
  );
}
