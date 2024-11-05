import React from "react";
import { Col, Row, Container } from "react-bootstrap";
import DynamicHeaderAdministration from "../../../../widgets/DynamicHeaderAdministration";
import List from "./components/list";

export default function ExpiringDocumentList({ ...props }) {
  return (
    <>
      <div className="main-content">
        <DynamicHeaderAdministration style={{ marginBottom: "0rem" }} title="O'Keefe PLC" titlesmall="ADMINISTRATION PORTAL [GLEASON-O'REILLY]" isShowOrganizationLogo={true} organizationLogo={""} isShowFundLogo={true} fundLogo={""} />
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
