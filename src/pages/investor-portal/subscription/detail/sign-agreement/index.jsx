import { Col, Container, Row, Nav } from 'react-bootstrap';
import { DynamicHeader } from '../../../../../widgets';
import React from 'react';
import InitialInvestment from './initial-investment';

export default function index() {
function headerButtonCallBack(){

}
    return (
        <div className="main-content">
            <DynamicHeader style={{ marginBottom: '1rem' }} title="Fund Dashboard" titlesmall="INVESTOR PORTAL" buttontext={""} buttoncallback={headerButtonCallBack} isShowFundLogo={true} />
            <Container fluid>
                <Row className="justify-content-center">
                    <Col xs={12} lg={12} xl={12}>
                        <InitialInvestment/>
                     </Col>
                </Row>
            </Container>
        </div>
    );
}
