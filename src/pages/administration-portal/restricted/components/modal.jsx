import React, {  useState, useEffect } from "react";
import { Button, Col, Form, Nav, Row, Spinner, Alert, Modal, Container } from "react-bootstrap";
import Select from "../../../../components/vendor/Select";
import { postRestrictedList, getDomainsList } from "../../.../../../../api/network/AdministrationApi/AdministrationApi";
import axios from "axios";


export default function ModalRestricted(props) {
  const [selectedFundValues, setSelectedFundValues] = useState([]);
  const [selectedFundIds, setSelectedFundIds] = useState([]);
  const [listName, setListName] = useState("");
  const [isLoader, setIsLoader] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const [isAlertSuccess, setIsAlertSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const cancelTokenSource = axios.CancelToken.source();
  const [domainList, setDomainList] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAlert(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isAlert]);

  useEffect(() => {
    let ids = selectedFundValues.map((option) => option.value);
    setSelectedFundIds(ids);
    console.log("selectedFundValues", selectedFundValues);
  }, [selectedFundValues]);
  useEffect(() => {
    console.log("domainList", domainList);
  }, [domainList]);
  useEffect(() => {
    getDomainListApi();
  }, []);
  const handleChangeFunds = (selectedOptions) => {
    setSelectedFundValues(selectedOptions);
  };
  const getDomainListApi = async () => {
    setIsLoader(true);
    console.log("in ffffget");
    const response = await getDomainsList(cancelTokenSource.token);
    if (response.success == true) {
      let options = response.data.map((item) => ({ value: item.id, label: item.name }));
      console.log();
      setDomainList(options);
      setIsLoader(false);
    } else {
      setIsLoader(false);
    }
  };
  const handleClickAddList = async () => {
    setIsLoader(true);

    let data = {
      fund_ids: selectedFundIds,
      name: listName,
    };

    const respond = await postRestrictedList(data, cancelTokenSource.token);
    console.log("respond post", respond);
    if (respond.success === true) {
      props.setIsAlertSuccess();
      setIsLoader(false);
      setIsAlertSuccess(true);
      props.getRestrictedList();
      setListName("");
      setSelectedFundValues([]);

      props.onHide();
    } else {
      setIsLoader(false);
      setAlertMessage(respond.user_message);
      setIsAlert(true);
    }
  };

  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Add New List</Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <Container>
          {isAlert && (
            <Alert variant={isAlertSuccess ? "success" : "danger"} className="alert-dismissible " dismissible={true} onClose={() => setIsAlert(false)}>
              {alertMessage}
            </Alert>
          )}
          <Row>
            {isLoader ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "20rem" }}>
                <Spinner animation="grow" />
              </div>
            ) : (
              <Col xs={12} md={12}>
                <div className="row" style={{ flexDirection: "column" }}>
                  <div className="col-sm-12">
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div className="form-group" style={{ width: "120%" }}>
                        <Form.Label>List Name</Form.Label>
                        <Form.Control placeholder="Enter List Name" type="text" value={listName} onChange={(event) => setListName(event.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div className="form-group" style={{ width: "100%" }}>
                        <Form.Label>Funds</Form.Label>

                        <Select  className="mb-4" isMulti value={selectedFundValues} onChange={handleChangeFunds} options={domainList} placeholder={"Select Funds"} />
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-12">
                    <div style={{ display: "flex", justifyContent: "center" }} className="form-group">
                      <Button className="w-100" onClick={handleClickAddList} variant="primary" size="lg">
                        ADD LIST
                      </Button>
                    </div>
                  </div>
                </div>
              </Col>
            )}
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
