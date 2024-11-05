import React, { useEffect, useMemo, useState } from "react";
import { Col, Row, Container, Modal, Form, Button } from "react-bootstrap";
// import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { getFilterFundsAPI, handleAddNewFundAPI, handleSyncFundsAPI } from "../../../../api/network/AdministrationApi/AdministrationApi";
// import { Select } from "../../../../components/vendor";

const regionList = [
  { value: "singapore", label: "Singapore" },
  { value: "india", label: "India" },
  { value: "australia", label: "Australia" },
  { value: "cayman", label: "CayMan" },
];

export default function Filter({ ...props }) {

  const { handleAlert } = props;
  console.log("handleAlert", handleAlert);

  const cancelTokenSource = axios.CancelToken.source();
  const [fundName, setFundName] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [newFundName, setNewFundName] = useState("");
  const [newFundCode, setNewFundCode] = useState("");
  const handleChangeFundName = (e) => {
    setFundName(e.target.value);
  };
  const handleClickSearch = () => {
    // if (fundName.length >= 1) {
    //   getFilterFunds(fundName);
    // }
    props?.getFilterFunds(fundName);
  };

  useEffect(() => {
    if ( props?.pageIndex !== undefined && props?.pageIndex !== null) {
      props?.getFilterFunds(fundName);
    }
  }, [props?.pageIndex]);


  const handleShowModal = (e) => {
    setModalShow(true);
  };
  const handleCloseModal = () => {
    setModalShow(false);
  };
  const handleChangeNewFundName = (e) => {
    setNewFundName(e.target.value);
  };
  const handleChangeNewFundCode = (e) => {
    setNewFundCode(e.target.value);
  };
  const handleSaveNewFund = async (e) => {
    if (newFundName == "" || newFundCode == "") {
      return;
    }
    let dataToSend = {
      code: newFundCode,
      title: newFundName,
    };
    const response = await handleAddNewFundAPI(dataToSend, cancelTokenSource.token);
    if (response.success == true) {
    } else {
    }
  };

  const renderAddNewFund = (
    <Modal size="md" show={modalShow} onHide={handleCloseModal} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <div>
            <h3>Add New Fund</h3>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col xs={12} md={12}>
              <div className="form-group">
                <label className="form-label">Fund Name</label>
                <input
                  type="text"
                  className={"form-control"}
                  onChange={(e) => {
                    handleChangeNewFundName(e);
                  }}
                />
              </div>
            </Col>
            <Col xs={12} md={12}>
              <div className="form-group">
                <label className="form-label">Fund Code</label>
                <input
                  type="text"
                  className={"form-control"}
                  onChange={(e) => {
                    handleChangeNewFundCode(e);
                  }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={(e) => {
            handleSaveNewFund(e);
          }}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
  const handleSyncFunds = async (e) => {
    props?.isLoader(true);
    const response = await handleSyncFundsAPI(cancelTokenSource.token);
    if (response.success == true) {
      handleAlert({
        variant: "success",
        message: "Domains Synced Successfully",
        show: true,
        hideAuto: true,
      });
      props?.isLoader(false);
      props?.getFilterFunds(fundName);
    } else {
      handleAlert({
        variant: "danger",
        message: response.user_message ? response.user_message : response.system_message,

        show: true,
        hideAuto: true,
      });
    }
  };
  return (
    <>
      <div className="main-content">
        {modalShow && renderAddNewFund}
        <Container fluid>
          <Row className="justify-content-center">
            <Col xs={12} md={12} lg={12}>
              <div class="card">
                <div class="card-header">
                  <h4 class="card-header-title">Search Domain Accounts</h4>
                  <div
                    onClick={(e) => {
                      handleSyncFunds(e);
                    }}
                    class="btn btn-sm btn-white me-2"
                  >
                  Sync Domain Account
                  </div>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-12">
                      <div class="d-grid gap-2 col-12 mx-auto">
                        <div className="row mb-3">
                          <div className="col-sm-12 col-md-5 mb-3 mb-md-0">
                            <input
                              class="form-control"
                              type="text"
                              placeholder="Select Domain"
                              onChange={(e) => {
                                handleChangeFundName(e);
                              }}
                              aria-label="demo fund"
                              defaultValue={fundName}
                            />
                          </div>
                          <div className="col-sm-12 col-md-5 mb-3 mb-md-0">
                            <select className={"form-control"} value={props.selectedRegion} onChange={(event) => props.setSelectedRegion(event.target.value)} placeholder={"Select Region"}>
                              <option value="" disabled selected>
                                Select Region
                              </option>
                                    <option value={"Singapore"}>Singapore</option>
                                    <option value={"India"}>India</option>
                                    <option value={"Australia"}>Australia</option>
                                    <option value={"Cayman Islands"}>Cayman Islands</option>
                                    <option value={"BVI"}>BVI</option>
                                    <option value={"Hong-Kong"}>Hong Kong</option>
                                    <option value={"UAE"}>UAE</option>
                                    <option value={"China"}>China</option>
                                    <option value={"India-AIF"}>India AIF</option>
                                    <option value={"India-Gift-City"}>India Gift City</option>
                                    <option value={"Mauritius"}>Mauritius</option>
                                    <option value={"Japan"}>Japan</option>
                                    <option value={"united-kingdom"}>United Kingdom (UK)</option>
                                    <option value={"united-states-of-america-(USA)"}>United States of America (USA)</option>
                                    <option value={"abu-dhabi"}> Abu Dhabi</option>
                            </select>
                          </div>
                          <div className="col-sm-12 col-md-2 text-center">
                            <button className="btn btn-outline-secondary w-100 w-md-95" onClick={handleClickSearch}>
                              Search
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
