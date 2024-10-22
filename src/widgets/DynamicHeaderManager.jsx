import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";

import { Link, useParams, useLocation } from "react-router-dom";
import { getFundDetailAPI } from "../api/network/administrationApi/administrationAPI";
import axios from "axios";

export default function DynamicHeaderAdministration({ ...props }) {
  const params = useParams();
  const cancelTokenSource = axios.CancelToken.source();
  const history = useLocation();
  const [fundDetail, setFundDetail] = useState(null);
  const [entityLogo, setEntityLogo] = useState(
    localStorage.getItem("entity_logo")
  );
  console.log(history.pathname, "history.pathname");
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
    <div className="header">
      <div className="container-fluid">
        <div className="header-body">
          <div className="row align-items-end">
            <div className="col-auto">
              {props?.isShowFundLogo && (
                <div className="avatar avatar-md">
                  {fundDetail?.fund_logo_url && (
                    <img
                      src={fundDetail?.fund_logo_url}
                      alt="..."
                      className="avatar-img rounded"
                    />
                  )}
                </div>
              )}
            </div>
            <div className="col">
              <h6 className="header-pretitle">MANAGER PORTAL</h6>

              <h1 className="header-title">{fundDetail?.name}</h1>
            </div>
            <div className="col-auto">
              <ul className="nav nav-tabs header-tabs">
                {params?.fund_id == 215 && (
                  <li className="nav-item">
                    <Link
                      to={`/${params?.fund_id}/dashboard`}
                      className={
                        history.pathname.indexOf("dashboard") > -1
                          ? "nav-link text-center active"
                          : "nav-link text-center"
                      }
                    >
                      Dashboard
                    </Link>
                  </li>
                )}
                {params?.fund_id == 215 && (
                  <li className="nav-item">
                    <Link
                      to={`/${params?.fund_id}/performance-document`}
                      className={
                        history.pathname.indexOf("performance-document") > -1
                          ? "nav-link text-center active"
                          : "nav-link text-center"
                      }
                    >
                      Documents
                    </Link>
                  </li>
                )}

                <li className="nav-item">
                  <Link
                    to={`/${params?.fund_id}/kyc/account/list`}
                    className={
                      history.pathname.indexOf("kyc") > -1
                        ? "nav-link text-center active"
                        : "nav-link text-center"
                    }
                  >
                    KYC
                  </Link>
                </li>

                {/* <li className="nav-item">
                  <Link to={`/${params?.fund_id}/kyw/wallets/list`} className={history.pathname.indexOf("kyw") > -1 ?"nav-link text-center active":"nav-link text-center"}>
                    KYW
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={`/${params?.fund_id}/transactions/list`} className={history.pathname.indexOf("transactions") > -1 ?"nav-link text-center active":"nav-link text-center"}>
                    Transactions
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to={`/${params?.fund_id}/restricted/list`} className={history.pathname.indexOf("restricted") > -1 ?"nav-link text-center active":"nav-link text-center"}>
                    Restricted Lists
                  </Link>
                </li> */}
              </ul>
            </div>
            <Col xs="auto">
              <h4 class="card-header-title">
                <img
                  src={entityLogo}
                  style={{
                    width: "8em",
                    maxHeight: "50px",
                    textAlign: "left",
                    marginLeft: "10px",
                  }}
                  alt=""
                  class="rounded"
                />
              </h4>
            </Col>
          </div>
        </div>
      </div>
    </div>
  );
}
