import FeatherIcon from 'feather-icons-react';
import React from 'react';
import { Badge, Card, Col, Row } from 'react-bootstrap';

export default function AnalyticsValue(props) {
  console.log(props,'propspropsprops AnalyticsValue')
  return (
    <Card {...props}>
      <Card.Body>
        <Row className="align-items-center" style={{ padding: '20px' }}>
          <Col xs="auto">
            <div
              style={{
                backgroundColor: '#45d000',
                borderRadius: '50%',
                height: '50px',
                width: '50px',
                position: 'relative',
              }}
            >
              <FeatherIcon
                icon="dollar-sign"
                size="20"
                style={{ position: 'absolute', top: '15px', left: '15px' }}
              />
            </div>
          </Col>
          <Col>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h4 className=" mb-2">
                {props?.data?.widgets?.performance_document?.title}
              </h4>
              <span className="h5 mb-0  text-muted">
                {props?.data?.widgets?.performance_document?.description2}
              </span>
            </div>
            <h4 className=" mb-2">
              {props?.data?.widgets?.performance_document?.description1}
            </h4>
            <h3 className=" mb-2">
              {props?.data?.widgets?.performance_document?.amount}
            </h3>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
