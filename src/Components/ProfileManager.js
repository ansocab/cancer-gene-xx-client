import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { UserContext } from "../Helpers/user";
import { Modal, OverlayTrigger, Popover, Button } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import "../App.css";
import { findAllByTestId } from "@testing-library/react";

export default function ProfileManager() {
  const [loginModalShow, setLoginModalShow] = useState(false);
  const [registerModalShow, setRegisterModalShow] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const { user, setUser, serverUrl } = useContext(UserContext);
  const history = useHistory();

  const handleVisibility = (modal) => {
    switch (modal) {
      case "loggedIn":
        setLoginModalShow(false);
        history.push("savedsearches");
        break;
      case "registered":
        setRegisterModalShow(false);
        history.push("savedsearches");
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
    fetch(`${serverUrl}/logout`, {
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
          setUser(null);
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
              {user !== null
                ? `Logged in as ${user.name}`
                : "New to BestNameEver? Create an account"}
            </Popover.Title>
            <Popover.Content>
              <div className="text-right">
                {user === null ? (
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
          <PersonCircle size={23} />
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
