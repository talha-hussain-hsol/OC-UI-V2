import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import {
    Col,
    Row,
    Container,
} from 'react-bootstrap';
import DynamicHeaderAdministration from '../../../widgets/DynamicHeaderAdministration';
import List from './components/list';
import { useSelector } from "react-redux";

export default function RestrictedList({ ...props }) {
    const params = useParams();
    const cancelTokenSource = axios.CancelToken.source();
    const [isLoader, setIsLoader] = useState(false);
   
  
   const fundDetail = useSelector((state) => state?.fundConfig);


    return (
        <>
            <div className="main-content">
       <DynamicHeaderAdministration fundDetail={fundDetail} style={{ marginBottom: '0rem' }} title="O'Keefe PLC" titlesmall="ADMINISTRATION PORTAL [GLEASON-O'REILLY]"  isShowOrganizationLogo={true} organizationLogo={""} isShowFundLogo={true} fundLogo={""} />
                <Container fluid>
                    <Row className="justify-content-center">
                        <Col xs={12}>
                            <List  fundDetail={fundDetail} />
                        </Col>
                    </Row>
                </Container>
            </div>


        </>
    );
}
