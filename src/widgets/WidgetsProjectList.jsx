import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom'
import React from 'react';
import { Card, Col, Dropdown, ListGroup, Row } from 'react-bootstrap';
import { Avatar } from '../components';

export default function WidgetsProjectList({ ...props }) {
  const data = [
    {
      imgSrc: '/img/avatars/projects/project-1.jpg',
      title: 'Homepage Redesign',
    },
    {
      imgSrc: '/img/avatars/projects/project-2.jpg',
      title: 'Travels & Time',
    },
    {
      imgSrc: '/img/avatars/projects/project-3.jpg',
      title: 'Safari Exploration',
    },
    {
      imgSrc: '/img/avatars/projects/project-4.jpg',
      title: 'Personal Site',
    },
  ];

  const items = data.map((item, index) => (
    <ListGroup.Item key={index}>
      <Row className="align-items-center">
        <Col xs="auto">
          <Link to="/project-overview">
            <Avatar as="a" ratio="4by3">
              <Avatar.Image className="rounded" src={item.imgSrc} alt="..." />
            </Avatar>
          </Link>
        </Col>
        <Col className="ms-n2">
          <h4 className="mb-1">
            <Link to="/project-overview">
              <a>{item.title}</a>
            </Link>
          </h4>
          <Card.Text className="small text-muted">
            <time dateTime="2018-05-24">Updated 4hr ago</time>
          </Card.Text>
        </Col>
        <Col xs="auto">
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
