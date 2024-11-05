import React, { useMemo, useState, useEffect } from "react";
import { Col, Row, Container } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import DynamicHeader from "../../../../widgets/DynamicHeader";
import { FaCheckSquare, FaTimesCircle, FaClock, FaEye, FaFile, FaQuestionCircle } from "react-icons/fa";

import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { isKYCEnabled } from "../../../../helpers/getFundConfiguration";
export default function FundList({ ...props }) {


  var fundData = [];
  console.log("fundData", fundData);

  if (props?.fundList) {
    fundData = props?.fundList;
  }

  const handleConfigClick = (e, id) => {
    Navigate(`/${id}/domain/config`);
  };
  const getRandomDate = () => {
    const today = new Date();
    // get the first day of the previous month
    const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    // get the last day of the previous month
    const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    // generate a random timestamp between the first and last day of last month
    const randomTimestamp = Math.floor(Math.random() * (lastDayOfLastMonth.getTime() - firstDayOfLastMonth.getTime() + 1)) + firstDayOfLastMonth.getTime();
    // create a new date object from the random timestamp
    const randomDate = new Date(randomTimestamp);
    // format the random date in DD-MM-YYYY format
    const formattedDate = randomDate.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
    return formattedDate;
  };
  return (
    <>
      <div className="main-content">
        <Container fluid>
          <Row className="justify-content-center">
            <Col xs={12}>
              <div class="card">
                <div class="card-header">
                  {/* <form>
                                        <div class="input-group input-group-flush input-group-merge input-group-reverse">
                                            <input class="form-control list-search" type="search" placeholder="Search" />
                                            <span class="input-group-text">
                                                <i class="fe fe-search"></i>
                                            </span>
                                        </div>
                                    </form> */}

                  {/* <div class="dropdown">
                                        <button class="btn btn-sm btn-white dropdown-toggle" type="button" id="bulkActionDropdown"
                                            data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            Action
                                        </button>
                                        <div class="dropdown-menu dropdown-menu-end" aria-labelledby="bulkActionDropdown">
                                            <a class="dropdown-item" href="#!">Import</a>
                                            <a class="dropdown-item" href="#!">Export</a>
                                            <a class="dropdown-item" href="#!">Clean</a>
                                        </div>
                                    </div> */}
                </div>
                <div class="table-responsive">
                  <table class="table table-sm table-nowrap card-table">
                    <thead>
                      <tr>
                        <th>Domain Account</th>
                        <th>Region</th>
                        <th>Account Manager</th>
                        <th>status</th>
                        {/* <th>Type</th> */}
                        <th>Launch Date</th>
                        {/* <th>Accounts</th> */}
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody class="list">
                      {fundData &&
                        fundData.map((item, index) => (
                          <tr>
                            <td>
                              <Link
                                to={`${isKYCEnabled(item?.meta?.config)
                                    ? `/${item?.id}/kyc/account/list`
                                    : `/${item?.id}/dashboard`
                                  } `}
                                class="avatar avatar-xs d-inline-block me-2"
                              >
                                <img
                                  src={item?.logoBucketKey}
                                  alt="..."
                                  class="avatar-img rounded-circle"
                                />
                              </Link>

                              <span>
                                {" "}
                                <Link
                                  to={`${isKYCEnabled(item?.meta?.config)
                                      ? `/${item?.id}/kyc/account/list`
                                      : `/${item?.id}/dashboard`
                                    } `}
                                  onClick={() =>
                                    localStorage.setItem(
                                      "name_id",
                                      item?.namedId
                                    )
                                  }
                                >
                                  {item?.name}
                                </Link>
                              </span>
                            </td>
                            <td>{item?.region}</td>
                            <td>{item?.management?.entity?.title}</td>

                            <td>
                              {item?.status === "accepted" ? (
                                <span className="text-success">
                                  <FaCheckSquare />{" "}
                                </span>
                              ) : item?.status === "rejected" ? (
                                <span className="text-danger">
                                  <FaCheckSquare />{" "}
                                </span>
                              ) : item?.status === "screening" ||
                                item?.status === "pending" ? (
                                <span className="text-warning">
                                  <FaCheckSquare />{" "}
                                </span>
                              ) : item?.status === "review" ? (
                                <span className="text-primary">
                                  <FaCheckSquare />{" "}
                                </span>
                              ) : item?.status === "draft" ||
                                item?.status === "parked" ? (
                                <span className="text-info">
                                  <FaCheckSquare />{" "}
                                </span>
                              ) : (
                                <span className="text-default">
                                  <FaCheckSquare />{" "}
                                </span>
                              )}
                              {!item?.status ? (
                                <span className="text-success">
                                  <FaCheckSquare /> Active
                                </span>
                              ) : (
                                <span
                                  className={
                                    item?.status === "accepted"
                                      ? "text-success"
                                      : item?.status === "rejected"
                                        ? "text-danger"
                                        : item?.status === "screening" ||
                                          item?.status === "pending"
                                          ? "text-warning"
                                          : item?.status === "review"
                                            ? "text-primary"
                                            : item?.status === "draft" ||
                                              item?.status === "parked"
                                              ? "text-info"
                                              : "text-default"
                                  }
                                >
                                  {item?.status}
                                </span>
                              )}
                            </td>

                            {/* <td>{item?.type}</td> */}
                            <td>{getRandomDate()}</td>
                            <td>
                              <span
                                style={{ marginRight: "3px" }}
                                class="badge bg-success-soft mr-1"
                              >
                                {item?.account_status?.accepted}
                              </span>
                              <span
                                style={{ marginRight: "3px" }}
                                class="badge bg-danger-soft mr-1"
                              >
                                {item?.account_status?.rejected}
                              </span>
                              <span
                                style={{ marginRight: "3px" }}
                                class="badge bg-warning-soft mr-1"
                              >
                                {item?.account_status?.pending}
                              </span>
                            </td>
                            <td>
                              <Link to={`/${item?.id}/fund-configuration`}>
                                <FeatherIcon icon={"settings"} size="15" />
                              </Link>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "-1rem" }}>
                      <div >
                        <Pagination size="lg">
                          <Pagination.Prev
                            disabled={pageIndex === 0}
                            onClick={(e) => {
                              handleClickPrevious(e);
                            }}
                          />
                          {renderPageItems()}
                          <Pagination.Next
                            disabled={pageIndex === pageOptions.length - 1}
                            onClick={(e) => {
                              handleClickNext(e);
                            }}
                          />
                        </Pagination>
                      </div>
                    </div>
                  </table>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}
