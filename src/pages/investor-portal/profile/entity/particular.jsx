import {
  Button,
  Col,
  Container,
  Form,
  Row,
  Nav,
  ButtonGroup,
} from "react-bootstrap";
import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Individual from "./particulars/individual";
import Corporate from "./particulars/corporate";

import { BsChevronRight } from "react-icons/bs";

export default function particular() {
  const navigate = useNavigate();
  const params = useParams();
  const history = useLocation();

  console.log("params", params);
  const handleNextStep = () => {
    const isCrp = history?.state?.isCrp;
    let nextStepRoute;
    let state = {}; // Initialize an empty state object

    if (isCrp) {
      if (params?.type === "corporate") {
        nextStepRoute = `/profile/identity/${params?.type}/organization-chart/${params?.identity_id}/${params?.account_id}`;
      } else {
        nextStepRoute = `/profile/identity/${params?.type}/documents/${params?.identity_id}/${params?.account_id}`;
      }
      state = { isCrp: true };
    } else {
      if (params?.type === "corporate") {
        nextStepRoute = `/profile/identity/${params?.type}/organization-chart/${params?.identity_id}/${params?.account_id}`;
        state = { isCrp: false };
      } else {
        nextStepRoute = `/profile/identity/${params?.type}/documents/${params?.identity_id}/${params?.account_id}`;
        state = { isCrp: false };
      }
    }

    navigate(nextStepRoute, { state: state });
  };

  useEffect(() => {
    console.log("params", params);
  }, [params]);

  return (
    <div className="main-content">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12} lg={10} xl={10}>
            <form>
              <Individual handleNextStep={handleNextStep} />
            </form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
