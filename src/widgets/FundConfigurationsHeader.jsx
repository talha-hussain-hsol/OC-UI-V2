import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row, Nav } from "react-bootstrap";
import { Header } from "../components";
import { useParams, useLocation } from "react-router-dom";
import { getFundDetailAPI } from "../api/network/administrationApi/administrationAPI";
import axios from "axios";
export default function AccountHeader({ ...props }) {
  const [entityLogo, setEntityLogo] = useState(
    localStorage.getItem("entity_logo")
  );

  const params = useParams();
  const cancelTokenSource = axios.CancelToken.source();
  const history = useLocation();
  const [fundDetail, setFundDetail] = useState(null);
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
    <Header className="mt-md-2" {...props}>
      <Header.Body>
        <div className="row align-items-end">
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
          <div className="col">
            {/* <h6 className="header-pretitle">

              Fund Configuration
            </h6> */}
            <Header.Pretitle as="h6">
              <span style={{ textTransform: "none" }}>
                {"Fund Configuration"
                  ? "Fund Configuration"
                      .split(" ") // Split the string into an array of words
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase()
                      ) // Capitalize the first letter of each word
                      .join(" ") // Join the words back into a string
                  : ""}
              </span>
            </Header.Pretitle>

            <h1 className="header-title">{fundDetail?.name}</h1>
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
      </Header.Body>
    </Header>
  );
}
