import { Link, useLocation, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Col, Nav, Row, Button, Dropdown } from "react-bootstrap";
import { Header } from "../components";
import { getParticularsDetailByIdentityIdAPI } from "../api/network/customerApi";
import axios from "axios";
import FeatherIcon from "feather-icons-react";
import { Breadcrumb } from "react-bootstrap";

export default function AdministrationTransactionHeader({ ...props }) {
  const history = useLocation();
  const params = useParams();
  const cancelTokenSource = axios.CancelToken.source();
  const [label, setLabel] = useState("");
  const [identityData, setIdentityData] = useState("");
  useEffect(() => {
    if (params?.identity_id) {
      getSpecificIdentity(params?.identity_id);
    }
  }, [params?.identity_id]);

  let { identity_id } = useParams();
  let identity_id_value = "";
  if (params.identity_id) {
    identity_id_value = "/" + params.identity_id;
  }
  if (params.account_id) {
    identity_id_value = identity_id_value + "/" + params.account_id;
  }
  const getSpecificIdentity = async (identity_id) => {
    const response = await getParticularsDetailByIdentityIdAPI(
      identity_id,
      cancelTokenSource.token
    );
    if (response.success == true) {
      if (response?.data?.parentId != "0") {
        setIdentityData(response.data);
        setLabel(response.data?.label);
      } else {
        setLabel("");
      }
    } else {
    }
  };
  return (
    <Header className="mt-md-2" {...props}>
      <Header.Body>
        <Row className="align-items-center">
          <Col>
            <Header.Pretitle>{props?.smallTitle}</Header.Pretitle>
            <Header.Title>{props?.type}</Header.Title>
            <p
              style={{ marginBottom: "0px", fontWeight: 500, fontSize: "12px" }}
            >
              {props?.pageType}
            </p>
            <h3>{props?.entityName}</h3>
          </Col>
          {props?.isShowOrganizationLogo ? (
            <div className="col-auto">
              <img
                src={props?.organizationLogo}
                style={{ maxHeight: "50px", textAlign: "left" }}
                alt=""
                className="rounded"
              />
            </div>
          ) : null}
        </Row>
        <Row
          style={{
            borderTop: "1px solid #1e3a5c",
            marginTop: "15px",
            padding: "5px 0px",
          }}
        >
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item to="#!">
                <Link to="/">Dashboard</Link>
              </Breadcrumb.Item>
              <FeatherIcon icon="chevron-right" size="1em" />
              <Breadcrumb.Item href="#!">
                <Link to={`/${params?.fund_id}/transactions/list`}>
                  Transaction List
                </Link>
              </Breadcrumb.Item>
              <FeatherIcon icon="chevron-right" size="1em" />
              <Breadcrumb.Item active>{props?.pageType}</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <Header.Tabs className="nav-overflow">
              <Nav.Item>
                <Link
                  to={`/${params?.fund_id}/kyc/account/identity/${params?.type}/screening/${params?.identity_id}/${params?.account_id}`}
                >
                  <Nav.Link
                    href={`/${params?.fund_id}/kyc/account/identity/${params?.type}/screening/${params?.identity_id}/${params?.account_id}`}
                    active={
                      history.pathname.indexOf("screening") > -1 ? true : false
                    }
                  >
                    Screening
                  </Nav.Link>
                </Link>
              </Nav.Item>
            </Header.Tabs>
          </Col>
        </Row>
      </Header.Body>
    </Header>
  );
}
