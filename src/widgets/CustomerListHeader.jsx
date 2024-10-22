import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row, Nav } from "react-bootstrap";
import { Header } from "../components";

export default function AccountHeader({ ...props }) {
  const [entityLogo, setEntityLogo] = useState(
    localStorage.getItem("entity_logo")
  );

  return (
    <Header className="mt-md-2" {...props}>
      <Header.Body>
        <div className="row align-items-end">
          <div className="col">
            <Header.Pretitle as="h6">
              <span style={{ textTransform: "none" }}>
                {props?.title
                  ? props?.title
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
            <h1 className="header-title">Customer List</h1>
          </div>

          <Col xs="auto">
            <h4 class="card-header-title">
              <img
                src={entityLogo}
                style={{
                  width: "8em",
                  maxHeight: "50px",
                  textAlign: "left",
                  marginLeft: "10px",
                }}
                alt=""
                class="rounded"
              />
            </h4>
          </Col>
        </div>
      </Header.Body>
    </Header>
  );
}
