import { Col, Container, Row, Nav } from 'react-bootstrap';
import React from 'react';
import SubscriptionCapitalizationOverView from './capitalization/subscription-capitalization-overView';
import SubscriptionCapitalizationGraph from './capitalization/subscription-capitalization-graph';
import SubscriptionCapitalizationLegend from './capitalization/subscription-capitalization-legend';
import SubscriptionCapitalizationTable from './capitalization/subscription-capitalization-table';

export default function overview() {

    return (
        <div className="main-content">
            <Container fluid>
                <Row className="justify-content-center">
                    <Col xs={12} lg={12} xl={12}>
                    </Col>
                    <Col xs={12} lg={4} xl={4}>
                        <SubscriptionCapitalizationOverView />
                    </Col>
                    <Col xs={12} lg={4} xl={4}>
                        <SubscriptionCapitalizationGraph />
                    </Col>
                    <Col xs={12} lg={4} xl={4}>
                        <SubscriptionCapitalizationLegend />
                    </Col>
                    <Col xs={12} lg={12} xl={12}>
                        <SubscriptionCapitalizationTable />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
