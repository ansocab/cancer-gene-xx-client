import { useRef } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

export default function RegisterForm({ callback }) {
  const history = useHistory();
  const nameValue = useRef();
  const emailValue = useRef();
  const passwordValue = useRef();

  const register = (data) => {
    fetch("http://localhost:4000/register", {
      method: "POST",
      body: JSON.stringify(data),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      "Access-Control-Allow-Origin": "http://localhost:4000",
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        handleRedirect(res);
      })
      .catch((err) => console.log(err));
  };

  function handleRedirect(res) {
    if (res.success === true) {
      callback("registered");
      history.push(res.redirectUrl);
    } else {
      console.log("something went wrong");
    }
  }

  const handleSubmission = (e) => {
    e.preventDefault();
    const registerData = {
      email: emailValue.current.value,
      name: nameValue.current.value,
      password: passwordValue.current.value,
    };

    console.log(registerData);
    register(registerData);
  };

  return (
    <Form onSubmit={handleSubmission}>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" placeholder="Enter name" ref={nameValue} />
      </Form.Group>

      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" ref={emailValue} />
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
  );
}
