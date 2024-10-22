import FeatherIcon from "feather-icons-react";
import React, { useState } from "react";
import { Button, Card, Col, Container, Form, Nav, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";

import EntityIcon from "./../icons/entity-icon-small.svg";
var theme = localStorage.getItem("portal_theme");
export default function CustomerBox({ customerData, isCrp = false, params = null }) {
  let data = customerData?.identity ? customerData?.identity : customerData;
  console.log(customerData, "customerData CustomerBox");
  const navigate = useNavigate();
  return (
    <div className="main-content">
      <>
        <div class="col-sm-12">
          <div class="card" style={{ minHeight: "161px" }}>
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-auto">
                  {/* <a href="#!" class="avatar avatar-lg"> */}
                    {customerData?.identity?.type == "INDIVIDUAL" ? (
                      <img src="/img/investor/default-avatar.png" alt="..." class="avatar-img rounded-circle" />
                    ) : (
                      <EntityIcon
                        className={"nodeIcon"}
                        fontSize={"large"}
                        color={"action"}
                        style={{
                          fill: theme == "dark" || theme == undefined ? "white" : "black",
                        }}
                      />
                    )}
                  {/* </a> */}
                </div>
                <div class="col ms-n2">
                  {isCrp ? (
                    // <Link state={{ isCrp: true }} to={`/profile/identity/${data?.type.toLowerCase()}/${isCrp ? "particular": "overview"}/${data?.id}/${params?.account_id ? params?.account_id : ""}`}>
                      <div className="col">
                        {/* <h4 className="font-weight-base mb-1">{data?.label}</h4> */}
                        <h4 className="font-weight-base mb-1">{data?.type == "INDIVIDUAL"?data?.meta?.data[data?.type.toLowerCase()+'.basic.first_name']?.value + " "+data?.meta?.data[data?.type.toLowerCase()+'.basic.last_name']?.value:data?.meta?.data[data?.type.toLowerCase()+'.basic.name']?.value}</h4>
                        <small className="text-muted">{data?.type}</small>
                      </div>
                    // </Link>
                  ) : (
                    <h4 class="mb-1">
                      {console.log("customerData?.identity?.label", customerData?.identity?.label)}
                      <a href="#!">{data?.label}</a>
                    </h4>
                  )}
                  <p class="small text-muted mb-1">
                    {data?.type.toLowerCase() == "corporate" ? "Country of Incorporation: " : "Citizenship: "}
                    {data?.meta?.data[data?.type.toLowerCase() + ".basic.nationality_code"]?.value
                      ? data?.meta?.data[data?.type.toLowerCase() + ".basic.nationality_code"]?.value
                      : data?.meta?.data[data?.type.toLowerCase() + ".basic.incorporate_country_code"]?.value}{" "}
                    <span class="text-success">
                      <FeatherIcon icon="check-circle" color="green" size="15" />
                    </span>
                    <br />
                  </p>
                  {data?.type.toLowerCase() == "individual" && (
                     <p class="small text-muted mb-1">
                     {data?.type.toLowerCase() == "individual" ? "Country of Residence: " : "Country of Residence: "}
                     {data?.meta?.data[data?.type.toLowerCase() + ".basic.country_of_residence_code"]?.value
                       ? data?.meta?.data[data?.type.toLowerCase() + ".basic.country_of_residence_code"]?.value
                       : data?.meta?.data[data?.type.toLowerCase() + ".basic.incorporate_country_code"]?.value}{" "}
                     <span class="text-success">
                       <FeatherIcon icon="check-circle" color="green" size="15" />
                     </span>
                     <br />
                   </p>
                  )}

                  <p class="small mb-0">
                    <span class="text-success"> </span> Subscription Type : {data?.scount == 1 ? "Standalone" : "Standalone"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
