import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Col,
  Form,
  InputGroup,
  Row,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { getCustomerAccounts } from "../../../../api/network/customerApi";
import axios from "axios";
import FeatherIcon from "feather-icons-react";
export default function Dashboard({ ...props }) {
  const [accountsData, setAccountsData] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const cancelTokenSource = axios.CancelToken.source();
  const history = useLocation();
  const navigate = useNavigate();
  const headerButtonCallBack = (e) => {
    e.preventDefault();
    navigate("/subscription/request");
  };

  useEffect(() => {
    handleGetCustomersAccounts();
  }, []);
  useEffect(() => {
    console.log("accountsData", accountsData);
  }, [accountsData]);

  const handleGetCustomersAccounts = async () => {
    console.log(`checking`);
    setIsLoader(true);

    const response = await getCustomerAccounts(cancelTokenSource.token);
    console.log("object 1", response);
    if (response.success == true) {
      setIsLoader(false);
      setAccountsData(response?.data?.customer_accounts);
    } else {
      setIsLoader(false);
    }
  };

  return (
    <>
      <div className="main-content">
        {isLoader ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "30rem",
            }}
          >
            <Spinner animation="grow" />
          </div>
        ) : (
          <Row className="justify-content-center">
            {accountsData.length > 0
              ? accountsData.map((item, index) => {
                  return (
                    <div className="card" key={index}>
                      <div className="card-header">
                        <h4 className="card-header-title">
                          <img
                            src={item?.account?.fund?.logoBucketKey}
                            style={{
                              maxHeight: "30px",
                              textAlign: "left",
                              marginRight: "5px",
                            }}
                            alt=""
                            className="rounded"
                          />
                          {item?.account?.fund?.name}
                        </h4>
                        <Link
                          to="/subscription/detail/sign-agreement"
                          className="btn btn-sm btn-danger me-2"
                        >
                          Sign Agreement
                        </Link>
                        <Link
                          to="/subscription/detail/overview"
                          className="btn btn-sm btn-white me-2"
                        >
                          Investment Details
                        </Link>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-12 col-md-6">
                            <div className="card">
                              <div className="card-body">
                                <div className="row align-items-center">
                                  <div className="col ms-n2">
                                    <div className="row align-items-center">
                                      <small className="text-muted">
                                        <span class="text-success">
                                          <FeatherIcon icon="clock" size="15" />
                                        </span>
                                        Dealing Every Month
                                      </small>
                                    </div>

                                    <div className="row align-items-center">
                                      <small className="text-muted">
                                        <span class="text-warning">
                                          <FeatherIcon
                                            icon="check-circle"
                                            size="15"
                                          />
                                        </span>
                                        Fund's KYC
                                      </small>
                                    </div>
                                    <div className="row align-items-center">
                                      <small className="text-muted">
                                        <span class="text-success">
                                          <FeatherIcon
                                            icon="check-circle"
                                            size="15"
                                          />
                                        </span>
                                        Digital Fund
                                      </small>
                                    </div>
                                    <div className="row align-items-center">
                                      <small className="text-muted">
                                        <span class="text-success">
                                          <FeatherIcon
                                            icon="check-circle"
                                            size="15"
                                          />
                                        </span>{" "}
                                        Singapore
                                      </small>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-12 col-md-6">
                            <div className="card">
                              <div className="card-body">
                                <div className="row align-items-center">
                                  <div className="col-auto">
                                    <a href="#!" className="avatar avatar-lg">
                                      <img
                                        src="/img/investor/default-avatar.png"
                                        alt="..."
                                        className="avatar-img rounded-circle"
                                      />
                                    </a>
                                  </div>
                                  <div className="col ms-n2">
                                    <h4 className="mb-1">
                                      <p>{`${item?.customer_profile?.firstName} ${item?.customer_profile?.lastName} `}</p>
                                    </h4>

                                    <p className="small text-muted mb-1">
                                      Citizenship :{" "}
                                      {
                                        item?.customer_profile
                                          ?.countryOfResidenceCode
                                      }{" "}
                                      <span class="text-success">
                                        <FeatherIcon
                                          icon="check-circle"
                                          size="15"
                                        />
                                      </span>
                                      <br />
                                      Bank Account :
                                      {item?.customer_profile?.bankAccount ==
                                      null ? (
                                        <>
                                          {" "}
                                          <span>no bank account</span>{" "}
                                          <span class="text-danger">
                                            <FeatherIcon
                                              icon="check-circle"
                                              size="15"
                                            />
                                          </span>{" "}
                                        </>
                                      ) : (
                                        <>
                                          <span>
                                            {
                                              item?.customer_profile
                                                ?.bankAccount
                                            }
                                          </span>{" "}
                                          <span class="text-success">
                                            <FeatherIcon
                                              icon="check-circle"
                                              size="15"
                                            />
                                          </span>{" "}
                                        </>
                                      )}
                                    </p>

                                    <p className="small mb-0">
                                      <span className="text-success"> </span>{" "}
                                      Subscription Type :{" "}
                                      {item?.account?.scount == 1
                                        ? "Standalone"
                                        : "Joint Account"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              : null}

            <div className="card">
              <div className="card-header">
                <h4 className="card-header-title">
                  <img
                    src="/img/investor/team-logo-1.jpeg"
                    style={{ maxHeight: "30px", textAlign: "left" }}
                    alt=""
                    className="rounded"
                  />
                  Digital Blues Fund
                </h4>
                <Link
                  to="/subscription/detail/sign-agreement"
                  className="btn btn-sm btn-danger me-2"
                >
                  Sign Agreement
                </Link>
                <Link
                  to="/subscription/detail/investments"
                  className="btn btn-sm btn-white me-2"
                >
                  Investment Details
                </Link>
                <Link
                  to="/subscription/detail/overview"
                  className="btn btn-sm btn-white me-2"
                >
                  Dashboard
                </Link>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <div className="row align-items-center">
                          <div className="col ms-n2">
                            <div className="row align-items-center">
                              <small className="text-muted">
                                <span class="text-success">
                                  <FeatherIcon icon="clock" size="15" />
                                </span>{" "}
                                Dealing Every Month
                              </small>
                            </div>

                            <div className="row align-items-center">
                              <small className="text-muted">
                                <span class="text-warning">
                                  <FeatherIcon icon="check-circle" size="15" />
                                </span>{" "}
                                Fund's KYC
                              </small>
                            </div>
                            <div className="row align-items-center">
                              <small className="text-muted">
                                <span class="text-success">
                                  <FeatherIcon icon="check-circle" size="15" />
                                </span>{" "}
                                Digital Fund
                              </small>
                            </div>
                            <div className="row align-items-center">
                              <small className="text-muted">
                                <span class="text-success">
                                  <FeatherIcon icon="check-circle" size="15" />
                                </span>
                                Singapore
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <div className="row align-items-center">
                          <div className="col-auto">
                            <a href="#!" className="avatar avatar-lg">
                              <img
                                src="/img/investor/default-avatar.png"
                                alt="..."
                                className="avatar-img rounded-circle"
                              />
                            </a>
                          </div>
                          <div className="col ms-n2">
                            <h4 className="mb-1">
                              <a href="{{ route('user.profile.identity.individual.summary') }}">
                                John Doe
                              </a>
                            </h4>

                            <p className="small text-muted mb-1">
                              Citizenship : US{" "}
                              <span class="text-success">
                                <FeatherIcon icon="check-circle" size="15" />
                              </span>
                              <br />
                              {/* Bank Account : <a href="#">BoA (US3258BOA23784638)</a> <span class="text-success">
                                <FeatherIcon
                                  icon="check-circle"
                                  size="15"
                                />
                              </span> */}
                            </p>

                            <p className="small mb-0">
                              <span className="text-success"> </span>{" "}
                              Subscription Type : Standalone
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Row>
        )}
      </div>
    </>
  );
}
