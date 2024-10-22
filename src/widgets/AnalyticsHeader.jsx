import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { Header } from '../components';

export default function AnalyticsHeader({ ...props }) {
  console.log(props,'...props')
  return (
    <Header {...props}>
      <Container fluid>
        <Header.Body>
          <Row className="row align-items-end">
            <Col>
              <Header.Pretitle as="h6">{props?.titlesmall}</Header.Pretitle>
              <Header.Title as="h1">{props?.title}</Header.Title>
            </Col>
            {props?.buttontext?
            <Col xs="auto">
              <Button className="lift" onClick={props?.buttoncallback}>{props?.buttontext}</Button>
            </Col>
            :null 
            }
          </Row>
        </Header.Body>
      </Container>
    </Header>
  );
}
