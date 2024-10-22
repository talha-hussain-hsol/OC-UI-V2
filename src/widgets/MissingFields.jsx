import { Link, useLocation, useParams } from "react-router-dom";
import React from "react";
import { Col, Nav, Row, Button, Dropdown } from "react-bootstrap";
import { Header } from "../components";
import { getMissingDataOfIdentity } from '../helpers';

export default function IdentityHeader({ ...props }) {
  console.log(props, 'props')

  return (
    <div className="card">
      <div className="card-body">
        <div className="row">
          <div className={"col-12 col-md-12"}>
            <Row className="justify-content-left">
              <Col className="text-center">
                <h6 className="mb-4 text-uppercase text-muted">Missing Fields</h6>
              </Col>
            </Row>
            <Row>
              {getMissingDataOfIdentity(props?.selectedIdentityData, props?.fundData)?.missingIdentityFields && getMissingDataOfIdentity(props?.selectedIdentityData, props?.fundData)?.missingIdentityFields.map(item => (
                <Col className="col-md-6"><span style={{ textTransform: 'capitalize' }}>{item}</span></Col>
              ))}
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
}
