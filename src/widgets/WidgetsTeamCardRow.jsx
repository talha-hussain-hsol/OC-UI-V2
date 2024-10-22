import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom'
import React from 'react';
import { Card, Col, Dropdown, Row } from 'react-bootstrap';
import { Avatar } from '../components';

export default function WidgetsTeamCardRow({ ...props }) {
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
            <Link to="/team-overview" passHref>
              <Avatar as="a">
                <Avatar.Image className="rounded" src="/img/avatars/teams/team-logo-1.jpg" alt="..." />
              </Avatar>
            </Link>
          </Col>
          <Col className="ms-n2">
            <h4 className="mb-1">
              <Link to="/team-overview">
                <a>Launchday</a>
              </Link>
            </h4>
            <small className="text-muted">
              <FeatherIcon icon="clock" size="1em" /> Updated 2hr ago
            </small>
          </Col>
          <Col xs="auto">{dropdown}</Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
