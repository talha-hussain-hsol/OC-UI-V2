import { Link } from "react-router-dom";
import { useLocation, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Col, Nav, Row } from "react-bootstrap";
import { Header } from "../components";
import FeatherIcon from "feather-icons-react";

export default function AccountHeader({ ...props }) {
  console.log(props, 'props?.isShowInvestmentTab')
  const history = useLocation();
  const params = useParams();
  const [entityLogo, setEntityLogo] = useState(localStorage.getItem("entity_logo"));
  useEffect(() => {
    if (!entityLogo) {
      setEntityLogo("/img/entity_logo.png");
    }
  }, [entityLogo]);

  let path = params["*"];
  const pathSegments = path.split("/");
  const account_id = pathSegments[pathSegments.length - 1];

  return (
    <Header className="mt-md-2" {...props}>
      <Header.Body>
        <Row className="align-items-center">
          <Col>
            <Header.Pretitle>CUSTOMER PORTAL</Header.Pretitle>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex" }}>
                <Link to={`/subscription-list`}>
                  <FeatherIcon icon="chevron-left" size="2em" />
                </Link>
                <Header.Title>My Accounts Dashboard</Header.Title>
              </div>
              {/* <img src={entityLogo} style={{ width: "8em", maxHeight: "50px", textAlign: "left", marginLeft: "10px" }} alt="" class="rounded" /> */}
            </div>
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <Header.Tabs className="nav-overflow">
              {!(props?.forTabsCheck?.isSignAgreement == false) ? (
                <Nav.Item>
                  <Link to={`/subscription/detail/overview/${account_id}`}>
                    <Nav.Link href={`/subscription/detail/overview/${account_id}`} active={history.pathname === `/subscription/detail/overview/${account_id}`}>
                      Overview
                    </Nav.Link>
                  </Link>
                </Nav.Item>
              ) : null}
              {/* <Nav.Item>
                <Link to={`/subscription/detail/capitalization/${account_id}`}>
                  <Nav.Link  href={`/subscription/detail/capitalization/${account_id}`} active={history.pathname === `/subscription/detail/capitalization/${account_id}`}>Capitalization</Nav.Link>
                </Link>
              </Nav.Item>
              
              <Nav.Item>
                <Link to={`/subscription/detail/my-nav/${account_id}`}>
                  <Nav.Link  href={`/subscription/detail/my-nav/${account_id}`} active={history.pathname === `/subscription/detail/my-nav/${account_id}`}>My Nav</Nav.Link>
                </Link>
              </Nav.Item> */}
              {props?.isShowInvestmentTab &&
                <Nav.Item>
                  <Link to={`/subscription/detail/investments/${account_id}`}>
                    <Nav.Link href={`/subscription/detail/investments/${account_id}`} active={history.pathname === `/subscription/detail/investments/${account_id}`}>
                      Application Documents
                    </Nav.Link>
                  </Link>
                </Nav.Item>
              }
            </Header.Tabs>
          </Col>
        </Row>
      </Header.Body>
    </Header>
  );
}
