import { useState, useEffect, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { ProfileContext } from "../ProfileContext";

export default function ProfileManager() {
  const [loginModalShow, setLoginModalShow] = useState(false);
  const [registerModalShow, setRegisterModalShow] = useState(false);
  const [hideButtons, setHideButtons] = useState(false);
  const { loggedIn } = useContext(ProfileContext);

  const handleVisibility = (modal) => {
    if (modal === "registered") {
      setRegisterModalShow(false);
    } else {
      setLoginModalShow(false);
    }
    setHideButtons(true);
  };

  console.log(loggedIn);

  return (
    <>
      <Button
        className={`mt-5 mr-3 ${hideButtons && "d-none"}`}
        variant="primary"
        onClick={() => setLoginModalShow(true)}
        //show={buttonsShow}
      >
        Login
      </Button>

      <Button
        className={`mt-5 ${hideButtons && "d-none"}`}
        variant="primary"
        onClick={() => setRegisterModalShow(true)}
        //show={buttonsShow}
      >
        Register
      </Button>

      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="justify-content-md-center"
        show={loginModalShow}
        onHide={() => setLoginModalShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LoginForm callback={handleVisibility} />
        </Modal.Body>
      </Modal>

      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="justify-content-md-center"
        show={registerModalShow}
        onHide={() => setRegisterModalShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RegisterForm callback={handleVisibility} />
        </Modal.Body>
      </Modal>
    </>
    // <div>
    //   <button variant="primary" onClick={showLogin}>
    //     Login
    //   </button>
    //   <button variant="primary" onClick={showRegister}>
    //     Register
    //   </button>
    // </div>
  );
}
