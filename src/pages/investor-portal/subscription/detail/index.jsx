import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import NumberFormat from 'react-number-format';
import { Avatar } from '../../../../components';
import { Flatpickr } from '../../../../components/vendor';
import { SubscriptionDetailHeader } from '../../../../widgets';

export default function AccountGeneral() {
  return (
    <div className="main-content">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12} lg={12} xl={12}>
            <SubscriptionDetailHeader />
           
          </Col>
        </Row>
      </Container>
    </div>
  );
}
