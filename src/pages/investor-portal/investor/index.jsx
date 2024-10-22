import React, { useMemo } from "react";
import { Col, Row, Container } from "react-bootstrap";
import { DynamicHeader } from "../../../widgets";
import OrganizationInvestors from "./organization/OrganizationInvestors";
import InvestorSubscriptionList from "./investor/InvestorSubscriptionList";
import { loginCustomer } from "../../../api/network/customerApi";

export default function CRMContactsTable({ ...props }) {
  function headerButtonCallBack() {}
  return (
    <>
      <div className="main-content">
        <DynamicHeader
          style={{ marginBottom: "0rem" }}
          title="Investors"
          titlesmall="OverView"
          buttontext={""}
          buttoncallback={headerButtonCallBack}
        />
        <Container fluid>
          <Row className="justify-content-center">
            <Col xs={12}>
              <InvestorSubscriptionList />
              {/* <OrganizationInvestors /> */}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
