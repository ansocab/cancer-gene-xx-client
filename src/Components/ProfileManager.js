import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { removeSessionCookie, SessionContext } from "../Helpers/session";
import { Modal, OverlayTrigger, Popover, Button } from "react-bootstrap";
import "../App.css";

export default function ProfileManager() {
  const [loginModalShow, setLoginModalShow] = useState(false);
  const [registerModalShow, setRegisterModalShow] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const { session, setSession } = useContext(SessionContext);
  const history = useHistory();

  const handleVisibility = (modal) => {
    switch (modal) {
      case "loggedIn":
        setLoginModalShow(false);
        history.push("profile");
        break;
      case "registered":
        setRegisterModalShow(false);
        history.push("profile");
        break;
      case "goToLogin":
        setRegisterModalShow(false);
        setLoginModalShow(true);
        break;
      case "goToRegister":
        setLoginModalShow(false);
        setRegisterModalShow(true);
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    setShowOverlay(false);
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
      <OverlayTrigger
        trigger="click"
        key="bottom"
        placement="auto"
        rootClose={true}
        show={showOverlay}
        onHide={() => setShowOverlay(!showOverlay)}
        overlay={
          <Popover id="popover-positioned-bottom" className="mv-25">
            <Popover.Title as="h3">
              {Object.keys(session).length !== 0
                ? `Logged in as ${session.user.name}`
                : "New to BestNameEver? Create an account"}
            </Popover.Title>
            <Popover.Content>
              <div className="text-right">
                {Object.keys(session).length === 0 ? (
                  <>
                    <Button
                      className="mr-3"
                      variant="primary"
                      onClick={() => {
                        setShowOverlay(false);
                        setLoginModalShow(true);
                      }}
                    >
                      Login
                    </Button>

                    <Button
                      variant="primary"
                      onClick={() => {
                        setShowOverlay(false);
                        setRegisterModalShow(true);
                      }}
                    >
                      Register
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="primary" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </Popover.Content>
          </Popover>
        }
      >
        <Button
          variant="secondary"
          className="profile-button mr-2 px-1 px-md-2"
          onClick={() => setShowOverlay(!showOverlay)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="23"
            fill="currentColor"
            className="bi bi-person-circle"
            viewBox="0 0 16 16"
          >
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
            <path
              fillRule="evenodd"
              d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
            />
          </svg>
        </Button>
      </OverlayTrigger>

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
