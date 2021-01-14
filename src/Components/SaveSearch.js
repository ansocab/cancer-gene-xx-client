import React, { useState, useContext, useRef } from "react";
import { SessionContext } from "../Helpers/session";
import { SearchContext } from "../Helpers/search";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { Button, Modal, Form } from "react-bootstrap";

export default function SaveSearch() {
  const [showSearchSaveModal, setShowSearchSaveModal] = useState(false);
  const [showLoginButtonModal, setShowLoginButtonModal] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [success, setSuccess] = useState(false);
  const { session } = useContext(SessionContext);
  const { searchSummary } = useContext(SearchContext);
  const searchName = useRef();

  const saveSearch = (e) => {
    e.preventDefault();

    fetch("http://localhost:4000/usersearchs", {
      method: "POST",
      body: JSON.stringify({
        ...searchSummary,
        search_name: searchName.current.value,
        user_id: session.userID,
      }),
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
          setSuccess(true);
        } else {
          setSuccess(false);
        }
        setShowFeedback(true);
      })
      .catch((err) => console.log(err));
  };

  const handleSearchSave = () => {
    if (Object.keys(session).length !== 0) {
      setShowSearchSaveModal(true);
    } else {
      setShowLoginForm(true);
      setShowLoginButtonModal(true);
    }
  };

  const handleLoginOrRegister = (modal) => {
    switch (modal) {
      case "goToLogin":
        setShowLoginForm(true);
        break;
      case "goToRegister":
        setShowLoginForm(false);
        break;
      default:
        setShowLoginButtonModal(false);
        setShowSearchSaveModal(true);
        break;
    }
  };

  return (
    <>
      <Button
        variant="primary"
        className="mt-4 mb-4"
        onClick={handleSearchSave}
      >
        Save search
      </Button>

      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="justify-content-md-center"
        show={showSearchSaveModal}
        onHide={() => setShowSearchSaveModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Name your search
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!showFeedback ? (
            <Form onSubmit={saveSearch}>
              <Form.Group controlId="formBasicEmail">
                <Form.Control
                  type="text"
                  placeholder="Enter search name"
                  ref={searchName}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </Form>
          ) : (
            <>
              <p className={success ? "text-success" : "text-danger"}>
                {success
                  ? "Search saved successfully"
                  : "Search could not be saved"}
              </p>
              <Button
                variant="primary"
                type="submit"
                onClick={() => setShowSearchSaveModal(false)}
              >
                Close
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>

      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="justify-content-md-center"
        show={showLoginButtonModal}
        onHide={() => setShowLoginButtonModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {showLoginForm ? "Please login" : "Register"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showLoginForm ? (
            <LoginForm callback={handleLoginOrRegister} />
          ) : (
            <RegisterForm callback={handleLoginOrRegister} />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
