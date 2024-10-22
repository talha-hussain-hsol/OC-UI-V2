import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom'
import React from 'react';
import { Card, Col, Dropdown, Row } from 'react-bootstrap';
import { Avatar } from '../components';
import { getStatusColor } from '../helpers';

export default function WidgetsProfileCardRow({ ...props }) {
  const dropdown = (
    <Dropdown align="end">
      <Dropdown.Toggle as="span" className="dropdown-ellipses" role="button">
        <FeatherIcon icon="more-vertical" size="17" />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item href="#!">Action</Dropdown.Item>
        <Dropdown.Item href="#!">Another action</Dropdown.Item>
        <Dropdown.Item href="#!">Something else here</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  return (
    <Card {...props}>
      <Card.Body>
        <Row className="align-items-center">
          <Col xs="auto">
            <Link to="/profile-posts" passHref>
              <Avatar as="a">
                <Avatar.Image
                  src="/img/avatars/profiles/avatar-1.jpg"
                  className="rounded-circle"
                  alt="Dianna Smiley"
                />
              </Avatar>
            </Link>
          </Col>
          <Col className="ms-n2">
            <h4 className="mb-1">
              <Link to="/profile-posts">
                <a>Dianna Smiley</a>
              </Link>
            </h4>
            <Card.Text className="small">
              <span className={`text-${getStatusColor("Online")}`}> </span>{" "}
              Online
            </Card.Text>
          </Col>
          <Col xs="auto">{dropdown}</Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
