import React, { useState} from "react";
import {useParams } from "react-router-dom";
import axios from "axios";

import { Col, Row, Container } from "react-bootstrap";
import  DynamicHeaderAdministration  from "../../../../widgets/DynamicHeaderAdministration";
import List from "./components/list";

// import FundList from './components/fundList';
export default function DueDiligence({ ...props }) {
  const params = useParams();
  const cancelTokenSource = axios.CancelToken.source();
  const [fundDetail, setFundDetail] = useState(props?.fundDetail);
  const [isLoader, setIsLoader] = useState(false);

  return (
    <>
      <div className="main-content">
       
        <DynamicHeaderAdministration
    
          style={{ marginBottom: "0rem" }}
          title="O'Keefe PLC"
          titlesmall="ADMINISTRATION PORTAL [GLEASON-O'REILLY]"
          isShowOrganizationLogo={true}
          organizationLogo={""}
          isShowFundLogo={true}
          fundLogo={""}
        />
 
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
