import ProfileManager from "./ProfileManager";
import { Navbar, Nav } from "react-bootstrap";

export default function Navigation() {
  return (
    <Navbar className="navbar-dark" bg="dark" expand="sm">
      <Navbar.Brand href="/">BestNameEver</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarColor02" />
      <Navbar.Collapse id="navbarColor02">
        <Nav className="mr-auto navbar-nav">
          <Nav.Link className="nav-link" href="/">
            Home
          </Nav.Link>
          <Nav.Link className="nav-link" href="/savedsearches">
            Searches
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
