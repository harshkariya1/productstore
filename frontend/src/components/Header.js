import React, { useContext, useEffect } from "react";
import { Navbar, Container, Button, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { toast } from "sonner";
import { UserContext } from "../Context/UserContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, setUser, getProfile } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser({});
    navigate("/login");
    toast.success("Logout Success");
  };

  useEffect(() => {
    checkTokenExpiration();
    // const intervalId = setInterval(checkTokenExpiration, 20000);
    // return () => clearInterval(intervalId);
  }, []);

  function checkTokenExpiration() {
    const authToken = localStorage.getItem("token");

    if (!authToken) {
      return;
    }

    try {
      const decodedToken = jwtDecode(authToken);
      console.log(decodedToken.exp, Math.floor(Date.now() / 1000));

      if (decodedToken.exp < Math.floor(Date.now() / 1000)) {
        handleLogout();
      } else {
        getProfile();
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      handleLogout();
    }
  }

  const authToken = localStorage.getItem("token");
  const profilePicPath = user ? user.profilePic : null;
  const profilePic = profilePicPath
    ? `http://localhost:5000/assets/${profilePicPath}`
    : ``;

  return (
    <Navbar fixed="top" className="bg-body-tertiary">
       <Container fluid className="position-relative z-index-1000">
        <Link to="/allproducts">
          <Button variant="Link">product Store</Button>
        </Link>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <div className="d-flex gap-4">
            {authToken ? (
              <div className="d-flex justify-content-center align-items-center gap-4">
                <Link to="/add">
                  <Button variant="primary">Add product</Button>
                </Link>
                <Link to="/listBooks">
                  <Button variant="secondary">all products</Button>
                </Link>
                <Link to="/profile">
                  <Image
                    src={profilePic}
                    alt="Profile"
                    roundedCircle
                    width="55"
                    height="50"
                  />
                </Link>
                <Button onClick={handleLogout} variant="secondary">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="d-flex justify-content-center align-items-center gap-4">
                <Link to="/ ">
                  <Button variant="secondary">Register</Button>
                </Link>
                <Link to="/login">
                  <Button variant="primary">Login</Button>
                </Link>
              </div>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;