import React, { useMemo, useEffect } from 'react';
import {
    Col,
    Row,
    Container,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
    DynamicHeader
} from '../../../widgets';
import Dashboard from './components/Dashboard';
export default function CRMContactsTable({ ...props }) {
    const navigate = useNavigate()
    function headerButtonCallBack() {

    }
    // useEffect(() => {
    //     navigate('/subscription-list')
    // }, []);

    return (
        <>
            <div className="main-content">
                <DynamicHeader titlesmall="Investor Portal"  style={{ marginBottom: '0rem' }} title="DOCUMENTS"  buttontext={""} buttoncallback={headerButtonCallBack} isShowCustomerLogo={true} />
                <Container fluid>
                    <Row className="justify-content-center">
                        <Col xs={12}>
                            <Dashboard />
                        </Col>
                    </Row>
                </Container>
            </div>


        </>
    );
}
