import { useRef } from "react";
import { Form, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { login } from "../store/user/thunks";

function LoginForm({ login, callback }) {
  const emailValue = useRef();
  const passwordValue = useRef();

  const handleSubmission = (e) => {
    e.preventDefault();
    const loginData = {
      email: emailValue.current.value,
      password: passwordValue.current.value
    }
    login(loginData);
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
        New to TCGA Searcher? Register here
      </p>
    </>
  );
}

const mapDispatchToProps = dispatch => ({
  login: data => dispatch(login(data))
});

export default connect(null, mapDispatchToProps)(LoginForm);