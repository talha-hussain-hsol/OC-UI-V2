import React from "react";
import { Badge, Card, Col, Row } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faMoneyBillTrendUp } from "@fortawesome/free-solid-svg-icons";
export default function AnalyticsValue(props) {
  return (
    <Card {...props}>
      <Card.Body>
        <Row className="align-items-center" style={{ padding: "20px" }}>
          <Col xs="auto">
            <div
              style={{
                backgroundColor: "#45d000",
                borderRadius: "50%",
                height: "50px",
                width: "50px",
                position: "relative",
              }}
            >
              <FontAwesomeIcon
                icon={faMoneyBillTrendUp}
                size="20"
                style={{ position: "absolute", top: "17px", left: "17px" }}
              />
            </div>
          </Col>
          <Col>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4 className=" mb-2">
                {props?.data?.widgets?.account_detail?.title}
              </h4>
              <span className="h5 mb-0 text-muted">
                {props?.data?.widgets?.account_detail?.description2}
              </span>
            </div>
            <h4 className=" mb-2">
              {props?.data?.widgets?.account_detail?.description1}
            </h4>
            <h4 className=" mb-2">
              {props?.data?.widgets?.account_detail?.amount}
            </h4>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
