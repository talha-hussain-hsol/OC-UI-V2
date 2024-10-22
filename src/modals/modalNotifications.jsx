import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Col, ListGroup, Nav, Offcanvas, Row } from "react-bootstrap";
import { Avatar } from "../components";
import axios from "axios";
import {  useParams, useLocation } from "react-router-dom";
import { getNotificationAPI } from "../api/network/administrationApi/administrationAPI";
export default function ModalNotification({ visible, onDismiss, ...props }) {
  const [activeTab, setActiveTab] = useState(0);
  const [notificationDataDomain, setNotificationDataDomain] = useState([]);
  const [notificationDataAll, setNotificationDataAll] = useState([]);
  const [notificationDataEntity, setNotificationDataEntity] = useState([]);
  const params = useParams();
  const location = useLocation();
  const cancelTokenSource = axios.CancelToken.source();

  let fund_id = parseInt(location.pathname.split("/")[1]);
  useEffect(() => {
    if (!isNaN(fund_id)) {
      getNotification(fund_id);
    }
  }, [fund_id]);
  const getNotification = async (fund_id) => {
    let fundId = "";
    let isExtended = true;
    if (fund_id) {
      fundId = fund_id;
    } else {
      isExtended = false;
    }
    const response = await getNotificationAPI(
      fundId,
      isExtended,
      cancelTokenSource.token
    );
    if (response.success == true) {
      setNotificationDataAll(response?.data);
      filterData(response?.data);
    } else {
    }
  };

  const filterData = (data) => {
    if (data) {
      let domainData = [];
      let EntityData = [];
      for (let dd of data) {
        if (dd?.notifiableType != "entity") {
          domainData.push(dd);
        } else {
          EntityData.push(dd);
        }
      }
      console.log(domainData, "domainData");
      console.log(EntityData, "EntityData");
      setNotificationDataDomain(domainData);
      setNotificationDataEntity(EntityData);
    }
  };

  const dateFormate = (dateData) => {
    const dateStr = dateData;
    const date = new Date(dateStr);
    const formatter = new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const formattedDate = formatter.format(date);
    return formattedDate;
  };

  const getNotificationDataAll = notificationDataAll?.map((item, index) => (
    <Link to="#!" key={index} passHref>
      <ListGroup.Item as="a" className="text-reset" href>
        <Row>
          <Col xs="auto">
            <Avatar size="sm">
              <Avatar.Title className="fs-lg bg-primary-soft rounded-circle text-primary">
                <FeatherIcon icon={"mail"} size="1em" />
              </Avatar.Title>
            </Avatar>
          </Col>
          <Col className="ms-n2">
            <h5 className="mb-1">{item?.meta?.message}</h5>
            {/* <p className="small text-gray-700 mb-0">{item.content}</p> */}
            <small className="text-muted">{dateFormate(item?.createdAt)}</small>
          </Col>
        </Row>
      </ListGroup.Item>
    </Link>
  ));
  const getNotificationDataEntity = notificationDataEntity?.map(
    (item, index) => (
      <Link to="#!" key={index} passHref>
        <ListGroup.Item as="a" className="text-reset" href>
          <Row>
            <Col xs="auto">
              <Avatar size="sm">
                <Avatar.Title className="fs-lg bg-primary-soft rounded-circle text-primary">
                  <FeatherIcon icon={"mail"} size="1em" />
                </Avatar.Title>
              </Avatar>
            </Col>
            <Col className="ms-n2">
              <h5 className="mb-1">{item?.meta?.message}</h5>
              {/* <p className="small text-gray-700 mb-0">{item.content}</p> */}
              <small className="text-muted">
                {dateFormate(item?.createdAt)}
              </small>
            </Col>
          </Row>
        </ListGroup.Item>
      </Link>
    )
  );
  const getNotificationDataDomain = notificationDataDomain?.map(
    (item, index) => (
      <Link to="#!" key={index} passHref>
        <ListGroup.Item as="a" className="text-reset" href>
          <Row>
            <Col xs="auto">
              <Avatar size="sm">
                <Avatar.Title className="fs-lg bg-primary-soft rounded-circle text-primary">
                  <FeatherIcon icon={"bell"} size="1em" />
                </Avatar.Title>
              </Avatar>
            </Col>
            <Col className="ms-n2">
              <h5 className="mb-1">{item?.meta?.message}</h5>
              {/* <p className="small text-gray-700 mb-0">{item.content}</p> */}
              <small className="text-muted">
                {dateFormate(item?.createdAt)}
              </small>
            </Col>
          </Row>
        </ListGroup.Item>
      </Link>
    )
  );

  return (
    <Offcanvas show={visible} onHide={onDismiss} {...props}>
      <Offcanvas.Header>
        <Offcanvas.Title as="h4">Notifications</Offcanvas.Title>
        <Nav variant="tabs" className="modal-header-tabs nav-tabs-sm">
          <Nav.Item>
            <Nav.Link
              role="button"
              active={activeTab === 0}
              onClick={() => setActiveTab(0)}
            >
              All
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              role="button"
              active={activeTab === 1}
              onClick={() => setActiveTab(1)}
            >
              Entity
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              role="button"
              active={activeTab === 2}
              onClick={() => setActiveTab(2)}
            >
              Domain
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {activeTab === 0 && (
          <ListGroup className="list-group-flush list-group-activity my-n3">
            {getNotificationDataAll}
          </ListGroup>
        )}
        {activeTab === 1 && (
          <ListGroup className="list-group-flush list-group-activity my-n3">
            {getNotificationDataEntity}
          </ListGroup>
        )}
        {activeTab === 2 && (
          <ListGroup className="list-group-flush list-group-activity my-n3">
            {getNotificationDataDomain}
          </ListGroup>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
