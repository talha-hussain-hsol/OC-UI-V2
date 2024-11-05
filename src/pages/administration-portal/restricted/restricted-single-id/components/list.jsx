import React, { useMemo, useState, useEffect } from "react";
import {
  Col,
  Row,
  Container,
  Dropdown,
  Spinner,
  Button,
  Alert,
  Form,
} from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import axios from "axios";
import {
  getDomainsList,
  getRestrictedListCustomer,
  updateRestrictedList,
  updateCustomerToRestrictedList,
} from "../../../../../api/network/AdministrationApi/AdministrationApi";
import { useParams, useNavigate, useLocation } from "react-router-dom";
// import TableComponent from "../../../../shared-components/table-components";
import Select from "../../../../../components/vendor/Select";
import CustomerModal from "./customerModal";
import { format } from "date-fns";
import PaginatedTableComponent from "../../../../shared-components/paginated-table-component"

const themeDark = localStorage.getItem("portal_theme");
const customStyles =
  themeDark == "dark" || themeDark == undefined
    ? {
        option: (provided, state) => ({
          ...provided,
          // backgroundColor: state.isFocused ? "#1e1e1e" : "#2d2d2d",
          color: "#93a6c6",
          ":active": {
            backgroundColor: "#3b82f6",
            color: "#fff",
          },
        }),
        control: (provided, state) => ({
          ...provided,
          minHeight: "40px", // set the minimum height here
          backgroundColor: "#1e3a5c",
          color: "#93a6c6",
          borderColor: state.isFocused ? "#fff" : "#444",
        }),
        menu: (provided, state) => ({
          ...provided,
          backgroundColor: "#1e3a5c",
          color: "#93a6c6",
        }),
        placeholder: (provided, state) => ({
          ...provided,
          color: "#93a6c6", // change the color of the placeholder text here
        }),
      }
    : {
        control: (provided, state) => ({
          ...provided,
          minHeight: "40px", // set the minimum height here
        }),
      };
export default function RestrictedList({ ...props }) {
  const params = useParams();
  const navigate = useNavigate();
  const cancelTokenSource = axios.CancelToken.source();
  const [listName, setListName] = useState("");
  const [isLoader, setIsLoader] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const [isAlertUPdated, setIsAlertUPdated] = useState(false);
  const [isAlertUPdatedFailed, setIsAlertUPdatedFailed] = useState(false);
  const [isAlertSuccess, setIsAlertSuccess] = useState(false);
  const location = useLocation();
  const [selectedFundValues, setSelectedFundValues] = useState([]);
  const [selectedFundIds, setSelectedFundIds] = useState([]);
  const [domainList, setDomainList] = useState([]);
  const [customersData, setCustomersData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [errorForAdding, setErrorForAdding] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [totalLimit, setTotalLimit] = useState(0);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAlertSuccess(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isAlertSuccess]);

  useEffect(() => {
    let ids = selectedFundValues.map((option) => option.value);
    setSelectedFundIds(ids);
  }, [selectedFundValues]);

  useEffect(() => {
    getDomainListApi();
    getRestrictedListCustomerApi();
  }, []);

  useEffect(function () {
    setListName(location.state.name);
    let options = location.state.business_units.map((item) => ({
      value: item.id,
      label: item.name,
    }));
    // let ids = options.map((option) => option.value);
    setSelectedFundValues(options);
  }, []);

  const handleClickClose = () => {
    navigate(`/${params?.fund_id}/restricted/list`);
  };

  const columns = useMemo(
    () => [
      {
        Header: "ACTIVE",
        accessor: "status_key",
        Cell: ({ value, row }) => (
          <Form.Check
            type={"checkbox"}
            id={`default-checkbox`}
            checked={value == "ACTIVE" ? true : false}
            onChange={() => {
              handleClickCheckBox(value, row);
            }}
          />
        ),
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "REFERENCE NUMBER",
        accessor: "reference_number",
      },
      {
        Header: "COUNTRY CODE",
        accessor: "country_code",
      },
      {
        Header: "IDENTITY NUMBER",
        accessor: "identity_number",
      },
      {
        Header: "COMMENT",
        accessor: "comment",
      },

      {
        Header: "UPDATED AT",
        accessor: "updated_at",
        Cell: ({ value }) => <p>{format(new Date(value), "dd/MM/yyyy")}</p>,
      },

      {
        id: "actions",
        disableSortBy: true,
        Cell: ({ row }) => (
          <Dropdown align="end">
            <Dropdown.Toggle
              as="span"
              className="dropdown-ellipses"
              role="button"
            >
              <FeatherIcon icon="more-vertical" size="17" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleEditClickCustomer(row)}>
                Edit
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ),
      },
    ],
    []
  );

  const handleEditClickCustomer = (row) => {
    setSelectedCustomer(row.original);
    setModalShow(true);
    setIsAdding(false);
  };
  const handleAddNewList = (e) => {
    setModalShow(true);
    setIsAdding(true);
  };
  const handleChangeFunds = (selectedOptions) => {
    setSelectedFundValues(selectedOptions);
  };
  const getDomainListApi = async () => {
    setIsLoader(true);
    const response = await getDomainsList(cancelTokenSource.token);
    if (response.success === true) {
      let options = response.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));

      setDomainList(options);
      setIsLoader(false);
    } else {
      setIsLoader(false);
    }
  };
  const getRestrictedListCustomerApi = async (offset = 0, limit = 5) => {
    setIsLoader(true);
    const response = await getRestrictedListCustomer(
      params?.listId,
      offset,
      limit,
      cancelTokenSource.token
    );
    if (response.success === true) {
      setCustomersData(response.data.restricted_list_customers);
      if (totalLimit !== response.data.count) {
        setTotalLimit(response.data.count);
      }
      // setDomainList(options);
      setIsLoader(false);
    } else {
      setIsLoader(false);
    }
  };

  //for update list
  const handleUpdateList = async () => {
    setIsLoader(true);
    const data = {
      fund_ids: selectedFundIds,
      name: listName,
    };
    const response = await updateRestrictedList(
      data,
      params?.listId,
      cancelTokenSource.token
    );
    if (response.success === true) {
      setIsAlertUPdated(true);

      // setDomainList(options);
      setIsLoader(false);
    } else {
      setIsAlertUPdatedFailed(true);
      setIsLoader(false);
    }
  };

  const handleClickCheckBox = async (value, row) => {
    setIsLoader(true);
    // console.log("value", value);
    // console.log("row", row);
    // let customersDataForUpdate = [...customersData];

    // const updatedCustomersData = customersDataForUpdate.map(customer => {
    //   if (customer.id === row.original.id) {
    //     return {
    //       ...customer,
    //       status_key: !value ? "ACTIVE" : "INACTIVE", // toggle the status_key
    //     };
    //   }
    //   return customer;
    // });
    // setCustomersData(updatedCustomersData);
    const requestData = {
      name: row.original.name,
      reference_number: row.original.reference_number,
      identity_number: row.original.identity_number,
      country_code: row.original.country_code,
      dob: row.original.dob,
      comment: row.original.comment,
      status_key: row.original.status_key == "ACTIVE" ? "IN_ACTIVE" : "ACTIVE",
    };
    const response = await updateCustomerToRestrictedList(
      requestData,
      params?.listId,
      row.original.id,
      cancelTokenSource.token
    );
    if (response.success == true) {
      setIsLoader(false);
      getRestrictedListCustomerApi();
    } else {
      setIsLoader(false);
    }
  };

  return (
    <>
      <div className="main-content">
        <Container fluid>
          <h1>Edit List</h1>
          {modalShow && (
            <CustomerModal
              customerData={
                selectedCustomer == null ? { id: null } : selectedCustomer
              }
              setIsAlert={() => setIsAlert(true)}
              setIsAlertSuccess={() => setIsAlertSuccess(true)}
              show={modalShow}
              onHide={() => setModalShow(false)}
              listId={params?.listId}
              setErrorForAdding={setErrorForAdding}
              getRestrictedListCustomerApi={getRestrictedListCustomerApi}
              isAdding={isAdding}
            />
          )}

          <div className="row">
            <div className="col-sm-6">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="form-group" style={{ width: "120%" }}>
                  <Form.Label>List Name</Form.Label>
                  <Form.Control
                    placeholder="Enter Document Number"
                    type="text"
                    value={listName}
                    onChange={(event) => setListName(event.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-6">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="form-group" style={{ width: "100%" }}>
                  <Form.Label>Funds</Form.Label>

                  <Select
                    styles={customStyles}
                    className="mb-4"
                    isMulti
                    value={selectedFundValues}
                    onChange={handleChangeFunds}
                    options={domainList}
                    placeholder={"Select Funds"}
                  />
                </div>
              </div>
            </div>
          </div>

          <Row>
            <div
              className="col-sm-12"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div
                className="w-30 form-group"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Button
                  className="w-100"
                  variant="primary"
                  size="lg"
                  onClick={handleUpdateList}
                >
                  Save
                </Button>
              </div>
              <div
                className="w-30 form-group"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Button
                  className="w-100"
                  variant="primary"
                  size="lg"
                  onClick={handleClickClose}
                >
                  Close
                </Button>
              </div>
            </div>
          </Row>

          {isAlertUPdated && (
            <Alert
              variant="success"
              className="list-alert alert-dismissible border"
              dismissible={true}
              onClose={() => setIsAlertUPdated(false)}
            >
              {"List Updated Successfully"}
            </Alert>
          )}
          {isAlertUPdatedFailed && (
            <Alert
              variant="danger"
              className="list-alert alert-dismissible border"
              dismissible={true}
              onClose={() => setIsAlertUPdatedFailed(false)}
            >
              {"List Not Updated, please try again"}
            </Alert>
          )}
          <Row className="justify-content-center">
            <Col xs={12}>
              <div class="card">
                <div class="card-header">
                  <h4 class="card-header-title">Name Of The Customers</h4>
                  <div
                    onClick={handleAddNewList}
                    class="btn btn-sm btn-white me-2"
                  >
                    Add Customer
                  </div>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-12">
                      {isLoader ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "20rem",
                          }}
                        >
                          <Spinner animation="grow" />
                        </div>
                      ) : (
                        customersData.length > 0 && (
                          <PaginatedTableComponent
                            pagination={true}
                            columns={columns}
                            allData={customersData}
                            setOffset={setOffset}
                            offset={offset}
                            totalLimit={totalLimit}
                            fetchPageData={getRestrictedListCustomerApi}
                            pageLimit={5}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          {isAlertSuccess && (
            <Alert
              variant={isAlertSuccess ? "success" : "danger"}
              className="list-alert alert-dismissible border"
              dismissible={true}
              onClose={() => setIsAlertSuccess(false)}
            >
              {selectedCustomer == null
                ? "Customer Added Successfully"
                : "Customer Updated Successfully"}
            </Alert>
          )}
          {errorForAdding.length > 0 && (
            <Alert
              variant={"danger"}
              className="list-alert alert-dismissible border"
              dismissible={true}
              onClose={() => setIsAlertSuccess(false)}
            >
              {errorForAdding}
            </Alert>
          )}
        </Container>
      </div>
    </>
  );
}
