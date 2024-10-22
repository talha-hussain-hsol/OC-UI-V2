import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import React from 'react';
import { Col, Nav, Row } from 'react-bootstrap';
import { Header } from '../components';

export default function AccountHeader({ ...props }) {
  const history = useLocation();

  return (
    <Header className="mt-md-5" {...props}>
      <Header.Body>
        <Row className="align-items-center">
          <Col>
            <Header.Pretitle>Overview</Header.Pretitle>
            <Header.Title>Account</Header.Title>
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <Header.Tabs className="nav-overflow">
              <Nav.Item>
                <Link to="/account-general" passHref>
                  <Nav.Link active={history.pathname === '/account-general'}>General</Nav.Link>
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link to="/account-billing" passHref>
                  <Nav.Link active={history.pathname === '/account-billing'}>Billing</Nav.Link>
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link to="/account-members" passHref>
                  <Nav.Link active={history.pathname === '/account-members'}>Members</Nav.Link>
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link to="/account-security" passHref>
                  <Nav.Link active={history.pathname === '/account-security'}>Security</Nav.Link>
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link to="/account-notifications" passHref>
                  <Nav.Link active={history.pathname === '/account-notifications'}>Notifications</Nav.Link>
                </Link>
              </Nav.Item>
            </Header.Tabs>
          </Col>
        </Row>
      </Header.Body>
    </Header>
  );
}
