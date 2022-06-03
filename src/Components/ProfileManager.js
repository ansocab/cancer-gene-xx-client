import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from 'react-redux';
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { Modal, OverlayTrigger, Popover, Button } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import "../App.css";
import { getUser, getRedirectUrl, getUserLoading } from "../store/user/selectors";
import { logout, resetRedirect } from "../store/user/thunks";

function ProfileManager(props) {
  const { user, redirectUrl, isLoading, logout, resetRedirectUrl } = props;
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const history = useHistory();

  useEffect(() => {
    user && hideModals();
  }, [user]);

/*   useEffect(() => {
    if (redirectUrl) {
      history.push(redirectUrl)
      resetRedirectUrl();
    };
  }, [redirectUrl]); */

  const hideModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  const handleVisibility = (modal) => {
    switch (modal) {
      case "goToLogin":
        setShowRegisterModal(false);
        setShowLoginModal(true);
        break;
      case "goToRegister":
        setShowLoginModal(false);
        setShowRegisterModal(true);
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    setShowOverlay(false);
    logout();
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
                : "New to TCGA Searcher? Create an account"}
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
                        setShowLoginModal(true);
                      }}
                    >
                      Login
                    </Button>

                    <Button
                      variant="primary"
                      onClick={() => {
                        setShowOverlay(false);
                        setShowRegisterModal(true);
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
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LoginForm callback={handleVisibility}/>
        </Modal.Body>
      </Modal>

      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="justify-content-md-center"
        show={showRegisterModal}
        onHide={() => setShowRegisterModal(false)}
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

const mapStateToProps = state => ({
  user: getUser(state),
  redirectUrl: getRedirectUrl(state),
  isLoading: getUserLoading(state)
});

const mapDispatchToProps = dispatch => ({
  //login: data => dispatch(login(data)),
  //register: data => dispatch(register(data)),
  logout: data => dispatch(logout(data)),
  resetRedirectUrl: () => dispatch(resetRedirect())
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileManager);