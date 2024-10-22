import { Col, Container, Row } from 'react-bootstrap';
import {
  FeedCTAOne,
  FeedCTATwo,
  FeedHeader,
  FeedPost,
  FeedSales,
  FeedTopEarners,
  ProjectManagementBudget,
  ProjectManagementProgress,
} from '../widgets';

export default function Feed() {
  return (
    <div
      className="main-content bg-fixed-bottom"
      style={{
        backgroundImage: 'url(/img/illustrations/sticky.svg)',
      }}
    >
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12} lg={10} xl={8}>
            <FeedHeader />
            <FeedCTAOne />
            <FeedTopEarners />
            <FeedSales />
            <FeedCTATwo />
            <Row>
              <Col xs={12} xl={6}>
                <ProjectManagementBudget />
              </Col>
              <Col xs={12} xl={6}>
                <ProjectManagementProgress />
              </Col>
            </Row>
            <FeedPost />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
