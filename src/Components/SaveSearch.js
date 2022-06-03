import React, { useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import { SearchContext } from "../Helpers/search";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { Button, Modal, Form } from "react-bootstrap";
import { getUser } from "../store/user/selectors";
import { serverUrl } from "../Helpers/tempServerUrl";

function SaveSearch({ enabled, user }) {
  const [showSearchSaveModal, setShowSearchSaveModal] = useState(false);
  const [showLoginButtonModal, setShowLoginButtonModal] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [success, setSuccess] = useState(false);
  const { cancerData, searchSummary } = useContext(SearchContext);
  const searchName = useRef();
  const { ensgNumber } = useParams();

  const saveSearch = (e) => {
    e.preventDefault();

    fetch(`${serverUrl}/cancerdata`, {
      method: "POST",
      body: JSON.stringify(cancerData),
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
          saveSearchQuery(res.newCancerData._id);
        } else {
          console.log("could not save cancer data");
        }
      })
      .catch((err) => console.log(err));
  };

  const saveSearchQuery = (cancerDataId) => {
    fetch(`${serverUrl}/usersearchs`, {
      method: "POST",
      body: JSON.stringify({
        ...searchSummary,
        search_name: searchName.current.value,
        ensg_number: ensgNumber,
        pinned: false,
        user_id: user.user_id,
        cancer_data_id: cancerDataId,
      }),
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
          setSuccess(true);
        } else {
          setSuccess(false);
        }
        setShowFeedback(true);
      })
      .catch((err) => console.log(err));
  };

  const handleSearchSave = () => {
    if (user !== null) {
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
      <div className="w-100 d-flex">
        {enabled ? (
          <Button
            variant="primary"
            className="mt-4 ml-auto"
            onClick={handleSearchSave}
          >
            Save search
          </Button>
        ) : (
          <Button variant="primary" className="mt-4 ml-auto" disabled>
            Save search
          </Button>
        )}
      </div>

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

const mapStateToProps = state => ({
  user: getUser(state)
});

export default connect(mapStateToProps)(SaveSearch);