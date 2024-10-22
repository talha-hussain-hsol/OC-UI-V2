import { Col, Container, Row, Nav } from 'react-bootstrap';
import React from 'react';
import SubscriptionOverViewGraphNav from './overview/subscription-over-view-graph-nav';
import SubscriptionOverviewGraphPerformance from './overview/subscription-overview-graph-performance';

export default function myNav() {

    return (
        <div className="main-content">
            <Container fluid>
                <Row className="justify-content-center">
                    <Col xs={12} lg={12} xl={12}>
                        
                        <SubscriptionOverViewGraphNav />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
