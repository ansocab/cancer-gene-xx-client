import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { removeSessionCookie, SessionContext } from "../Helpers/session";
import { Modal, Button } from "react-bootstrap";

export default function ProfileManager() {
  const [loginModalShow, setLoginModalShow] = useState(false);
  const [registerModalShow, setRegisterModalShow] = useState(false);
  const { session, setSession } = useContext(SessionContext);
  const history = useHistory();

  const handleVisibility = (modal) => {
    if (modal === "registered") {
      setRegisterModalShow(false);
    } else {
      setLoginModalShow(false);
    }
  };

  const handleLogout = () => {
    fetch("http://localhost:4000/logout", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      "Access-Control-Allow-Origin": "http://localhost:4000",
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.success === true) {
          removeSessionCookie();
          setSession({});
          history.push(res.redirectUrl);
        } else {
          console.log(res);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="text-right mr-5">
        {Object.keys(session).length === 0 ? (
          <>
            <Button
              className="mt-5 mr-3"
              variant="primary"
              onClick={() => setLoginModalShow(true)}
            >
              Login
            </Button>

            <Button
              className="mt-5"
              variant="primary"
              onClick={() => setRegisterModalShow(true)}
            >
              Register
            </Button>
          </>
        ) : (
          <>
            <p className="mt-5">{`Logged in as ${session.name}`}</p>
            <Button variant="primary" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </div>

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
  );
}
