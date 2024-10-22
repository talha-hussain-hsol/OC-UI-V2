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
import OrganizationDashboard from './organization/OrganizationDashboard';
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
                <DynamicHeader titlesmall="INVESTOR PORTAL"  style={{ marginBottom: '0rem' }} title="Dashboard"  buttontext={""} buttoncallback={headerButtonCallBack} isShowCustomerLogo={true} />
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
