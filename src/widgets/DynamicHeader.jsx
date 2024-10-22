import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Header } from "../components";

export default function DynamicHeader({ ...props }) {
  const [entityLogo, setEntityLogo] = useState(
    localStorage.getItem("entity_logo")
  );
  useEffect(() => {
    if (!entityLogo) {
      setEntityLogo("/img/entity_logo.png");
    }
  }, [entityLogo]);

  return (
    <Header {...props}>
      <Container fluid>
        <Header.Body>
          <Row className="row align-items-end">
            <Col>
              <Header.Pretitle as="h6">
                <span style={{ textTransform: "none" }}>
                  {props?.titlesmall
                    ? props.titlesmall
                        .split(" ") // Split the string into an array of words
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                        ) // Capitalize the first letter of each word
                        .join(" ") // Join the words back into a string
                    : ""}
                </span>
              </Header.Pretitle>

              <Header.Title as="h1">{props?.title}</Header.Title>
            </Col>
            {props?.buttontext ? (
              <Col xs="auto">
                <Button className="lift" onClick={props?.buttoncallback}>
                  {props?.buttontext}
                </Button>
              </Col>
            ) : null}
            {props?.isShowFundLogo && props?.isShowFundLogo ? (
              <Col xs="auto">
                <h4 class="card-header-title">
                  {/* <img src={entityLogo} style={{ width: "8em", maxHeight: "50px", textAlign: "left", marginLeft: "10px" }} alt="" class="rounded" /> */}
                </h4>
              </Col>
            ) : null}
            {props?.isShowCustomerLogo ? (
              <Col xs="auto">
                <h4 class="card-header-title">
                  {/* <img src={entityLogo} style={{ width: "8em", maxHeight: "50px", textAlign: "left", marginLeft: "10px" }} alt="" class="rounded" /> */}
                </h4>
              </Col>
            ) : null}
          </Row>
        </Header.Body>
      </Container>
    </Header>
  );
}
