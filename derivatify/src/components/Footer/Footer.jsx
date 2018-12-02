/*eslint-disable*/
import React from "react";
// used for making the prop types of this component
import PropTypes from "prop-types";

// reactstrap components
import { Container, Row, Nav, NavItem, NavLink } from "reactstrap";

class Footer extends React.Component {
  // Exebit is love and life! 
  // Please contact us at sales@exebit.fi to get  
  //    this code dirty in 2 days 
  // or this code clean in 4 days
  // :) Pls, I'm poor
  
  render() {
    return (
      <footer className="footer">
        <Container fluid>
          <Nav>
            <NavItem>
              <NavLink href="https://exebit.fi">Exebit Oy</NavLink>
            </NavItem>
          </Nav>
          <div className="copyright">
            © {new Date().getFullYear()} Exebit Oy
          </div>
        </Container>
      </footer>
    );
  }
}

export default Footer;
