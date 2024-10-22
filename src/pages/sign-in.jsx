import {
  Col,
  Container,
  Row,
  Navbar,
  Nav,
  NavDropdown,
  Dropdown,
  Button,
} from "react-bootstrap";

import React, { useState, useEffect, useCallback } from "react";

export default function SignIn() {
  // const [isLoading, setIsLoading] = useState(true);
  function generateRandomString() {
    let result = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < 40; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const handleSignIn = async () => {
    let state = generateRandomString();
    let url = `${process.env.AUTH_API_URL}/oauth/authorize?client_id=${process.env.INVESTOR_CLIENT_ID}&redirect_uri=${process.env.INVESTOR_REDIRECT_URL}&scope=*&staet=${state}&response_type=${process.env.INVESTOR_RESPONSE_TYPE}`;
    window.location.href = url;
  };

  return (
    <div style={{ backgroundColor: "#0a0c23", height: "100vh" }}>
      <Navbar
        expand="xl"
        bg="dark"
        variant="dark"
        className="navbar-vibrant"
        style={{
          border: 0,
          paddingLeft: "20px",
          paddingRight: "20px",
          position: "relative",
          zIndex: "10000",
        }}
      >
        <Container fluid>
          <Navbar.Brand href="#!">
            <img style={{ maxHeight: "2.5rem" }} src="/img/logo.png" />
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ms-auto">
              <Nav.Item>
                <Button
                  size="lg"
                  onClick={() => {
                    handleSignIn();
                  }}
                >
                  Login
                </Button>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* <SimpleImageSlider
          width={"100%"}
          height={"90vh"}
          images={images}
          showBullets={true}
          showNavs={false}
          autoPlay={true}
        /> */}

      <Container style={{ position: "relative" }}>
        <Row className="justify-content-center">
          <Col xs={12} md={12} xl={12} className="my-5">
            <div class="row">
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <div class="slider-content" style={{ marginTop: "75px" }}>
                  <h2
                    data-animation="animated bounceInLeft"
                    style={{ fontSize: "42px" }}
                    class=""
                  >
                    Harnessing the Power of <br /> E-KYC for Regulatory
                    Compliance
                  </h2>

                  <h3
                    data-animation="animated bounceInLeft"
                    class=""
                    style={{ fontSize: "25px" }}
                  >
                    <i>
                      Our tailor-made E-KYC Solutions grant businesses a
                      streamlined and automated process that allows for
                      effortless workflow.
                    </i>
                  </h3>
                </div>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 hidden-xs hidden-sm">
                <div
                  class="main-img wow  fadeInUp  animated"
                  data-wow-duration="1.0s"
                >
                  <img src="./img/Onboarding.png" alt="" />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
