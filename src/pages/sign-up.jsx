import { Col, Container, Row } from 'react-bootstrap';
import { SignUpForm } from '../widgets';
import React from "react";

export default function SignUp() {
  return (
    <div className="d-flex align-items-center min-vh-100 bg-auth border-top border-top-2 border-primary">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={5} xl={4} className="my-5">
            <SignUpForm />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
