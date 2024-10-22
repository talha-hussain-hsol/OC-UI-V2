import {
  Button,
  Col,
  Container,
  Form,
  Row,
  Nav,
  Spinner,
  Alert,
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Countries from "../../../../helpers/countries";
import { IdentityHeader } from "../../../../widgets";
import { Select } from "../../../../components/vendor";
import SelectAlias from "react-select";
import {
  getParticularFieldsApi,
  postIdentityAPI,
  getParticularsDetailByIdentityIdAPI,
  getCrpRoleMetaAPI,
  getEntityTypeAPI,
} from "../../../../api/network/customerApi";
import axios from "axios";

export default function particular() {
  const params = useParams();
  const navigate = useNavigate();
  const cancelTokenSource = axios.CancelToken.source();
  const [particularFields, setParticularFields] = useState([]);
  const [particularAddedData, setParticularAddedData] = useState([]);
  const [particularAddedDataRoles, setParticularAddedDataRoles] = useState([]);
  const [identityDataFields, setIdentityDataFields] = useState(null);
  const [label, setLabel] = useState(null);
  const [parentLabel, setParentLabel] = useState(null);
  const [labelError, setLabelError] = useState(false);
  const [rolesError, setRolesError] = useState(false);
  const [ownerShipError, setOwnerShipError] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [message, setMessage] = useState(false);
  const [messageValue, setMessageValue] = useState("");
  const [errorMessage, SetErrorMessage] = useState(false);
  const [rolesMeta, setRolesMeta] = useState([]);
  const [entityType, setEntityType] = useState(null);
  const [entityError, setEntityError] = useState(false);
  const [selectedRolesMeta, setSelectedRolesMeta] = useState([]);
  const [entityTypeList, setEntityTypeList] = useState(null);
  const [selectedRolesForSelectData, setSelectedRolesForSelectData] = useState(
    []
  );
  useEffect(() => {
    getParticularFields();
    getCrpRoleMeta();
    getEntityType();
    if (params?.identity_id) {
      getSpecificIdentity(params?.identity_id);
    }
    if (params?.crp_id) {
      getSpecificIdentityCRP(params?.crp_id);
    }
  }, []);
  useEffect(() => {
    console.log("identityDataFields", identityDataFields);
  }, [identityDataFields]);
  useEffect(() => {
    console.log("identityDataFields", identityDataFields);
    if (identityDataFields) {
      getFullNameAndCountryLabel();
    }
  }, [identityDataFields, particularAddedData]);
  useEffect(() => {
    if (identityDataFields) {
      let newLabel;

      if (params?.type === "individual") {
        const firstName =
          identityDataFields["individual.basic.first_name"] || "";
        const lastName = identityDataFields["individual.basic.last_name"] || "";
        const country =
          identityDataFields["individual.basic.nationality_code"] || "";

        if (firstName !== "") {
          newLabel = `${firstName} ${lastName ? lastName + " " : ""}${
            country ? country + " " : ""
          }`;
          setLabel(newLabel);
        }
      } else if (params?.type === "corporate") {
        const name = identityDataFields["corporate.basic.name"] || "";
        const country =
          identityDataFields["corporate.basic.incorporate_country_code"] || "";

        if (name.trim() !== "") {
          newLabel = `${name} ${country ? country + " " : ""}`;
          setLabel(newLabel);
        }
      }
    }
  }, [identityDataFields]);

  useEffect(() => {
    let selectedRolesForSelect = [];

    if (rolesMeta && particularAddedDataRoles) {
      console.log(rolesMeta, "rolesMeta");
      console.log(
        particularAddedDataRoles,
        "particularAddedData particularAddedData particularAddedData"
      );
      for (let selected of particularAddedDataRoles) {
        for (let i of rolesMeta) {
          if (i?.value == selected?.crpRoleMetaId) {
            selectedRolesForSelect.push(i);
          }
        }
      }
      console.log(selectedRolesForSelect, "selectedRolesForSelect");
      setSelectedRolesForSelectData(selectedRolesForSelect);
      setSelectedRolesMeta(selectedRolesForSelect);
    }
  }, [rolesMeta, particularAddedDataRoles]);
  const getFullNameAndCountryLabel = (label) => {
    let newLabel;
    //identityDataFields
    // if (!isEmptyObject(registrationProviderData)) {
    //   if (label) {
    //     newLabel = label;
    //   } else {
    //     // Retrieve the first name, last name, and country from the state

    //     if (params?.type === "corporate") {
    //       const name = particularAddedData["corporate.basic.name"] || "";
    //       const country = particularAddedData["corporate.basic.incorporate_country_code"] || "";
    //       newLabel = `${name}  ${country}`;
    //     } else {
    //       const firstName = particularAddedData["individual.basic.first_name"] || "";
    //       const lastName = particularAddedData["individual.basic.last_name"] || "";
    //       const country = particularAddedData["individual.basic.nationality_code"] || "";

    //       // Construct the label using the first name, last name, and country
    //       newLabel = `${firstName} ${lastName} ${country}`;
    //     }
    //   }
    // } else {
    //   // Retrieve the first name, last name, and country from the state
    //   if (params?.type === "corporate") {
    //     const name = identityDataFields["corporate.basic.name"] || "";
    //     const country = identityDataFields["corporate.basic.incorporate_country_code"] || "";
    //     newLabel = `${name}  ${country}`;
    //   } else {
    //     const firstName = identityDataFields["individual.basic.first_name"] || "";
    //     const lastName = identityDataFields["individual.basic.last_name"] || "";
    //     const country = identityDataFields["individual.basic.nationality_code"] || "";

    //     // Construct the label using the first name, last name, and country
    //     newLabel = `${firstName} ${lastName} ${country}`;
    //   }
    // }
    if (params?.type === "corporate") {
      const name = particularAddedData["corporate.basic.name"] || "";
      const country =
        particularAddedData["corporate.basic.incorporate_country_code"] || "";
      newLabel = `${name}  ${country}`;
    } else {
      const firstName =
        particularAddedData["individual.basic.first_name"] || "";
      const lastName = particularAddedData["individual.basic.last_name"] || "";
      const country =
        particularAddedData["individual.basic.nationality_code"] || "";

      // Construct the label using the first name, last name, and country
      newLabel = `${firstName} ${lastName} ${country}`;
    }
    setLabel(newLabel);
  };

  const getParticularFields = async () => {
    setIsLoader(true);
    let account_id = null;
    if (params?.account_id) {
      account_id = params?.account_id;
    }
    const response = await getParticularFieldsApi(
      account_id,
      cancelTokenSource.token
    );
    setIsLoader(false);
    let array = [];
    if (response.success == true) {
      // let array = [...response.data?.fields, ...response.data?.account_fields];
      if (params?.account_id) {
        array = [
          ...response.data?.account_fields?.s_f,
          ...response.data?.account_fields?.e_f,
        ];
      } else {
        array = response.data?.fields;
      }
      setParticularFields(array);
    } else {
    }
  };
  const getEntityType = async () => {
    setIsLoader(true);

    const response = await getEntityTypeAPI(cancelTokenSource.token);
    setIsLoader(false);
    if (response.success == true) {
      setEntityTypeList(response?.data);
    } else {
      setIsLoader(false);
    }
  };
  const getCrpRoleMeta = async () => {
    setIsLoader(true);
    const response = await getCrpRoleMetaAPI(cancelTokenSource.token);
    setIsLoader(false);
    if (response.success == true) {
      filterRolesByType(response?.data?.crp_roles_meta);
      // setRolesMeta(response?.data?.crp_roles_meta)
    } else {
    }
  };
  const getSpecificIdentity = async (identity_id) => {
    const response = await getParticularsDetailByIdentityIdAPI(
      identity_id,
      cancelTokenSource.token
    );
    if (response.success == true) {
      setParentLabel(response.data?.label);
    } else {
    }
  };
  const getSpecificIdentityCRP = async (identity_id) => {
    const response = await getParticularsDetailByIdentityIdAPI(
      identity_id,
      cancelTokenSource.token
    );
    if (response.success == true) {
      setEntityType(response.data?.entityTypeId);
      setParticularAddedData(response.data?.meta?.data);
      setParticularAddedDataRoles(response.data?.roles);
      setLabel(response.data?.label);
    } else {
    }
  };
  const filterRolesByType = (data) => {
    if (data) {
      let filterRolesMeta = [];
      for (let item of data) {
        if (item?.crp_type == params?.type.toUpperCase()) {
          filterRolesMeta.push({ value: item?.id, label: item?.name });
        }
      }
      setRolesMeta(filterRolesMeta);
    }
  };
  const handleChange = (e) => {
    setIdentityDataFields({
      ...identityDataFields,
      [e.target.name]: e.target.value,
    });
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
  const handleSubmit = () => {
    if (label == "" || label === null) {
      setLabelError(true);
      topFunction();
      return;
    } else {
      setLabelError(false);
    }
    if (
      params?.type == "corporate" &&
      (entityType == "" || entityType === null)
    ) {
      setEntityError(true);
      topFunction();
      return;
    } else {
      setEntityError(false);
    }
    if (
      identityDataFields &&
      identityDataFields.hasOwnProperty(params?.type + ".basic.ownership")
    ) {
      if (identityDataFields[params?.type + ".basic.ownership"] == "") {
        setOwnerShipError(true);
        return;
      }
      if (
        parseInt(identityDataFields[params?.type + ".basic.ownership"]) > 100
      ) {
        setOwnerShipError(true);
        return;
      }
    } else if (
      particularAddedData &&
      particularAddedData.hasOwnProperty(params?.type + ".basic.ownership")
    ) {
      if (particularAddedData[params?.type + ".basic.ownership"] == "") {
        setOwnerShipError(true);
        return;
      }
      if (
        parseInt(particularAddedData[params?.type + ".basic.ownership"]) > 100
      ) {
        setOwnerShipError(true);
        return;
      }
    } else {
      setOwnerShipError(true);
      return;
    }
    if (selectedRolesMeta.length == 0) {
      setRolesError(true);
      return;
    }

    console.log(selectedRolesMeta, "selectedRolesMeta");
    let selectedRoles = [];
    selectedRolesMeta &&
      selectedRolesMeta.map((item) => {
        selectedRoles.push({ crp_role_meta_id: item?.value });
      });
    console.log(selectedRoles, "selectedRoles");
    // return;
    const dataToSend = {
      label: label,
      parent_id: params?.identity_id,
      customer_type_key: params?.type.toUpperCase(),
      data: identityDataFields ? identityDataFields : {},
      roles: selectedRoles,
      entity_type_id:
        params?.type == "individual" ? null : entityType.toString(),
    };
    if (params?.crp_id) {
      dataToSend["identity_id"] = params?.crp_id;
    }
    // console.log(dataToSend,'dataToSend')
    // return
    handleSubmitCall(dataToSend);
  };
  const handleSubmitCall = async (data) => {
    setIsLoader(true);
    const response = await postIdentityAPI(data, cancelTokenSource.token);
    setIsLoader(false);
    if (response.success == true) {
      let customerType = response?.data?.type.toLowerCase();
      let crpId = response?.data?.id;
      setTimeout(function () {
        navigate(-1);
      }, 1000);

      // navigate(`/profile/identity/${customerType}/particular/crp/${params?.identity_id}/${crpId}`)
      // navigate(`/profile/identity/${customerType}/organization-chart/${params?.identity_id}/${params?.account_id}`)

      setMessage(true);
    } else {
      topFunction();

      setMessageValue(response?.system_message);
      SetErrorMessage(true);
    }
  };
  function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  const getUpdatedData = (key) => {
    return particularAddedData[key]?.value == null
      ? ""
      : particularAddedData[key]?.value;
  };
  const handleSelectRolesChange = (selectedOptions) => {
    setSelectedRolesMeta(selectedOptions);
    console.log(selectedOptions, "selectedOptions");
    setRolesError("");
  };
  const handleChangeEntityKey = (e) => {
    setEntityType(e.target.value);
  };

  return (
    <div className="main-content">
      <Container fluid>
        <Row className="justify-content-center" style={{ marginTop: "100px" }}>
          <Col xs={12} lg={12} xl={12}>
            {message && (
              <div>
                <Alert
                  closeLabel
                  dismissible={true}
                  key="success"
                  variant="success"
                  onClose={() => setMessage(null)}
                >
                  Identity {params?.identity_id ? "Updated" : "Added"}{" "}
                  Successfully
                </Alert>
              </div>
            )}
            {errorMessage && (
              <div>
                <Alert
                  closeLabel
                  dismissible={true}
                  key="danger"
                  variant="danger"
                  onClose={() => SetErrorMessage(null)}
                >
                  {messageValue}
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
                <Spinner animation="grow" />
              </div>
            ) : (
              <Form className="identity-form">
                <div className="row">
                  <div className="col-12 col-md-12">
                    <div className="form-group">
                      <label className="form-label">
                        Parent Identity Label
                      </label>
                      <input
                        type="text"
                        className={"form-control"}
                        value={parentLabel}
                        readOnly
                        disabled
                        placeholder="Parent Label Of Identity"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-12">
                    <div className="form-group">
                      <label className="form-label">Identity Label</label>
                      <input
                        type="text"
                        className={label ? "form-control" : "form-control "}
                        name={"label"}
                        value={label}
                        placeholder="Label Of Identity"
                        onChange={(e) => {
                          handleChangeLabel(e);
                        }}
                      />
                      {labelError && (
                        <span className="error-fields">
                          Enter Label To Continue
                        </span>
                      )}
                    </div>
                  </div>
                  {params?.type == "corporate" && (
                    <div className="col-12 col-md-12">
                      <div className="form-group">
                        <label className="form-label"> Entity Type</label>
                        <select
                          type="text"
                          className={
                            entityType
                              ? "form-control"
                              : "form-control field_warning"
                          }
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
                                  <option
                                    value={entityTypeList[item]?.value}
                                    selected={
                                      entityTypeList[item]?.value == entityType
                                    }
                                  >
                                    {entityTypeList[item]?.name}
                                  </option>
                                );
                              }
                            })}
                        </select>
                        {entityError && (
                          <span className="error-fields">
                            Select Entity Type To Continue
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {particularFields &&
                    particularFields &&
                    particularFields.map((item, index) => {
                      let key = Object.keys(item);
                      let checkFieldsShow =
                        item[key[0]].hasOwnProperty("enabled");
                      if (checkFieldsShow && item[key[0]]?.enabled) {
                        if (
                          item[key[0]]?.for == "crp" ||
                          item[key[0]]?.for == "all"
                        ) {
                          let key = Object.keys(item);
                          if (key) {
                            let keyValues = key[0].split(".");
                            let customerType = keyValues[0];
                            let formType = keyValues[1];
                            let fieldName = keyValues[2];
                            let label = fieldName.replaceAll("_", " ");
                            let formKeyVal = key[0];
                            let editableField = item[key[0]]?.editable
                              ? item[key[0]]?.editable
                              : true;
                            let valueField = item[key[0]]?.value;
                            const arr = label.split(" ");
                            for (var i = 0; i < arr.length; i++) {
                              arr[i] =
                                arr[i].charAt(0).toUpperCase() +
                                arr[i].slice(1);
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
                            let crpCustomerType = customerType + "." + formType;
                            let paramFieldCrp = params.type + "." + "crp";
                            if (
                              customerType == params.type ||
                              crpCustomerType == paramFieldCrp
                            ) {
                              if (fieldType == "text") {
                                return (
                                  <div className="col-6 col-md-6">
                                    <div className="form-group">
                                      <label className="form-label">
                                        {label}
                                      </label>
                                      <input
                                        type={fieldType}
                                        className={
                                          requiredField &&
                                          !identityDataFields?.[formKeyVal] &&
                                          (getUpdatedData(formKeyVal) == "" ||
                                            getUpdatedData(formKeyVal) == null)
                                            ? "form-control field_warning"
                                            : "form-control"
                                        }
                                        defaultValue={
                                          editableField === false
                                            ? valueField
                                            : getUpdatedData(formKeyVal)
                                        }
                                        readOnly={!editableField}
                                        name={formKeyVal}
                                        placeholder={label}
                                        onChange={(e) => {
                                          handleChange(e);
                                        }}
                                      />
                                      {fieldName == "ownership" &&
                                        ownerShipError && (
                                          <span className="error-fields">
                                            Ownership(%) should be between 0-100
                                          </span>
                                        )}
                                    </div>
                                  </div>
                                );
                              }
                              if (fieldType == "date") {
                                return (
                                  <div className="col-6 col-md-6">
                                    <div className="form-group">
                                      <label className="form-label">
                                        {label}
                                      </label>
                                      <input
                                        type={fieldType}
                                        defaultValue={
                                          editableField === false
                                            ? valueField
                                            : getUpdatedData(formKeyVal)
                                        }
                                        readOnly={!editableField}
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
                                          handleChange(e);
                                        }}
                                      />
                                    </div>
                                  </div>
                                );
                              }

                              if (fieldType == "dd") {
                                if (
                                  sourceType == "table" ||
                                  sourceType == "custom"
                                ) {
                                  return (
                                    <div className="col-6 col-md-6">
                                      <div className="form-group">
                                        <label className="form-label">
                                          {label}
                                        </label>
                                        <select
                                          className={
                                            requiredField &&
                                            !identityDataFields?.[formKeyVal] &&
                                            (getUpdatedData(formKeyVal) == "" ||
                                              getUpdatedData(formKeyVal) ==
                                                null)
                                              ? "form-control field_warning"
                                              : "form-control"
                                          }
                                          defaultValue={
                                            editableField === false
                                              ? valueField
                                              : getUpdatedData(formKeyVal)
                                          }
                                          readOnly={!editableField}
                                          name={formKeyVal}
                                          onChange={(e) => {
                                            handleChange(e);
                                          }}
                                        >
                                          <option value="">
                                            Select {label}
                                          </option>
                                          {fieldData &&
                                            fieldData.map((dat, index) => (
                                              <option
                                                value={dat[returnKey]}
                                                selected={
                                                  editableField == false &&
                                                  valueField == dat[returnKey]
                                                    ? true
                                                    : getUpdatedData(
                                                        formKeyVal
                                                      ) == dat[returnKey]
                                                    ? true
                                                    : false
                                                }
                                              >
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
                                        <label className="form-label">
                                          {label}
                                        </label>
                                        <select
                                          className={
                                            requiredField &&
                                            !identityDataFields?.[formKeyVal] &&
                                            (getUpdatedData(formKeyVal) == "" ||
                                              getUpdatedData(formKeyVal) ==
                                                null)
                                              ? "form-control field_warning"
                                              : "form-control"
                                          }
                                          defaultValue={
                                            editableField === false
                                              ? valueField
                                              : getUpdatedData(formKeyVal)
                                          }
                                          disabled={!editableField}
                                          name={formKeyVal}
                                          onChange={(e) => {
                                            handleChange(e);
                                          }}
                                        >
                                          <option value="">
                                            Select {label}
                                          </option>
                                          {fieldData &&
                                            Object.keys(fieldData).map(
                                              (dat, index) => (
                                                <option
                                                  value={
                                                    fieldData[dat][returnKey]
                                                  }
                                                  selected={
                                                    editableField == false &&
                                                    valueField ==
                                                      fieldData[dat][returnKey]
                                                      ? true
                                                      : getUpdatedData(
                                                          formKeyVal
                                                        ) ==
                                                        fieldData[dat][
                                                          returnKey
                                                        ]
                                                      ? true
                                                      : false
                                                  }
                                                >
                                                  {fieldData[dat]?.name}
                                                </option>
                                              )
                                            )}
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
                                      defaultChecked={
                                        editableField === false
                                          ? valueField
                                          : getUpdatedData(formKeyVal)
                                      }
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
                {selectedRolesForSelectData.length > 0 && params?.crp_id ? (
                  <div>
                    <h2>Roles</h2>
                    <div className="col-12 col-md-12">
                      <div className="form-group">
                        <label className="form-label">Select Roles</label>
                        <Select
                          className={
                            selectedRolesMeta.length > 0
                              ? "form-control"
                              : "field_warning"
                          }
                          onChange={handleSelectRolesChange}
                          isSearchable={true}
                          isMulti
                          defaultValue={selectedRolesForSelectData}
                          options={rolesMeta}
                          placeholder={"Select Roles"}
                        />
                        {rolesError && (
                          <span className="error-fields">
                            Select Roles To Continue
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2>Roles</h2>
                    <div className="col-12 col-md-12">
                      <div className="form-group">
                        <label className="form-label">Select Roles</label>
                        <Select
                          className={
                            selectedRolesMeta.length > 0
                              ? "form-control"
                              : "field_warning"
                          }
                          onChange={handleSelectRolesChange}
                          isSearchable={true}
                          isMulti
                          defaultValue={selectedRolesForSelectData}
                          options={rolesMeta}
                          placeholder={"Select Roles"}
                        />
                        {rolesError && (
                          <span className="error-fields">
                            Select Roles To Continue
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  className="btn btn-primary"
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  Save changes
                </Button>
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
