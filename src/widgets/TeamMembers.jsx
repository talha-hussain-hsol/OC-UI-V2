import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom'
import React from 'react';
import { Card, Col, Dropdown, ListGroup, Row } from 'react-bootstrap';
import { Avatar } from '../components';
import { getStatusColor } from '../helpers';

export default function TeamMembers({ ...props }) {
  const data = [
    {
      imgSrc: '/img/avatars/profiles/avatar-1.jpg',
      status: 'Online',
      title: 'Dianna Smiley',
    },
    {
      imgSrc: '/img/avatars/profiles/avatar-2.jpg',
      status: 'Online',
      title: 'Ab Hadley',
    },
    {
      imgSrc: '/img/avatars/profiles/avatar-3.jpg',
      status: 'Offline',
      title: 'Adolfo Hess',
    },
    {
      imgSrc: '/img/avatars/profiles/avatar-5.jpg',
      status: 'Busy',
      title: 'Daniela Dewitt',
    },
  ];

  const items = data.map((item, index) => (
    <ListGroup.Item key={index}>
      <Row className="align-items-center">
        <Col xs="auto">
          <Link to="/profile-posts" passHref>
            <Avatar as="a">
              <Avatar.Image
                className="rounded-circle"
                src={item.imgSrc}
                alt="..."
              />
            </Avatar>
          </Link>
        </Col>
        <Col className="ms-n2">
          <h4 className="mb-1">
            <Link to="/profile-posts">
              <a>{item.title}</a>
            </Link>
          </h4>
          <Card.Text className="small">
            <span className={`text-${getStatusColor(item.status)}`}> </span>{" "}
            {item.status}
          </Card.Text>
        </Col>
        <Col xs="auto">
          <Dropdown align="end">
            <Dropdown.Toggle
              as="span"
              className="dropdown-ellipses"
              role="button"
            >
              <FeatherIcon icon="more-vertical" size="17" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#!">Action</Dropdown.Item>
              <Dropdown.Item href="#!">Another action</Dropdown.Item>
              <Dropdown.Item href="#!">Something else here</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
    </ListGroup.Item>
  ));

  return (
    <Card {...props}>
      <Card.Header>
        <h4 className="card-header-title">Members</h4>
        <Link to="/profile-posts">
          <a className="small">View all</a>
        </Link>
      </Card.Header>
      <Card.Body>
        <ListGroup className="list-group-flush my-n3">{items}</ListGroup>
      </Card.Body>
    </Card>
  );
}
