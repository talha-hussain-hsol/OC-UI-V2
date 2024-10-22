import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";

import { Link, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { checkPermissions } from "../helpers";
import {
  isKYCEnabled,
  isKYWEnabled,
  isTransactionMonitoringEnabled,
  isRestrictedListEnabled,
} from "../helpers/getFundConfiguration";
import { useSelector } from "react-redux";

export default function DynamicHeaderAdministration({ ...props }) {
  const fundConfig = useSelector((state) => state?.fundConfig);
  const params = useParams();
  const history = useLocation();
  const [entityLogo, setEntityLogo] = useState(
    localStorage.getItem("entity_logo")
  );
  const cancelTokenSource = axios.CancelToken.source();
  const isKYCEnabledinFundConfig = isKYCEnabled(fundConfig?.config);
  const isKYWEnabledinFundConfig = isKYWEnabled(fundConfig?.config);
  const isTMEnabledFundConfig = isTransactionMonitoringEnabled(
    fundConfig?.config
  );
  const isRestrictedListEnabledFundConfig = isRestrictedListEnabled(
    fundConfig?.config
  );

  return (
    <div className="header">
      <div className="container-fluid">
        <div className="header-body">
          <div className="row align-items-end">
            <div className="col-auto">
              {props?.isShowFundLogo && (
                <div className="avatar avatar-md">
                  {fundConfig?.fund_logo_url && (
                    <img
                      src={fundConfig?.fund_logo_url}
                      alt="..."
                      className="avatar-img rounded"
                    />
                  )}
                </div>
              )}
            </div>
            <div className="col">
              {/* <h6 className="header-pretitle">Compliance Portal</h6> */}
              <h6 className="header-pretitle" style={{ textTransform: "none" }}>
                Compliance Portal
              </h6>

              <h1 className="header-title">{fundConfig?.name}</h1>
            </div>
            {props?.isShowFundTabs ||
              (props?.isShowFundTabs == undefined && (
                <div className="col-auto">
                  <ul className="nav nav-tabs header-tabs">
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

                    {isKYCEnabledinFundConfig && (
                      <li className="nav-item">
                        <Link
                          to={`/${params?.fund_id}/kyc/account/list`}
                          className={
                            history.pathname.indexOf("kyc") > -1
                              ? "nav-link text-center active"
                              : "nav-link text-center"
                          }
                        >
                          KYC/KYB
                        </Link>
                      </li>
                    )}

                    {/* <li className="nav-item">
                      <Link
                        to={`/${params?.fund_id}/kyc/cutomer/list`}
                        className={
                          history.pathname.indexOf("customer/list") > -1
                            ? "nav-link text-center active"
                            : "nav-link text-center"
                        }
                      >
                        CUSTOMER
                      </Link>
                    </li> */}

                    {isKYWEnabledinFundConfig && (
                      <li className="nav-item">
                        <Link
                          to={`/${params?.fund_id}/kyw/wallets/list`}
                          className={
                            history.pathname.indexOf("kyw") > -1
                              ? "nav-link text-center active"
                              : "nav-link text-center"
                          }
                        >
                          KYW
                        </Link>
                      </li>
                    )}
                    {isTMEnabledFundConfig && (
                      <li className="nav-item">
                        <Link
                          to={`/${params?.fund_id}/transactions/summary`}
                          className={
                            history.pathname.indexOf("transactions") > -1
                              ? "nav-link text-center active"
                              : "nav-link text-center"
                          }
                        >
                          Transaction Monitoring
                        </Link>
                      </li>
                    )}

                    {isRestrictedListEnabledFundConfig &&
                      checkPermissions("RESTRICTED_LIST_READ") && (
                        <li className="nav-item">
                          <Link
                            to={`/${params?.fund_id}/restricted/list`}
                            className={
                              history.pathname.indexOf("restricted") > -1
                                ? "nav-link text-center active"
                                : "nav-link text-center"
                            }
                          >
                            Restricted Lists
                          </Link>
                        </li>
                      )}
                  </ul>
                </div>
              ))}
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
