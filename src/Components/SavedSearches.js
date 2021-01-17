import { useState, useEffect, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import { SessionContext } from "../Helpers/session";
import {
  Row,
  Col,
  Form,
  Button,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import "../App.css";

export default function SavedSearches() {
  const history = useHistory();
  const { session } = useContext(SessionContext);
  const [userSearches, setUserSearches] = useState([]);
  const [filteredUserSearches, setFilteredUserSearches] = useState([]);
  const searchField = useRef();
  const searchTerm = useRef();

  useEffect(() => {
    const getUser = () => {
      fetch("http://localhost:4000/profile", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        "Access-Control-Allow-Origin": "http://localhost:4000",
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success === true) {
            console.log(res);
          } else {
            console.log("Uuups - No user found");
            history.push("/");
          }
        })
        .catch((err) => console.log(err));
    };
    getUser();
  }, []);

  const getUserSearches = () => {
    fetch(`http://localhost:4000/user/usersearchs/${session.userID}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      "Access-Control-Allow-Origin": "http://localhost:4000",
    })
      .then((res) => res.json())
      .then((res) => {
        setFilteredUserSearches(res);
        setUserSearches(res);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getUserSearches();
  }, []);

  const deleteUserSearch = (id) => {
    fetch(`http://localhost:4000/usersearchs/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      "Access-Control-Allow-Origin": "http://localhost:4000",
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const updateUserSearch = (id, body) => {
    fetch(`http://localhost:4000/usersearchs/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      "Access-Control-Allow-Origin": "http://localhost:4000",
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const formatDate = (date) => {
    let formattedDate = new Date(date);
    return formattedDate.toLocaleDateString();
  };

  const getCheckboxList = (id, text) => {
    return (
      <div className="custom-control custom-checkbox">
        <input
          type="checkbox"
          className="custom-control-input"
          id={id}
          disabled
          checked
        />
        <label className="custom-control-label" htmlFor={id}>
          {text}
        </label>
      </div>
    );
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const term = searchTerm.current.value;

    if (!term) {
      setFilteredUserSearches(userSearches);
      return;
    }

    let filtered;
    switch (searchField.current.value) {
      case "Name":
        filtered = userSearches.filter((element) =>
          element.search_name.toLowerCase().includes(term.toLowerCase())
        );
        break;
      case "ENSG Number":
        filtered = userSearches.filter((element) =>
          element.ensg_number.toLowerCase().includes(term.toLowerCase())
        );
        break;
      case "Projects":
        filtered = userSearches.filter((element) =>
          element.project.includes(term)
        );
        break;
      case "Categories":
        filtered = userSearches.filter((element) =>
          element.category.includes(term)
        );
        break;
      case "Data Type":
        filtered = userSearches.filter((element) =>
          element.data_type.includes(term)
        );
        break;
      case "Workflow":
        filtered = userSearches.filter((element) =>
          element.workflow.includes(term)
        );
        break;
      default:
        break;
    }
    setFilteredUserSearches(filtered);
  };

  const handleDelete = (e) => {
    deleteUserSearch(e.target.value);
    setFilteredUserSearches((prev) =>
      prev.filter((item) => item._id !== e.target.value)
    );
    setUserSearches((prev) =>
      prev.filter((item) => item._id !== e.target.value)
    );
  };

  const handlePin = (search) => {
    updateUserSearch(search._id, { pinned: !search.pinned });

    const filteredIndex = filteredUserSearches.findIndex(
      (item) => item._id === search._id
    );
    const newFiltered = [...filteredUserSearches];
    newFiltered[filteredIndex] = {
      ...newFiltered[filteredIndex],
      pinned: !newFiltered[filteredIndex].pinned,
    };
    setFilteredUserSearches(newFiltered);

    const allIndex = userSearches.findIndex((item) => item._id === search._id);
    const newAllSearches = [...userSearches];
    newAllSearches[allIndex] = {
      ...newAllSearches[allIndex],
      pinned: !newAllSearches[allIndex].pinned,
    };
    setUserSearches(newAllSearches);
  };

  const handleShowData = (e) => {
    const index = userSearches.findIndex((item) => item._id === e.target.value);
    history.push(`/savedsearches/${userSearches[index]._id}`);
  };

  if (Object.keys(session).length !== 0) {
    return (
      <div style={{ margin: "20px" }}>
        <h2 className="dark-blue">Your searches</h2>

        <Form.Label as="legend">Search</Form.Label>
        <Form
          className="d-flex w-50 justify-content-between mb-3"
          onSubmit={handleSearchSubmit}
        >
          <Form.Group controlId="FormFieldSelect">
            <Form.Label>Select field</Form.Label>
            <Form.Control as="select" ref={searchField}>
              <option>Name</option>
              <option>ENSG Number</option>
              <option>Projects</option>
              <option>Categories</option>
              <option>Data Type</option>
              <option>Workflow</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formSearchTerm">
            <Form.Label>Enter search term</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search term"
              ref={searchTerm}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="search-button">
            Submit
          </Button>
        </Form>

        {userSearches.length && (
          <div className="list-group custom-list-group">
            {filteredUserSearches
              .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
              .sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1))
              .map((search) => (
                <div className="list-group-item list-group-item-action flex-column align-items-start mb-3 custom-list-item">
                  <div className="d-flex w-100 justify-content-between mb-3">
                    <div className="d-flex">
                      <h5 className="mt-auto mb-auto">{search.search_name}</h5>
                      <div className="vertical-line"></div>
                      <h6 className="mt-auto mb-auto">{search.ensg_number}</h6>
                    </div>
                    <div className="list-icons">
                      <OverlayTrigger
                        key="top-pin"
                        placement="top"
                        overlay={
                          <Tooltip id="tooltip-top">
                            {search.pinned ? "Unpin search" : "Pin search"}
                          </Tooltip>
                        }
                      >
                        <button
                          type="button"
                          className="btn"
                          onClick={() => handlePin(search)}
                          value={search._id}
                        >
                          {search.pinned ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-pin-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A5.921 5.921 0 0 1 5 6.708V2.277a2.77 2.77 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354z" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-pin"
                              viewBox="0 0 16 16"
                            >
                              <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A5.921 5.921 0 0 1 5 6.708V2.277a2.77 2.77 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354zm1.58 1.408l-.002-.001zm-.002-.001l.002.001A.5.5 0 0 1 6 2v5a.5.5 0 0 1-.276.447h-.002l-.012.007-.054.03a4.922 4.922 0 0 0-.827.58c-.318.278-.585.596-.725.936h7.792c-.14-.34-.407-.658-.725-.936a4.915 4.915 0 0 0-.881-.61l-.012-.006h-.002A.5.5 0 0 1 10 7V2a.5.5 0 0 1 .295-.458 1.775 1.775 0 0 0 .351-.271c.08-.08.155-.17.214-.271H5.14c.06.1.133.191.214.271a1.78 1.78 0 0 0 .37.282z" />
                            </svg>
                          )}
                        </button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        key="top-delete"
                        placement="top"
                        overlay={
                          <Tooltip id="tooltip-top">Delete search</Tooltip>
                        }
                      >
                        <button
                          type="button"
                          className="btn"
                          onClick={handleDelete}
                          value={search._id}
                        >
                          <Trash size={16} />
                        </button>
                      </OverlayTrigger>
                    </div>
                  </div>
                  <Row className="mb-1">
                    <Col>
                      <h6>Projects</h6>
                      {search.project.map((element, index) =>
                        getCheckboxList(index, element)
                      )}
                    </Col>
                    <Col>
                      <h6>Categories</h6>
                      {search.category.map((element, index) =>
                        getCheckboxList(index, element)
                      )}
                    </Col>
                    <Col>
                      <h6>Data Type</h6>
                      {search.data_type.map((element, index) =>
                        getCheckboxList(index, element)
                      )}
                    </Col>
                    <Col>
                      <h6>Workflow</h6>
                      {search.workflow.map((element, index) =>
                        getCheckboxList(index, element)
                      )}
                    </Col>
                  </Row>
                  <div className="d-flex w-100 justify-content-between mt-4 mb-1">
                    <button
                      type="button"
                      className="btn btn-primary"
                      value={search._id}
                      onClick={handleShowData}
                    >
                      Show data
                    </button>
                    <p>{formatDate(search.createdAt)}</p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    );
  } else {
    return <div>Please login to access your profile</div>;
  }
}
