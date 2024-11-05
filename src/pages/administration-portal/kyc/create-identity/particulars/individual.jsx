import { Button, Col, Container, Form, Row, Nav, Spinner, Alert, Accordion, Card, Modal } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import Countries from "../../../../../helpers/countries";
// import { IdentityHeader } from "../../../../../widgets";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from "react-phone-input-2";
import {
  getParticularFieldsApi,
  postIdentityAPI,
  getParticularsDetailByIdentityIdAPI,
  postIdentityCreateAPI,
  postCustomerIdentityCreateAPI,
  handleSubmitScreeningApi,
  getEntityTypeAPI,
} from "../../../../../api/network/AdministrationApi/AdministrationApi";
import axios from "axios";
import { Flatpickr } from "../../../../../components/vendor";
import formatDateRegionWise from "../../../../../helpers/formatDateRegionWise";
import { format } from "date-fns";

export default function Particular({ isWizard = false, selectedIdentity = {}, handleSelectIdentity = {}, title = "Identity" }) {
  const params = useParams();
  const cancelTokenSource = axios.CancelToken.source();
  const [particularFields, setParticularFields] = useState([]);
  const [particularAddedData, setParticularAddedData] = useState([]);
  const [identityDataFields, setIdentityDataFields] = useState(null);
  const [label, setLabel] = useState(null);
  const [labelError, setLabelError] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [message, setMessage] = useState(false);
  const [errorMessage, SetErrorMessage] = useState({ error: false, message: "" });
  const [identityType, setIdentityType] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [fieldsError, setFieldsError] = useState(false);
  const [identityFieldAlreadyTakenError, setIdentityFieldAlreadyTakenError] = useState(false);
  const [entityTypeList, setEntityTypeList] = useState(null);
  const [entityType, setEntityType] = useState(null);
  const [entityError, setEntityError] = useState(false);
  const [updateLabel, setUpdateLabel] = useState(false);
  const [dobError, setDobError] = useState(false);
  const [countryCode, setCountryCode] = useState('sg')

  var allRequiredField = [];
  const navigate = useNavigate();
  const theme = localStorage.getItem("portal_theme");
  console.log(theme, "theme");
  if (theme === "dark theme") {
    setDarkMode(true);
  }
  useEffect(() => {
    getParticularFields();
    getEntityType();
  }, []);
  useEffect(() => {
    if (identityDataFields && particularAddedData && updateLabel) {
      getFullNameAndCountryLabel();
      setUpdateLabel(false);
    }
  }, [identityDataFields, particularAddedData, updateLabel]);
  const getEntityType = async () => {
    setIsLoader(true);

    const response = await getEntityTypeAPI(cancelTokenSource.token);
    if (response.success == true) {
      setIsLoader(false);
      setEntityTypeList(response?.data);
    } else {
      setIsLoader(false);
    }
  };
  useEffect(() => {
    console.log("errorMessage", errorMessage);
  }, [errorMessage]);

  const handleSaveCustomerPortal = () => {
    console.log("vhjkjhdjknhj");
  };
  const getParticularFields = async () => {
    console.log("ia m in ");
    setIsLoader(true);
    let account_id = null;
    if (params?.account_id) {
      account_id = params?.account_id;
    }
    const response = await getParticularFieldsApi(account_id, cancelTokenSource.token, params?.fund_id);
    setIsLoader(false);
    let array = [];
    if (response.success == true) {
      array = [...response.data?.account_fields?.s_f, ...response.data?.account_fields?.e_f];
      console.log(array, "array array array array");
      const filteredObj = array
        .filter((item) => {
          const key = Object.keys(item)[0];
          return key.includes(identityType);
        })
        .sort((a, b) => {
          const indexA = a[Object.keys(a)[0]].index;
          const indexB = b[Object.keys(b)[0]].index;
          return indexA - indexB;
        });
      console.log(filteredObj, "filteredObj");
      setParticularFields(filteredObj);
    } else {
      setIsLoader(false);
    }
  };

  const getFullNameAndCountryLabel = (label) => {
    let newLabel;
    //identityDataFieldss

    // Retrieve the first name, last name, and country from the state
    if (identityType === "CORPORATE") {
      const name = identityDataFields["corporate.basic.name"] || "";
      const country = identityDataFields["corporate.basic.incorporate_country_code"] || "";
      newLabel = `${name}  ${country}`;
    } else {
      const firstName = identityDataFields["individual.basic.first_name"] || "";
      const lastName = identityDataFields["individual.basic.last_name"] || "";
      const country = identityDataFields["individual.basic.nationality_code"] || "";

      // Construct the label using the first name, last name, and country
      newLabel = `${firstName} ${lastName} ${country}`;
    }

    setLabel(newLabel);
    // if (!params?.identity_id && !panData) {
    //     setLabel(newLabel);
    // }
  };
  const getSpecificIdentity = async (identity_id) => {
    const response = await getParticularsDetailByIdentityIdAPI(identity_id, cancelTokenSource.token);
    if (response.success == true) {
      setParticularAddedData(response.data?.meta?.data);
      setLabel(response.data?.label);
      if (response.data?.meta?.data) {
        let keys = Object.keys(response.data?.meta?.data);
        if (keys) {
          keys &&
            keys.map((items, index) => {
              if (response.data?.meta?.data[items]?.value) {
                setIdentityDataFields({
                  ...identityDataFields,
                  [items]: response.data?.meta?.data[items]?.value,
                });
              }
            });
        }
      }
      setIsLoader(false);
    } else {
    }
  };
  
  const handleChange = (e) => {
    setIdentityDataFields({
      ...identityDataFields,
      [e.target.name]: e.target.value,
    });
    if (e.target.name == "corporate.basic.incorporate_country_code" || e.target.name == "individual.basic.nationality_code") {
      setCountryCode(e.target.value)
    }
    if (
      e.target.name == "corporate.basic.name" ||
      e.target.name == "corporate.basic.incorporate_country_code" ||
      e.target.name == "individual.basic.first_name" ||
      e.target.name == "individual.basic.last_name" ||
      e.target.name == "individual.basic.nationality_code"
    ) {
      // setTimeout(function(){
      //   getFullNameAndCountryLabel()
      // },1000)
      setUpdateLabel(true);
    }
  };

  const handleChangeDate = (name, value) => {
    const resultedName = name.split(".");
    const lastKey = resultedName[resultedName.length - 1];

    console.log("namename", name);
    if (value && value.length > 0) {
      const selectedDate = new Date(value[0]);
      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - 16); // Calculate date 18 years ago
      if (lastKey === "dob") {
        if (selectedDate >= minDate) {
          // If selected date is not at least 18 years ago
          // You can handle this case as per your requirement, such as displaying an error message
          // For now, I'm just logging a message to the console
          console.log("Date of birth must be at least 18 years ago.");
          setDobError(true);

          return; // Don't update state if validation fails
        }
      }

      setDobError(false);

      setIdentityDataFields({ ...identityDataFields, [name]: format(selectedDate, "yyyy-MM-dd") });
    } else {
      setIdentityDataFields({ ...identityDataFields, [name]: "" });
    }
  };
  const handleChangeCheckBox = (e) => {
    setIdentityDataFields({
      ...identityDataFields,
      [e.target.name]: e.target.checked,
    });
  };
  const handleChangeLabel = (e) => {
    setLabel(e.target.value);
  };
  const handleSubmit = (portal) => {
    if (!handleValidate()) {
      setFieldsError(true);
      topFunction();
      return;
    } else {
      setFieldsError(false);
    }
    console.log("portal", portal);
    if (portal == "customer") {
      setShowModal(true);
    } else {
      setShowModal(false);
      if (label == "" || label === null) {
        setLabelError(true);
        topFunction();
        return;
      }

      handleSubmitCall(portal);
    }
  };
  const handleSubmitCall = async (portal) => {
    setIsLoader(true);
    setShowModal(false);
    let dataToSend = {};
    if (isWizard && selectedIdentity?.entityId) {
      console.log("isWizard", isWizard);
      dataToSend = {
        label: label,
        customer_type_key: identityType,
        customerEntityId: selectedIdentity?.entityId,
        data: identityDataFields ? identityDataFields : {},
        entity_type_id: identityType == "INDIVIDUAL" ? null : entityType.toString(),
      };
      //postCustomerIdentityCreateAPI

      const res = await postCustomerIdentityCreateAPI(dataToSend, cancelTokenSource.token);

      if (res.success) {
        setIsLoader(false);
        handleSelectIdentity(res?.data);
        setMessage(true);
      } else {
        topFunction();
        if (res?.user_message == "This identity label already exists. Please update the identity label.") {
          setIdentityFieldAlreadyTakenError(true);
        } else {
          SetErrorMessage({ error: true, message: res?.user_message });
        }
        setIsLoader(false);
      }
    } else {
      dataToSend = {
        title: label,
        identity_type: identityType,
        data: identityDataFields ? identityDataFields : {},
        entity_type_id: identityType == "INDIVIDUAL" ? null : entityType.toString(),
      };
      const response = await postIdentityCreateAPI(params?.fund_id, dataToSend, cancelTokenSource.token);
      // debugger;
      if (response.success == true) {
        setIsLoader(false);
        topFunction();
        if (portal == "customer") {
          removeEntityIdFromCookie("entity_id");
          removeEntityIdFromCookie("key");

          const url = new URL(window.location.href);
          const domain = url.hostname.split(".").slice(-2).join(".");
          localStorage.setItem("entity_id", response?.data?.info?.entity?.id);
          document.cookie = `entity_id=${response?.data?.info?.entity?.id};domain=${domain};path=/`;
          document.cookie = `key=${response?.data?.info?.entity?.id};domain=${domain};path=/`;
          let port = "";
          console.log(window.location.port, "location.port");
          if (window.location.port) {
            port = ":" + window.location.port;
          }

          let hostName = window.location.hostname;

          let subDomain = hostName.split(".");

          subDomain = subDomain[0];

          let extractEnv = subDomain.split("-");
          let environment = null;

          if (extractEnv.length > 0 && extractEnv != subDomain) {
            environment = extractEnv[0] + "-";
          } else {
            environment = "";
          }
          console.log("customer response?.data?.info?.shareHolder?.account?.id", response?.data?.info?.shareHolder?.account?.id);
          console.log("customer urlnt?.id", url);
          localStorage.setItem("entity_id", response?.data?.info?.entity?.id);
          document.cookie = `entity_id=${response?.data?.info?.entity?.id};domain=${domain};path=/`;
          document.cookie = `key=${response?.data?.info?.entity?.id};domain=${domain};path=/`;

          window.location.href = `${window.location.protocol}//${environment}customer.${domain}${port}/profile/detail/${response?.data?.info?.shareHolder?.identityId}/${response?.data?.info?.shareHolder?.account?.id}?refresh=yes&entity_id=${response?.data?.info?.entity?.id}&openDoc=true`;
          // identityType.toLowerCase() == "individual"
          //   ? (window.location.href = `${window.location.protocol}//${environment}customer.${domain}${port}/profile/identity/${identityType.toLowerCase()}/documents/${response?.data?.info?.shareHolder?.identityId}/${response?.data?.info?.shareHolder?.account?.id
          //     }?refresh=yes&entity_id=${response?.data?.info?.entity?.id}`)
          //   : (window.location.href = `${window.location.protocol}//${environment}customer.${domain}${port}/profile/identity/${identityType.toLowerCase()}/organization-chart/${response?.data?.info?.shareHolder?.identityId}/${response?.data?.info?.shareHolder?.account?.id
          //     }?refresh=yes&entity_id=${response?.data?.info?.entity?.id}`);
        } else {
          // handleSubmitCustomer(response?.data?.info?.shareHolder?.account?.id, response?.data?.info?.shareHolder?.identityId, identityType.toLowerCase())
          navigate(`/${params?.fund_id}/kyc/account/identity/${identityType.toLowerCase()}/summary/${response?.data?.info?.shareHolder?.identityId}/${response?.data?.info?.shareHolder?.accountId}`);
        }
        setMessage(true);
      } else {
        topFunction();
        if (response?.user_message == "This entity title is already taken") {
          setIdentityFieldAlreadyTakenError(true);
        } else {
          SetErrorMessage({ error: true, message: response?.user_message });
        }
        setIsLoader(false);
      }
    }
  };
  function removeEntityIdFromCookie(keyValue) {
    // Step 1: Parse the cookie string and create an object to store key-value pairs
    let cookieData = document.cookie;
    const keyValuePairs = cookieData.split("; ");

    const cookieObject = {};
    keyValuePairs.forEach((pair) => {
      const [key, value] = pair.split("=");
      cookieObject[key] = value;
    });

    // Step 2: Filter out the 'entity_id' key
    delete cookieObject[keyValue];

    // Step 3: Reconstruct the cookie string without the 'entity_id' key
    const filteredKeyValuePairs = Object.entries(cookieObject).map(([key, value]) => `${key}=${value}`);
    const filteredCookieString = filteredKeyValuePairs.join("; ");

    return filteredCookieString;
  }

  // Example usage:

  const handleSubmitCustomer = async (accountId, identityId, type) => {
    setIsLoader(true);
    const response = await handleSubmitScreeningApi(identityId, accountId, cancelTokenSource.token);
    setIsLoader(false);
    if (response.success == true) {
      navigate(`/${params?.fund_id}/kyc/account/identity/${type.toLowerCase()}/summary/${identityId}/${accountId}`);
    } else {
      setIsLoader(false);
    }
  };
  function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  const getUpdatedData = (key) => {
    return particularAddedData[key]?.value == null ? "" : particularAddedData[key]?.value;
  };
  const handleChangeIdentityType = (e) => {
    setIdentityType(e.target.value);
  };
  const handlePhoneNumber = (phone, formKey, e) => {
    console.log(phone, formKey);
    setIdentityDataFields({
      ...identityDataFields,
      [formKey]: phone,
    });
  };
  const handleValidate = () => {
    console.log(allRequiredField, "allRequiredField allRequiredField");
    let status = true;
    if (allRequiredField.length > 0) {
      for (let item of allRequiredField) {
        if (identityDataFields && identityDataFields[item]) {
          if ((!identityDataFields[item] && identityDataFields[item].value === null) || identityDataFields[item].value == "") {
            console.log("item is empty: :::", item);
            status = false;
          }
        } else {
          status = false;
        }
      }
    }
    if (identityType == "CORPORATE" && (entityType == "" || entityType === null)) {
      setEntityError(true);
      status = false;
    } else {
      setEntityError(false);
    }
    return status;
  };
  const handleChangeEntityKey = (e) => {
    setEntityType(e.target.value);
  };
  return (
    <div className="main-content">
      <Container fluid>
        {showModal && identityType !== "" && (
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Confirmation Message</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div style={{ textTransform: "capitalize" }}>
                {identityType == "INDIVIDUAL"
                  ? "You will be redirected to the customer portal for uploading the identity's KYC document(s)."
                  : "You will be redirected to the customer portal for uploading the identity's Corporate Underlying Parties."}{" "}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={() => handleSubmitCall("customer")}>
                Proceed
              </Button>
            </Modal.Footer>
          </Modal>
        )}
        <Row className="justify-content-center">
          <Col xs={12} lg={12} xl={12}>
            {message && (
              <div>
                <Alert closeLabel dismissible={true} key="success" variant="success">
                  Identity {params?.identity_id ? "Updated" : "Added"} Successfully
                </Alert>
              </div>
            )}
            {errorMessage.error && (
              <div>
                <Alert closeLabel dismissible={true} key="danger" variant="danger">
                  {errorMessage.message}
                </Alert>
              </div>
            )}
            {fieldsError && (
              <div>
                <Alert closeLabel dismissible={true} key="danger" variant="danger">
                  Fill all the required fields to continue.
                </Alert>
              </div>
            )}
            {identityFieldAlreadyTakenError && (
              <div>
                <Alert closeLabel dismissible={true} key="danger" variant="danger">
                  This identity label already exists. Please update the identity label.
                </Alert>
              </div>
            )}
            {isLoader ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "20rem",
                }}
              >
                <Spinner animation="grow" variant="primary" />
              </div>
            ) : (
              <Form className="identity-form">
                <div className="row">
                  {identityType.trim() !== "" && (
                    <div className="col-12 col-md-12">
                      <div className="form-group">
                        <label className="form-label">Identity Label</label>
                        <input
                          type="text"
                          className={label ? "form-control" : "form-control field_warning"}
                          name={"label"}
                          value={label}
                          placeholder="Identity Label"
                          onChange={(e) => {
                            handleChangeLabel(e);
                          }}
                        />
                        {labelError && <span className="error-fields">Enter Label To Continue</span>}
                        {identityFieldAlreadyTakenError && <span className="error-fields">This Label is already taken</span>}
                      </div>
                    </div>
                  )}
                  <div className="col-12 col-md-12">
                    <div className="form-group">
                      <label className="form-label">Identity Type</label>
                      <select
                        className={"form-control"}
                        onChange={(e) => {
                          handleChangeIdentityType(e);
                        }}
                      >
                        <option value="">Select Identity Type</option>
                        <option value="INDIVIDUAL">Individual</option>
                        <option value="CORPORATE">Corporate</option>
                      </select>
                    </div>
                  </div>
                  {identityType == "CORPORATE" && (
                    <div className="col-12 col-md-12">
                      <div className="form-group">
                        <label className="form-label"> Entity Type</label>
                        <select
                          type="text"
                          className={entityType ? "form-control" : "form-control field_warning"}
                          value={entityType}
                          onChange={(e) => {
                            handleChangeEntityKey(e);
                          }}
                        >
                          <option value="">Select Entity Type</option>
                          {entityTypeList &&
                            Object.keys(entityTypeList).map((item, index) => {
                              if (item != "INDIVIDUAL") {
                                return (
                                  <option value={entityTypeList[item]?.value} selected={entityTypeList[item]?.value == entityType}>
                                    {entityTypeList[item]?.name}
                                  </option>
                                );
                              }
                            })}
                        </select>
                        {entityError && <span className="error-fields">Select Entity Type To Continue</span>}
                      </div>
                    </div>
                  )}
                  {particularFields &&
                    identityType &&
                    particularFields &&
                    particularFields.map((item, index) => {
                      let key = Object.keys(item);
                      let checkFieldsShow = item[key[0]].hasOwnProperty("enabled");
                      if (checkFieldsShow && item[key[0]]?.enabled) {
                        if (item[key[0]]?.for == "all" || item[key[0]]?.for == "root") {
                          if (key) {
                            let keyValues = key[0].split(".");
                            let customerType = keyValues[0];
                            let formType = keyValues[1];
                            let fieldName = keyValues[2];
                            let label = fieldName.replaceAll("_", " ");
                            let formKeyVal = key[0];
                            const arr = label.split(" ");
                            for (var i = 0; i < arr.length; i++) {
                              arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
                            }
                            const str2 = arr.join(" ");

                            label = str2;
                            let labelFromApi = item[key[0]]?.label;
                            if (labelFromApi) {
                              label = item[key[0]]?.label;
                            } else {
                              label = label;
                            }
                            let fieldType = item[key[0]]?.type;
                            let sourceType = item[key[0]]?.source?.type;
                            let returnKey = item[key[0]]?.source?.returnKey;
                            let fieldData = item[key[0]]?.source?.data;
                            let requiredField = item[key[0]]?.required;
                            let valueField = item[key[0]]?.DefaultValue;
                            let editableField = "";
                            if (item[key[0]].hasOwnProperty("DefaultValue")) {
                              editableField = false;
                            } else {
                              editableField = true;
                            }

                            if (customerType == identityType.toLowerCase() && formType != "crp") {
                              if (requiredField) {
                                allRequiredField.push(key[0]);
                              }
                              console.log(customerType, "customerType customerType customerType");
                              if (fieldType == "text") {
                                if (fieldName == "phone") {
                                  return (
                                    <div className="col-6 col-md-6">
                                      <div className="form-group">
                                        <label className="form-label">{label}</label>
                                        <div
                                          className={
                                            requiredField && !identityDataFields?.[formKeyVal] && (getUpdatedData(formKeyVal) == "" || getUpdatedData(formKeyVal) == null) ? "form-control field_warning" : "form-control" && darkMode ? "darkMode" : ""
                                          }
                                        >
                                          <PhoneInput
                                            value={getUpdatedData(formKeyVal)}
                                            country={countryCode.toLowerCase() || "sg"}
                                            name={fieldName}
                                            onChange={(e) => {
                                              handlePhoneNumber(e, formKeyVal);
                                            }}
                                            inputProps={{
                                              name: "phone",
                                              required: true,
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  );
                                } else {
                                  return (
                                    <div className="col-6 col-md-6">
                                      <div className="form-group">
                                        <label className="form-label">{label}</label>
                                        <input
                                          type={fieldType}
                                          className={requiredField && !identityDataFields?.[formKeyVal] && (getUpdatedData(formKeyVal) == "" || getUpdatedData(formKeyVal) == null) ? "form-control field_warning" : "form-control"}
                                          defaultValue={editableField == false ? valueField : getUpdatedData(formKeyVal)}
                                          disabled={!editableField}
                                          name={formKeyVal}
                                          placeholder={label}
                                          onChange={(e) => {
                                            handleChange(e);
                                          }}
                                        />
                                      </div>
                                    </div>
                                  );
                                }
                              }
                              if (fieldType == "date") {
                                const region = localStorage.getItem("fundRegion");
                                const placeHolderForDate = region === "united-states-of-america-(USA)" ? "MM/DD/YYYY" : "DD/MM/YYYY";

                                return (
                                  <div className="col-6 col-md-6">
                                    <div className="form-group">
                                      <label className="form-label">{label}</label>
                                      {/* <input
                                        type={fieldType}
                                        defaultValue={
                                          editableField == false
                                            ? valueField
                                            : getUpdatedData(formKeyVal)
                                        }
                                        disabled={!editableField}
                                        className={
                                          requiredField &&
                                            !identityDataFields?.[formKeyVal] &&
                                            (getUpdatedData(formKeyVal) == "" ||
                                              getUpdatedData(formKeyVal) == null)
                                            ? "form-control field_warning"
                                            : "form-control"
                                        }
                                        name={formKeyVal}
                                        placeholder={label}
                                        onChange={(e) => {
                                          handleChange(e)
                                        }}
                                      /> */}
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          alignItems: "start",
                                        }}
                                        className="flatpickr-wrapper-width"
                                      >
                                        <Flatpickr
                                          placeholder={placeHolderForDate}
                                          className={requiredField && !identityDataFields?.[formKeyVal] && (getUpdatedData(formKeyVal) == "" || getUpdatedData(formKeyVal) == null) ? "form-control field_warning" : "form-control"}
                                          defaultValue={editableField == false ? valueField : getUpdatedData(formKeyVal)}
                                          disabled={!editableField}
                                          name={formKeyVal}
                                          options={{
                                            dateFormat: formatDateRegionWise(null, null, true),
                                            allowInput: true, // Enable manual input
                                            onClose: function (selectedDates, dateStr, instance) {
                                              if (dateStr != "") {
                                                handleChangeDate(formKeyVal, [instance.input.value]);
                                              }
                                            },
                                            onReady: function (selectedDates, dateStr, instance) {
                                              // Add event listener to input field to handle manual date entry
                                              const input = instance.input;
                                              input.addEventListener("input", function (event) {
                                                const value = input.value;
                                                if (event.inputType === "deleteContentBackward") {
                                                  // Remove the slash when backspace is pressed
                                                  if (value.length === 3 || value.length === 6) {
                                                    input.value = value.slice(0, -1);
                                                  }
                                                } else {
                                                  // Insert slash after entering two digits for month and day
                                                  if (value.length === 2 || value.length === 5) {
                                                    input.value += "/";
                                                  }
                                                }
                                              });
                                            },
                                          }}
                                          value={editableField == false ? valueField : getUpdatedData(formKeyVal)}
                                          onChange={(e) => {
                                            handleChangeDate(formKeyVal, e);
                                          }}
                                        />
                                        {dobError && (
                                          <span style={{ marginTop: "1em" }} className="error-fields">
                                            Date of birth must be at least 16 years ago.
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              }

                              if (fieldType == "dd") {
                                if (sourceType == "table" || sourceType == "custom") {
                                  return (
                                    <div className="col-6 col-md-6">
                                      <div className="form-group">
                                        <label className="form-label">{label}</label>
                                        <select
                                          className={requiredField && !identityDataFields?.[formKeyVal] && (getUpdatedData(formKeyVal) == "" || getUpdatedData(formKeyVal) == null) ? "form-control field_warning" : "form-control"}
                                          defaultValue={editableField == false ? valueField : getUpdatedData(formKeyVal)}
                                          disabled={!editableField}
                                          name={formKeyVal}
                                          onChange={(e) => {
                                            handleChange(e);
                                          }}
                                        >
                                          <option value="">Select {label}</option>
                                          {fieldData &&
                                            fieldData.map((dat, index) => (
                                              <option value={dat[returnKey]} selected={editableField == false && valueField == dat[returnKey] ? true : getUpdatedData(formKeyVal) == dat[returnKey] ? true : false}>
                                                {dat?.name}
                                              </option>
                                            ))}
                                        </select>
                                      </div>
                                    </div>
                                  );
                                }
                                if (sourceType == "enum") {
                                  return (
                                    <div className="col-6 col-md-6">
                                      <div className="form-group">
                                        <label className="form-label">{label}</label>
                                        <select
                                          className={requiredField && !identityDataFields?.[formKeyVal] && (getUpdatedData(formKeyVal) == "" || getUpdatedData(formKeyVal) == null) ? "form-control field_warning" : "form-control"}
                                          defaultValue={editableField == false ? valueField : getUpdatedData(formKeyVal)}
                                          disabled={!editableField}
                                          name={formKeyVal}
                                          onChange={(e) => {
                                            handleChange(e);
                                          }}
                                        >
                                          <option value="">Select {label}</option>
                                          {fieldData &&
                                            Object.keys(fieldData).map((dat, index) => (
                                              <option value={fieldData[dat][returnKey]} selected={editableField == false && valueField == fieldData[dat][returnKey] ? true : getUpdatedData(formKeyVal) == fieldData[dat][returnKey] ? true : false}>
                                                {fieldData[dat]?.name}
                                              </option>
                                            ))}
                                        </select>
                                      </div>
                                    </div>
                                  );
                                }
                              }
                              if (fieldType == "check") {
                                return (
                                  <div
                                    className="col-6 col-md-6"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      marginBottom: "25px",
                                    }}
                                  >
                                    <Form.Check
                                      // className={requiredField && !identityDataFields?.[formKeyVal] && (getUpdatedData(formKeyVal) == '' || getUpdatedData(formKeyVal) == null) ? "checkbox-field field_warning" : "checkbox-field"}
                                      className={"checkbox-field"}
                                      type={"checkbox"}
                                      id={formKeyVal}
                                      name={formKeyVal}
                                      label={label}
                                      defaultChecked={editableField == false ? valueField : getUpdatedData(formKeyVal)}
                                      disabled={!editableField}
                                      onChange={(e) => {
                                        handleChangeCheckBox(e);
                                      }}
                                    />
                                  </div>
                                );
                              }
                            }
                          }
                        }
                      }
                    })}
                </div>
                {!isWizard ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      className="btn btn-primary"
                      disabled={identityType == "" ? true : false}
                      onClick={() => {
                        handleSubmit("admin");
                      }}
                    >
                      Save And Submit for Review
                    </Button>
                    <Button
                      className="btn btn-primary"
                      disabled={identityType == "" ? true : false}
                      onClick={() => {
                        handleSubmit("customer");
                      }}
                    >
                      {identityType == "CORPORATE" ? "Save & Add Corporate Underlying Parties" : "Save and upload documents"}
                    </Button>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    {/* <Button
                        className="btn btn-primary"
                        disabled={identityType == "" ? true : false}
                        onClick={() => {
                          handleSubmit("admin")
                        }}
                      >
                        {selectedIdentity?.entityId
                          ? "Please save this"
                          : "create"}{" "}
                        {title}
                        {selectedIdentity?.entityId
                          ? "and continue to the next step"
                          : ""}
                      </Button> */}

                    {/* <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    > */}
                    <Button
                      className="btn btn-primary"
                      disabled={identityType == "" ? true : false}
                      onClick={() => {
                        handleSubmit("admin");
                      }}
                    >
                      Save And Submit for Review
                    </Button>
                    <Button
                      className="btn btn-primary"
                      disabled={identityType == "" ? true : false}
                      onClick={() => {
                        handleSubmit("customer");
                      }}
                    >
                      {identityType == "CORPORATE" ? "Save & Add Corporate Underlying Parties" : "Save and upload documents"}
                    </Button>
                  </div>
                  // </div>
                )}
              </Form>
            )}
            <br />
            <br />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
