import { Link } from 'react-router-dom'
import React, { useMemo } from 'react';
import {
    Row,
} from 'react-bootstrap';
import FeatherIcon from 'feather-icons-react';
export default function InvestorSubscriptionList({ ...props }) {


    function headerButtonCallBack() {

    }
    function pageNumberChangedCallback() {

    }
    return (
      <>
        <div className="main-content">
          <Row className="justify-content-center">
            <div className="card">
              <div className="card-header">
                <h4 className="card-header-title">
                  <img
                    src="/img/investor/team-logo-1.jpeg"
                    style={{
                      maxHeight: "30px",
                      textAlign: "left",
                      marginRight: "10px",
                    }}
                    alt=""
                    className="rounded"
                  />
                  Digital Reds Fund
                </h4>
                <a
                  href="/investor/investor/detail"
                  className="btn btn-sm btn-white me-2"
                >
                  Investment Details
                </a>
                <a href="#" className="btn btn-sm btn-white me-2">
                  Dashboard
                </a>
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
                                  <FeatherIcon
                                    icon="clock"
                                    color="green"
                                    size="15"
                                  />
                                </span>{" "}
                                Dealing Every Month
                              </small>
                            </div>

                            <div className="row align-items-center">
                              <small className="text-muted">
                                <span class="text-success">
                                  <FeatherIcon
                                    icon="check-circle"
                                    color="green"
                                    size="15"
                                  />
                                </span>{" "}
                                Fund's KYC
                              </small>
                            </div>
                            <div className="row align-items-center">
                              <small className="text-muted">
                                <span class="text-success">
                                  <FeatherIcon
                                    icon="check-circle"
                                    color="green"
                                    size="15"
                                  />
                                </span>{" "}
                                Digital Fund
                              </small>
                            </div>
                            <div className="row align-items-center">
                              <small className="text-muted">
                                <span class="text-success">
                                  <FeatherIcon
                                    icon="check-circle"
                                    color="green"
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
                              <a href="{{ route('user.profile.identity.individual.summary') }}">
                                John Doe
                              </a>
                            </h4>

                            <p className="small text-muted mb-1">
                              Citizenship : US{" "}
                              <span class="text-success">
                                <FeatherIcon
                                  icon="check-circle"
                                  color="green"
                                  size="15"
                                />
                              </span>
                              <br />
                              {/* Bank Account : <a href="#">BoA (US3258BOA23784638)</a> <span class="text-success">
                                                                <FeatherIcon
                                                                    
                                                                    icon="check-circle"
                                                                    color="green"
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
                <a href="#" className="btn btn-sm btn-danger me-2">
                  Sign Agreement
                </a>
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
                                  <FeatherIcon
                                    icon="clock"
                                    color="green"
                                    size="15"
                                  />
                                </span>{" "}
                                Dealing Every Month
                              </small>
                            </div>

                            <div className="row align-items-center">
                              <small className="text-muted">
                                <span class="text-success">
                                  <FeatherIcon
                                    icon="check-circle"
                                    color="green"
                                    size="15"
                                  />
                                </span>{" "}
                                Fund's KYC
                              </small>
                            </div>
                            <div className="row align-items-center">
                              <small className="text-muted">
                                <span class="text-success">
                                  <FeatherIcon
                                    icon="check-circle"
                                    color="green"
                                    size="15"
                                  />
                                </span>{" "}
                                Digital Fund
                              </small>
                            </div>
                            <div className="row align-items-center">
                              <small className="text-muted">
                                <span class="text-success">
                                  <FeatherIcon
                                    icon="check-circle"
                                    color="green"
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
                              <a href="{{ route('user.profile.identity.individual.summary') }}">
                                John Doe
                              </a>
                            </h4>

                            <p className="small text-muted mb-1">
                              Citizenship : US{" "}
                              <span class="text-success">
                                <FeatherIcon
                                  icon="check-circle"
                                  color="green"
                                  size="15"
                                />
                              </span>
                              <br />
                              {/* Bank Account : <a href="#">BoA (US3258BOA23784638)</a> <span class="text-success">
                                                                <FeatherIcon
                                                                    
                                                                    icon="check-circle"
                                                                    color="green"
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
        </div>
      </>
    );
}
