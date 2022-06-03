import { useRef } from "react";
import { Form, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { register } from "../store/user/thunks";

function RegisterForm({ register, callback }) {
  const nameValue = useRef();
  const emailValue = useRef();
  const passwordValue = useRef();

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

const mapDispatchToProps = dispatch => ({
  register: data => dispatch(register(data))
});

export default connect(null, mapDispatchToProps)(RegisterForm);