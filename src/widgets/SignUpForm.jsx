import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom'
import React from 'react';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';

export default function SignUpForm() {
  return (
    <>
      <h1 className="display-4 text-center mb-3">Sign up</h1>
      <p className="text-muted text-center mb-5">Free access to our dashboard.</p>
      <form>
        <div className="form-group">
          <Form.Label>Email Address</Form.Label>
          <Form.Control type="email" placeholder="name@address.com" />
        </div>
        <div className="form-group">
          <Row>
            <Col>
              <Form.Label>Password</Form.Label>
            </Col>
            <Col xs="auto">
              <Link to="/password-reset" passHref>
                <Form.Text as="a" className="small text-muted">
                  Forgot password?
                </Form.Text>
              </Link>
            </Col>
          </Row>
          <InputGroup className="input-group-merge">
            <Form.Control type="password" placeholder="Enter your password" />
            <InputGroup.Text>
              <FeatherIcon icon="eye" size="1em" />
            </InputGroup.Text>
          </InputGroup>
        </div>
        <Button size="lg" className="w-100 mb-3">
          Sign up
        </Button>
        <p className="text-center">
          <small className="text-muted text-center">
            Already have an account?{' '}
            <Link to="/sign-in">
              <a>Log in</a>
            </Link>
            .
          </small>
        </p>
      </form>
    </>
  );
}
