import { Link } from 'react-router-dom'
import React from 'react';
import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
import { Avatar } from '../components';
import { getStatusColor } from '../helpers';

export default function WidgetsProfileList({ ...props }) {
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
          <Button variant="white" size="sm">
            Follow
          </Button>
        </Col>
      </Row>
    </ListGroup.Item>
  ));

  return (
    <Card {...props}>
      <Card.Body>
        <ListGroup className="list-group-flush my-n3">{items}</ListGroup>
      </Card.Body>
    </Card>
  );
}
