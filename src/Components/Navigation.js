import React from "react";
import { connect } from 'react-redux';
import ProfileManager from "./ProfileManager";
import { Navbar, Nav } from "react-bootstrap";
import { getUser, getUserLoading } from "../store/user/selectors";

function Navigation({ user, isLoading }) {

  return (
    <Navbar className="navbar-dark" bg="dark" expand="sm">
      <Navbar.Brand href="/">TCGA Searcher</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarColor02" />
      <Navbar.Collapse id="navbarColor02">
        <Nav className="mr-auto navbar-nav">
          <Nav.Link className="nav-link" href="/">
            New search
          </Nav.Link>
          <Nav.Link
            className={`nav-link ${!user && !isLoading && "disabled"}`}
            href="/savedsearches"
          >
            History
          </Nav.Link>
          <Nav.Link className="nav-link" href="#">
            About
          </Nav.Link>
        </Nav>
        <ProfileManager />
      </Navbar.Collapse>
    </Navbar>
  );
}

const mapStateToProps = state => ({
  user: getUser(state),
  isLoading: getUserLoading(state)
});

export default connect(mapStateToProps)(Navigation);