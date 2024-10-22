import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { ProfileHeader } from '../../../widgets';

export default function AccountGeneral() {
  return (
    <div className="main-content">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12} lg={8} xl={8}>
            <ProfileHeader />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
