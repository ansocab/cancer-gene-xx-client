import React, { useContext } from "react";
import ProfileManager from "./ProfileManager";
import { Navbar, Nav } from "react-bootstrap";
import { UserContext } from "../Helpers/user";

export default function Navigation() {
  const { user } = useContext(UserContext);

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
            className={`nav-link ${!user && "disabled"}`}
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
