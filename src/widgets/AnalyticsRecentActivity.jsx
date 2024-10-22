import React, { useState } from "react";
import { Card, Col, ListGroup, Row } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";

import { data as latestActivity } from "../pages/investor-portal/dashboard/components/data";

export default function AnalyticsRecentActivity({ ...props }) {
  const [data, setData] = useState(latestActivity?.latest_activity);

  const items = data.map((item, index) => (
    <ListGroup.Item key={index}>
      <Row>
        <Col xs="auto">
          {/* <Avatar size="sm" status={item.status}> */}
          {/* <Avatar.Image src={item.imgSrc} alt={item.title} className="rounded-circle" /> */}
          <FeatherIcon
            icon={item?.startIcon}
            color={item?.startIconColor}
            size="20"
          />
          {/* </Avatar> */}
        </Col>
        <Col className="ms-n2">
          <h5 className="mb-1">{item.title}</h5>
          <p className="small text-gray-700 mb-0">{item.description}</p>
          {/* <small className="text-muted">{item.time}</small> */}
        </Col>
        <Col xs="auto" className="ms-n2">
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "10px",
              height: "30px",
              width: "30px",
              position: "relative",
            }}
          >
            <FeatherIcon
              icon={item?.icon}
              color={item?.startIconColor}
              size="15"
              style={{ position: "absolute", top: "7px", left: "7px" }}
            />
          </div>
        </Col>
      </Row>
    </ListGroup.Item>
  ));

  return (
    <Card {...props}>
      <Card.Header>
        <h4 className="card-header-title">Latest Activity</h4>
        <a className="small" href="#!">
          View all
        </a>
      </Card.Header>
      <Card.Body>
        <ListGroup className="list-group-flush list-group-activity my-n3">
          {items}
        </ListGroup>
      </Card.Body>
    </Card>
  );
}
