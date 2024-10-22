import { Link } from 'react-router-dom'
import { Button, Col, Container, Row } from 'react-bootstrap';

export default function Error() {
  return (
    <div className="d-flex align-items-center min-vh-100 bg-auth border-top border-top-2 border-primary">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={5} xl={4} className="my-5">
            <div className="text-center">
              <h6 className="text-uppercase text-muted mb-4">404 error</h6>
              <h1 className="display-4 mb-3">There’s no page here 😭</h1>
              <p className="text-muted mb-4">Looks like you ended up here by accident?</p>
              <Link to="/">
                <Button size="lg">Return to your dashboard</Button>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
