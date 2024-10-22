import { Button, Col, Container, Form, Row, Nav } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { IdentityHeader } from "../../../../../widgets";
import { getDocumentListAPI } from "../../../../../api/network/customerApi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const dateFormat = "dd/MM/yyyy";

export default function particular() {
  const [dealingDate, setDealingDate] = useState();
  const [dateOfIncorporation, setDateOfIncorporation] = useState();
  const [dateOfIncorporationExpiry, setDateOfIncorporationExpiry] = useState();
  const params = useParams();
  const cancelTokenSource = axios.CancelToken.source();
  const [documentList, setDocumentList] = useState([]);

  useEffect(() => {
    getDocumentList();
  }, []);
  const getDocumentList = async () => {
    const response = await getDocumentListAPI(cancelTokenSource.token);
    console.log("object 1", response);
    if (response.success == true) {
      console.log(documentList);
      setDocumentList(response.data.document_types);
    } else {
      console.log("failed");
    }
  };
  return (
    <div className="main-content">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12} lg={12} xl={12}>
            <Form>
              <div class="row">
                <div class="col-12 col-md-12">
                  <div class="form-group">
                    <label class="form-label">Label</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Label to identity"
                    />
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label class="form-label">Name of Corporation</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Name of Corporation"
                    />
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label class="form-label">Dealing Date</label>
                    <DatePicker
                      dateFormat={dateFormat}
                      class="form-control"
                      selected={dealingDate}
                      onChange={(date) => setDealingDate(date)}
                    />
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label class="form-label">Alias Name</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Alias Name"
                    />
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label class="form-label">Former Register Name</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Former Register Name"
                    />
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label class="form-label">Investor Activity</label>
                    <select class="form-control">
                      <option>Select</option>
                    </select>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label class="form-label">Investor Type</label>
                    <select class="form-control">
                      <option>Select</option>
                    </select>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label class="form-label">Entity Type</label>
                    <select class="form-control">
                      <option>Trust</option>
                      <option>Private</option>
                    </select>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label class="form-label">Ownership structure Layer</label>
                    <select class="form-control">
                      <option>Select</option>
                    </select>
                  </div>
                </div>

                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label class="form-label">Country of Incorporation</label>
                    <select class="form-control">
                      <option>Afghanistan</option>
                      <option>United States Of America</option>
                      <option>Singapore</option>
                      <option>Pakistan</option>
                      <option>India</option>
                    </select>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label class="form-label">
                      Country of Major Operations
                    </label>
                    <select class="form-control">
                      <option>Afghanistan</option>
                      <option>United States Of America</option>
                      <option>Singapore</option>
                      <option>Pakistan</option>
                      <option>India</option>
                    </select>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label class="form-label">Date Of InCorporation</label>
                    <DatePicker
                      class="form-control"
                      dateFormat={dateFormat}
                      selected={dateOfIncorporation}
                      onChange={(date) => setDateOfIncorporation(date)}
                    />
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label class="form-label">
                      Date Of InCorporation Expiry
                    </label>
                    <DatePicker
                      class="form-control"
                      dateFormat={dateFormat}
                      selected={dateOfIncorporationExpiry}
                      onChange={(date) => setDateOfIncorporationExpiry(date)}
                    />
                  </div>
                </div>
                <div class="col-12 col-md-6 mb-4">
                  <Form.Check
                    type={"checkbox"}
                    label={
                      "Is The Ultimate Holding Company A Regulated Entity Or Listed Company In A FATF Jurisdiction"
                    }
                  />
                </div>
                <div class="col-12 col-md-6 mb-4">
                  <Form.Check
                    type={"checkbox"}
                    id={`default-is-complex-structure`}
                    label={"Is Complex Structure"}
                  />
                </div>
                <div class="col-12 col-md-6">
                  <Form.Check
                    type={"checkbox"}
                    id={`default-is-complex-structure`}
                    label={"Is Investing Own Behalf"}
                  />
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label class="form-label">Primary Business Activity</label>
                    <select class="form-control">
                      <option>Select</option>
                    </select>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label class="form-label">Own Boarding Mode</label>
                    <select class="form-control">
                      <option>Select</option>
                    </select>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label class="form-label">Payment Mode</label>
                    <select class="form-control">
                      <option>Select</option>
                    </select>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label class="form-label">Product Service Complexity</label>
                    <select class="form-control">
                      <option>Select</option>
                    </select>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label class="form-label">Source Of Funds</label>
                    <select class="form-control">
                      <option>Select</option>
                    </select>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label class="form-label">Incorporation Number</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Incorporation Number"
                    />
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label class="form-label">IMO Number</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="IMO Number"
                    />
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label class="form-label">Corporation Website</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Corporation Website"
                    />
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label class="form-label">Customer Reference Number</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Customer Reference Number"
                    />
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label class="form-label">Reference Number</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Reference Number"
                    />
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label class="form-label">Address</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Address"
                    />
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label class="form-label">Phone</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Phone"
                    />
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label class="form-label">Email Address</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Email Address"
                    />
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label class="form-label">Bank Account</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Bank Account"
                    />
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label class="form-label">Wallet Address</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Wallet Address"
                    />
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label class="form-label">Crypto Currency</label>
                    <select class="form-control">
                      <option>Select</option>
                    </select>
                  </div>
                </div>
                <div class="col-12 col-md-12">
                  <div class="form-group">
                    <label class="form-label">Nature OF Business</label>
                    <textarea
                      class="form-control"
                      placeholder="Nature OF Business"
                    />
                  </div>
                </div>
              </div>

              <Button class="btn btn-primary">Save changes</Button>
            </Form>
            <br />
            <br />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
