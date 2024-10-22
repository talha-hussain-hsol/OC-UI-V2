import { Link, useLocation, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Col, Nav, Row, Button, Dropdown } from "react-bootstrap";
import { Header } from "../components";
import { getParticularsDetailByIdentityIdAPI } from "../api/network/customerApi";
import { getFundDetailAPI } from "../api/network/administrationApi/administrationAPI";
import axios from "axios";
import FeatherIcon from "feather-icons-react";
import { Breadcrumb } from "react-bootstrap";

export default function AdministrationKYWHeader({ ...props }) {
  const history = useLocation();
  const params = useParams();
  const cancelTokenSource = axios.CancelToken.source();
  const [label, setLabel] = useState("");
  const [identityData, setIdentityData] = useState("");
  const [fundDetail, setFundDetail] = useState("");
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
  useEffect(
    function () {
      if (params?.fund_id) {
        getFundDetail();
      }
    },
    [params?.fund_id]
  );
  const getFundDetail = async () => {
    const response = await getFundDetailAPI(
      params?.fund_id,
      cancelTokenSource.token
    );
    if (response.success == true) {
      setFundDetail(response?.data);
    } else {
    }
  };
  return (
    <Header className="mt-md-2" {...props}>
      <Header.Body>
        <Row className="align-items-center">
          <div className="col-auto">
            <div className="avatar avatar-md">
              {fundDetail?.fund_logo_url && (
                <img
                  src={fundDetail?.fund_logo_url}
                  alt="..."
                  className="avatar-img rounded"
                />
              )}
            </div>
          </div>
          <Col>
            <Header.Pretitle as="h6">
              <span style={{ textTransform: "none" }}>Compliance Portal</span>
            </Header.Pretitle>
            <Header.Title>{fundDetail?.name}</Header.Title>
          </Col>
          <Col xs="auto">
            <h4 class="card-header-title">
              <img
                src="https://storage.googleapis.com/ascentfs-media-public/public-data/organizations/ascent-fs/logo/ascent-fs-logo.png"
                style={{
                  maxHeight: "35px",
                  textAlign: "left",
                  marginLeft: "10px",
                }}
                alt=""
                class="rounded"
              />
            </h4>
          </Col>
        </Row>
        <Row style={{ marginTop: "15px", padding: "5px 0px" }}>
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item to="#!">
                <Link to="/">Dashboard</Link>
              </Breadcrumb.Item>
              <FeatherIcon icon="chevron-right" size="1em" />
              <Breadcrumb.Item href="#!">
                <Link to={`/${params?.fund_id}/kyw/wallets/list`}>
                  Wallet List
                </Link>
              </Breadcrumb.Item>
              <FeatherIcon icon="chevron-right" size="1em" />
              <Breadcrumb.Item active>{props?.pageType}</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
      </Header.Body>
    </Header>
  );
}
