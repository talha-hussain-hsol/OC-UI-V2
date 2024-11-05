import { Button, Col, Container, Form, Row, Nav } from "react-bootstrap";
import React from "react";
import { useParams } from "react-router-dom";
import Individual from "./particulars/individual";
import DynamicHeaderAdministration from "../../../../widgets/DynamicHeaderAdministration"

export default function particular({handleSelectIdentity={},isWizard = false,selectedIdentity = {},title}) { 
  const params = useParams();
  return (
    <div className="main-content">
           {!(isWizard) &&  <DynamicHeaderAdministration style={{ marginBottom: '0rem' }}  title="Create Customer" titlesmall="Compliance Portal"  isShowOrganizationLogo={true} organizationLogo={""} isShowFundLogo={true} fundLogo={""} isShowFundTabs={false} />}

       
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12} lg={10} xl={10}>
            <form>
              <Individual title={title} isWizard={isWizard} handleSelectIdentity={handleSelectIdentity}  selectedIdentity={selectedIdentity}/>
            </form>
            <br />
            <br />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
