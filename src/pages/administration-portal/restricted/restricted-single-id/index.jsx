import React, { useState, useEffect } from "react";
import {  useParams } from "react-router-dom";
import axios from "axios";
import {
    Col,
    Row,
    Container,
} from 'react-bootstrap';
import DynamicHeaderAdministration from '../../../../widgets/DynamicHeaderAdministration';
import List from './components/list';
import { getFundDetailAPI } from "../../../../api/network/AdministrationApi/AdministrationApi";

// import FundList from './components/fundList';
export default function RestrictedListSingle({ ...props }) {
    const params = useParams();
    const cancelTokenSource = axios.CancelToken.source();
    const [fundDetail, setFundDetail] = useState(null);
    const [isLoader, setIsLoader] = useState(false);
    useEffect(
      function () {
        if (params?.fund_id) {
          getFundDetail();
        }
      },
      [params?.fund_id]
    );
  
    const getFundDetail = async () => {
      setIsLoader(true);
      const response = await getFundDetailAPI(params?.fund_id, cancelTokenSource.token);
      if (response.success == true) {
        setIsLoader(false);
        setFundDetail(response?.data);
      } else {
        setIsLoader(false);
      }
    };
    
    return (
        <>
            <div className="main-content">
             <DynamicHeaderAdministration fundDetail={fundDetail} style={{ marginBottom: '0rem' }} title="O'Keefe PLC" titlesmall="ADMINISTRATION PORTAL [GLEASON-O'REILLY]"  isShowOrganizationLogo={true} organizationLogo={""} isShowFundLogo={true} fundLogo={""} />
                <Container fluid>
                    <Row className="justify-content-center">
                        <Col xs={12}>
                            <List />
                        </Col>
                    </Row>
                </Container>
            </div>


        </>
    );
}
