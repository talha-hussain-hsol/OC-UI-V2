import React, { useMemo, useState, useEffect } from "react";
import { Button, Card, Col, Form, Nav, Row, Spinner, Alert, Modal, Container } from "react-bootstrap";
// import { Dropzone, Flatpickr, Highlight, Map, Quill, Select } from "../../../../../components/vendor";
import { postCustomerToRestrictedList, updateCustomerToRestrictedList } from "../../../.../../../../api/network/AdministrationApi/AdministrationApi";
import axios from "axios";
import FormField from "./formFields";

const initialCustomerData = {
  name: "",
  reference_number: "",
  identity_number: "",
  country_code: "",
  dob: "",
  comment: "",
};

export default function CustomerModal(props) {
  const { onSubmit, customerData = customerData.id == null ? initialCustomerData : customerData } = props;

  const cancelTokenSource = axios.CancelToken.source();
  const [domainList, setDomainList] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const [formData, setFormData] = useState(initialCustomerData);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    console.log("initialCustomerData", initialCustomerData);
    console.log("initialCustomerData formData", formData);
  }, [props, formData]);
  useEffect(() => {
    if (customerData.id !== null) {
      if(!(props.isAdding)){

        setFormData({
          ...formData,
          name: customerData.name,
          reference_number: customerData.reference_number,
          identity_number: customerData.identity_number,
          country_code: customerData.country_code,
          dob: customerData.dob,
          comment: customerData.comment,
        });
      }
    }
  }, [customerData]);

  const isEditMode = customerData.id !== null;

  const handleInputChange = (event) => {
    const { name, value } = event?.target || {};
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateInput = (value) => {
    return value !== "" && value !== undefined;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoader(true);

    const errors = {};
    for (const [fieldName, fieldValue] of Object.entries(formData)) {
      if (!validateInput(fieldValue)) {
        errors[fieldName] = `${fieldName.replace(/_/g, " ")} cannot be empty`;
      }
    }
    console.log("response in submit errors", errors);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setIsLoader(false);
    } else {
      try {
        let response;
        if (customerData.id == null) {
          const requestData = {
            name: formData.name,
            reference_number: formData.reference_number,
            identity_number: formData.identity_number,
            country_code: formData.country_code,
            dob: formData.dob,
            comment: formData.comment,
            status_key: "",
          };
          response = await postCustomerToRestrictedList(requestData, props.listId, cancelTokenSource.token);
        } else {
          const requestData = {
            name: formData.name,
            reference_number: formData.reference_number,
            identity_number: formData.identity_number,
            country_code: formData.country_code,
            dob: formData.dob,
            comment: formData.comment,
            status_key: customerData.status_key,
          };
          response = await updateCustomerToRestrictedList(requestData, props.listId, customerData.id, cancelTokenSource.token);
        }

        if (response.success == true) {
          setIsLoader(false);
          props.setIsAlertSuccess(true);
          props.getRestrictedListCustomerApi();
          props.onHide();
          setFormData(initialCustomerData);
        } else {
          setIsLoader(false);
          console.log("Error in API call:", response);
          props.setErrorForAdding(response.system_message);
          props.onHide();
          setFormData(initialCustomerData);
        }
      } catch (error) {
        setIsLoader(false);
        console.log("Error in API call:", error);
        props.setErrorForAdding(error.message);
        props.onHide();
      }
    }
  };

  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);

  return (
    <Modal {...props} size="xl" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{customerData.id == null ? "Add New Customer To List" : "Edit Customer"} </Modal.Title>
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
              <Form onSubmit={handleSubmit}>
                <div className="row">
                  {Object.keys(formData).map((field) => (field !== "id" ? <FormField key={field} field={field} value={formData[field]} onChange={handleInputChange} label={field
  .replace(/_/g, " ")
  .toLowerCase()
  .replace(/\b\w/g, (char) => char.toUpperCase())} errors={formErrors} /> : null))}
                </div>
                <button type="submit" className="btn btn-primary">
                  {customerData.id == null ? "Submit" : "Update"}
                </button>
              </Form>

              // <Col xs={12} md={12}>
              //   <div className="row">
              //     <div className="col-sm-6">
              //       <div style={{ display: "flex", justifyContent: "space-between" }}>
              //         <div className="form-group" style={{ width: "120%" }}>
              //           <Form.Label>Full Name</Form.Label>
              //           <Form.Control placeholder="Enter Document Number" type="text" />
              //         </div>
              //       </div>
              //     </div>
              //     <div className="col-sm-6">
              //       <div style={{ display: "flex", justifyContent: "space-between" }}>
              //         <div className="form-group" style={{ width: "100%" }}>
              //           <Form.Label>Refrence Number</Form.Label>

              //           <Form.Control placeholder="Refrence Number" type="text" />
              //         </div>
              //       </div>
              //     </div>
              //   </div>

              //   <div className="row">
              //     <div className="col-sm-6">
              //       <div style={{ display: "flex", justifyContent: "space-between" }}>
              //         <div className="form-group" style={{ width: "120%" }}>
              //           <Form.Label>Identification Number</Form.Label>
              //           <Form.Control placeholder="Enter Document Number" type="text" />
              //         </div>
              //       </div>
              //     </div>
              //     <div className="col-sm-6">
              //       <div style={{ display: "flex", justifyContent: "space-between" }}>
              //         <div className="form-group" style={{ width: "100%" }}>
              //           <Form.Label>Country</Form.Label>

              //           <Form.Control placeholder="Refrence Number" type="text" />
              //         </div>
              //       </div>
              //     </div>
              //   </div>

              //   <div className="row" style={{ flexDirection: "column" }}>
              //     <div className="col-sm-12">
              //       <div className="form-group" style={{ width: "100%" }}>
              //         <Form.Label>Date Of Birth/Date Of Incorporation</Form.Label>
              //         <Form.Control as={Flatpickr} className="mb-3" placeholder="Flatpickr example" />
              //       </div>
              //     </div>
              //   </div>
              //   <div className="row" style={{ flexDirection: "column" }}>
              //     <div className="col-sm-12">
              //       <div className="form-group" style={{ width: "100%" }}>
              //         <Form.Label>Comment</Form.Label>
              //         <Form.Control as="textarea" rows="3" />
              //       </div>
              //     </div>
              //   </div>
              //   <div className="row" style={{ flexDirection: "column" }}>
              //     <div className="col-sm-12">
              //       <div style={{ display: "flex", justifyContent: "center" }} className="form-group">
              //         <Button className="w-100" variant="primary" size="lg">
              //           ADD LIST
              //         </Button>
              //       </div>
              //     </div>
              //   </div>
              // </Col>
            )}
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            props.onHide();
            // customerData=[]
            setFormData(initialCustomerData);
            
            console.log('initialCustomerData',initialCustomerData)
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
