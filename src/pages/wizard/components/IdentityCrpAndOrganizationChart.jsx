import { Button, Col, Container, Form, Row, Nav, Spinner, Alert, Table, Dropdown, Card } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "../../../components/vendor/Select";
import { getParticularFieldsApi, postIdentityAPI, getParticularsDetailByIdentityIdAPI, getCrpRoleMetaAPI, getEntityTypeAPI, getCRPsByIdentityIdAPI } from "../../../api/network/CustomerApi";
import axios from "axios";
import FeatherIcon from "feather-icons-react";
import "@nosferatu500/react-sortable-tree/style.css";
import SortableTree from "@nosferatu500/react-sortable-tree";
// import EntityIcon from "../../../icons/entity.svg";
import UserIcon from '../../../assets/UserIcon.jpg'
import IndividualIcon from '../../../icons/individual.svg'
import DeleteAccountModal from "./deleteModalCrp/DeleteAccountModal";
import CustomAlert from "../../../widgets/components/Alerts";
import PhoneInput from "react-phone-input-2";
import formatDateRegionWise from "../../../helpers/formatDateRegionWise";
import Flatpickr from "../../../components/vendor/Flatpickr";
import { format } from "date-fns";
import { FaExclamationCircle } from "react-icons/fa";
import { useTheme } from "../../../contexts/themeContext";

let crpIdValueSelected = "";
let treeDataGlobal = [];
let oldCrpId = "";
let showParticularForm = false;
export default function particular(props) {
  var allRequiredField = [];
  const {theme} = useTheme();
  const [updateLabel, setUpdateLabel] = useState(false);
  const params = useParams();
  const [crpIdentityId, setCrpIdentityId] = useState(null);
  const navigate = useNavigate();
  const cancelTokenSource = axios.CancelToken.source();
  const [particularFields, setParticularFields] = useState([]);
  const [particularAddedData, setParticularAddedData] = useState([]);
  const [particularAddedDataRoles, setParticularAddedDataRoles] = useState([]);
  const [identityDataFields, setIdentityDataFields] = useState(null);
  const [label, setLabel] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [parentLabel, setParentLabel] = useState(null);
  const [labelError, setLabelError] = useState(false);
  const [rolesError, setRolesError] = useState(false);
  const [ownerShipError, setOwnerShipError] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [isLoaderCrp, setIsLoaderCrp] = useState(false);
  const [message, setMessage] = useState(false);
  const [messageValue, setMessageValue] = useState("");
  const [errorMessage, SetErrorMessage] = useState(false);
  const [rolesMeta, setRolesMeta] = useState([]);
  const [entityType, setEntityType] = useState(null);
  const [entityError, setEntityError] = useState(false);
  const [selectedRolesMeta, setSelectedRolesMeta] = useState([]);
  const [entityTypeList, setEntityTypeList] = useState(null);
  const [selectedRolesForSelectData, setSelectedRolesForSelectData] = useState([]);
  const [crpListData, setCrpListData] = useState([]);
  const [rolesMetaData, setRolesMetaData] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [particularFieldsDataAll, setParticularFieldsDataAll] = useState(null);
  const [isShowMoreFields, setIsShowMoreFields] = useState(false);
  let identity_id_from_props = props?.dataOfAccountSetup?.identity_id;
  let account_id_from_props = props?.dataOfAccountSetup?.account_id;
  let crp_id_from_props = props?.crp_id;

  let customerType_from_props = props?.dataOfAccountSetup?.isIndividual ? "individual" : "corporate";
  const [identity_id, setIdentityId] = useState(identity_id_from_props);

  const [account_id, setAccountId] = useState(account_id_from_props);
  const [crp_id, setCrpId] = useState(crp_id_from_props);
  const [customerType, setCustomerType] = useState(null);
  const [addNewCrp, setAddNewCrp] = useState(false);
  const [showParticularFormData, setShowParticularFormData] = useState(false);
  const [randomKey, setRandomKey] = useState(2423423);
  const [graphZoom, setGraphZoom] = useState(80);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [alertProps, setAlertProps] = useState({
    variant: "",
    message: "",
    show: false,
    hideAuto: false,
  });
  const handleCloseAlert = () => {
    setAlertProps({ ...alertProps, show: false });
  };

  const handleCloseModal = () => setDeleteConfirmationModal(false);
  const handleAlert = ({ variant, message, hideAuto }) => {
    setAlertProps({ variant, message, show: true, hideAuto });
  };

  // const [oldCrpId, setOldCrpId] = useState("");

  useEffect(() => {
    if (identityDataFields && particularAddedData && updateLabel) {
      getFullNameAndCountryLabel();
      setUpdateLabel(false);
    }
  }, [identityDataFields, particularAddedData, updateLabel]);

  useEffect(() => {
    if (message) {
      setTimeout(function () {
        setMessage(false);
      }, 5000);
    }
  }, [message]);
  useEffect(() => {
    console.log("selectedRolesMeta", selectedRolesMeta);
  }, [selectedRolesMeta]);
  useEffect(() => {
    if (errorMessage) {
      setTimeout(function () {
        SetErrorMessage(false);
      }, 5000);
    }
  }, [errorMessage]);
  useEffect(() => {
    if (props?.crpId) {
      setCrpId(props?.crpId);
      crpIdValueSelected = props?.crpId;
      handleShowHideCRPProps(props?.crpType == "CORPORATE" ? "corporate" : "individual", props?.crpId, 1);
    }
    getParticularFields();
    getCrpRoleMeta();
    getEntityType();
  }, []);
  useEffect(() => {
    if (customerType && rolesMetaData) {
      filterRolesByType(rolesMetaData);
    }
  }, [customerType, rolesMetaData]);
  useEffect(() => {
    treeDataGlobal = treeData;
    console.log(treeData, "treeData useEffect");
  }, [treeData]);
  useEffect(() => {
    if (identity_id) {
      getSpecificIdentity(identity_id);
      getCRPsByIdentityId(props?.dataOfAccountSetup?.identity_id);
    }
    if (crp_id) {
      getSpecificIdentityCRP(crp_id);
    }
  }, [identity_id, crp_id]);
  useEffect(() => {
    let array = [];
    if (particularFieldsDataAll) {
      array = [...particularFieldsDataAll?.account_fields?.s_f, ...particularFieldsDataAll?.account_fields?.e_f];
      const filteredObj = array
        .filter((item) => {
          const key = Object.keys(item)[0];
          return key.includes(customerType);
        })
        .sort((a, b) => {
          const indexA = a[Object.keys(a)[0]].index;
          const indexB = b[Object.keys(b)[0]].index;
          return indexA - indexB;
        });
      setParticularFields(filteredObj);
      console.log(filteredObj, "array   arrayarrayarrayarrayarray");
    }
  }, [particularFieldsDataAll, customerType]);

  useEffect(() => {
    let selectedRolesForSelect = [];

    if (rolesMeta && particularAddedDataRoles) {
      console.log(rolesMeta, "rolesMeta");
      console.log(particularAddedDataRoles, "particularAddedData particularAddedData particularAddedData");
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

  const handleValidate = () => {
    let status = true;
    if (allRequiredField.length > 0) {
      console.log(identityDataFields, "dentityDataFields handleValidate");
      console.log("allRequiredField allRequiredField", allRequiredField);
      for (let item of allRequiredField) {
        if (identityDataFields && identityDataFields[item]) {
          if ((!identityDataFields[item] && identityDataFields[item].value === null) || identityDataFields[item].value == "") {
            status = false;
          }
        } else {
          status = false;
        }
      }
    }
    if (label != "" && label != null) {
    } else {
      status = false;
    }
  
   
    console.log(status, "status handleValidate ");
    // if (identityType == 'CORPORATE' && (entityType == '' || entityType === null)) {
    //     setEntityError(true);
    //     status = false;
    // } else {
    //     setEntityError(false);
    // }
    return status;
  };
 


  const getParticularFields = async () => {
    setIsLoader(true);
    let account_idss = null;
    if (account_id) {
      account_idss = account_id;
    }
    const response = await getParticularFieldsApi(account_idss, cancelTokenSource.token);
    setIsLoader(false);
    let array = [];
    if (response.success == true) {
      // let array = [...response.data?.fields, ...response.data?.account_fields];
      setParticularFieldsDataAll(response.data);
      array = [...response.data?.account_fields?.s_f, ...response.data?.account_fields?.e_f];
      const filteredObj = array
        .filter((item) => {
          const key = Object.keys(item)[0];
          return key.includes(props?.dataOfAccountSetup?.isIndividual ? "individual" : "corporate");
        })
        .sort((a, b) => {
          const indexA = a[Object.keys(a)[0]].index;
          const indexB = b[Object.keys(b)[0]].index;
          return indexA - indexB;
        });
      setParticularFields(filteredObj);
      console.log(filteredObj, "array   arrayarrayarrayarrayarray");
      // setParticularFields(array)
    } else {
    }
  };
  const getEntityType = async () => {
    setIsLoader(true);

    const response = await getEntityTypeAPI(cancelTokenSource.token);
    if (response.success == true) {
      setIsLoader(true);
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
      setRolesMetaData(response?.data?.crp_roles_meta);
    } else {
    }
  };
  const getSpecificIdentity = async (identity_id) => {
    const response = await getParticularsDetailByIdentityIdAPI(identity_id, cancelTokenSource.token);
    if (response.success == true) {
      setParentLabel(response.data?.label);
    } else {
    }
  };
  const getCRPsByIdentityId = async (identity_id) => {
    setIsLoaderCrp(true);
    const response = await getCRPsByIdentityIdAPI(identity_id, cancelTokenSource.token);
    if (response.success == true) {
      setCrpListData(response?.data[0]);
      setIsLoaderCrp(false);

      // setTreeData(response?.data)
      setTreeData([transformToTreeData(response?.data[0])]);
      // console.log(transformToTreeData(response?.data[0]), 'transformToTreeData(response?.data[0]')
    } else {
      setIsLoaderCrp(false);
    }
  };
  function flattenChildren(data) {
    const result = [];

    function flatten(node) {
      result.push({
        id: node.id,
        title: node.label,
        entityId: node.entityId,
        parentId: node.parentId,
        type: node.type,
        label: node.label,
        meta: node.meta,
        status: node.status,
        entityTypeId: node.entityTypeId,
        children: node.children,
        roles: node.roles,
      });

      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => flatten(child));
      }
    }

    flatten(data);
    return result;
  }
  const transformToTreeData = (node) => {
    setIsLoaderCrp(true);
    const { id, label, children, type, roles } = node;
    console.log(node, "node transformToTreeData");
    let name = "";
    let ownerShip = "";
    let rolesData = [];
    if (node?.type == "CORPORATE") {
      name = node?.meta?.data["corporate.basic.name"]?.value;
    } else {
      name = node?.meta?.data["individual.basic.first_name"]?.value + " " + node?.meta?.data["individual.basic.last_name"]?.value;
    }
    if (node?.parentId != 0) {
      if (node?.type == "CORPORATE") {
        ownerShip = node?.meta?.data["corporate.basic.ownership"]?.value;
      } else {
        ownerShip = node?.meta?.data["individual.basic.ownership"]?.value;
      }
    }
    if (node?.parentId != 0) {
      if (node?.roles) {
        for (let a of roles) {
          rolesData.push(a.roleName);
        }
      }
    }
    const treeDataNode = {
      name,
      type,
      ownerShip,
      rolesData,
      expanded: true,
      // canDrag: false,
      // canDrop: false,
      data: node,
      // canNodeHaveChildren: type == "CORPORATE" ? true : false,
      children: children.map(transformToTreeData),
      // Add any other properties you want here
      // For example, 'id', 'entityId', 'parentId', etc.
    };
    console.log(treeDataNode, "treeDataNode");
    setIsLoaderCrp(false);

    return treeDataNode;
  };

  const handleDeleteCRP = (node) => {
    setDeleteConfirmationModal(true);
    setSelectedRow(node?.data);
    console.log("sdsadasdasdasdasd", node);
  };

  const clearInputFieldsAndForms = () => {
    console.log("selectedRolesForSelectData", selectedRolesForSelectData);

    setSelectedRolesMeta([]);
    setParticularAddedData([]);

    setIdentityDataFields(null);
    setEntityType("");
    setLabel(null);
    setCustomerType(null);
    setShowParticularFormData(false);
  };

  const getFullNameAndCountryLabel = (label) => {
    let newLabel;

    if (customerType === "corporate") {
      const name = identityDataFields["corporate.basic.name"] ?? "";
      const country = identityDataFields["corporate.basic.incorporate_country_code"] ?? "";
      newLabel = `${name}  ${country}`;
    } else {
      const firstName = identityDataFields["individual.basic.first_name"] ?? "";
      const lastName = identityDataFields["individual.basic.last_name"] ?? "";
      const country = identityDataFields["individual.basic.nationality_code"] ?? "";

      // Construct the label using the first name, last name, and country
      newLabel = `${firstName} ${lastName} ${country}`;
    }
    setLabel(newLabel);
  };
  const getSpecificIdentityCRP = async (identity_id) => {
    const response = await getParticularsDetailByIdentityIdAPI(identity_id, cancelTokenSource.token);
    if (response.success == true) {
      setEntityType(response.data?.entityTypeId);
      setParticularAddedData(response.data?.meta?.data);
      setParticularAddedDataRoles(response.data?.roles);
      setLabel(response.data?.label);
      const extractedData = {};

      for (const key in response.data?.meta?.data) {
        if (key?.startsWith("corporate")) {
          if (key?.endsWith("name") || key?.endsWith("incorporate_country_code")) {
            const resulted_key = key.split(".")[key.split(".").length - 1];
            if (resulted_key === "name" || resulted_key === "incorporate_country_code") {
              extractedData[key] = response.data?.meta?.data[key].value;
            }
          }
        } else if (key.startsWith("individual")) {
          if (key.endsWith("first_name") || key.endsWith("last_name") || key.endsWith("nationality_code")) {
            // const resulted_key = key.split(".")[key.split(".").length - 1];
            extractedData[key] = response.data?.meta?.data[key].value;
          }
        }
      }

      setIdentityDataFields(extractedData);
      setCustomerType(response.data?.type.toLowerCase());
    } else {
    }
  };
  const filterRolesByType = (data) => {
    console.log(data, "data filterRolesByType");
    console.log(customerType.toUpperCase(), "customerType.toUpperCase()");
    if (data) {
      let filterRolesMeta = [];
      for (let item of data) {
        if (item?.crp_type == customerType.toUpperCase()) {
          filterRolesMeta.push({ value: item?.id, label: item?.name });
        }
      }
      console.log(filterRolesMeta, "filterRolesMeta  filterRolesMetafilterRolesMetafilterRolesMeta");
      setRolesMeta(filterRolesMeta);
    }
  };
  // const handleChange = (e) => {
  //   setIdentityDataFields({ ...identityDataFields, [e.target.name]: e.target.value });
  // };
  const handleChange = (e) => {
    setIdentityDataFields({ ...identityDataFields, [e.target.name]: e.target.value });
    if (
      e.target.name === "corporate.basic.name" ||
      e.target.name === "corporate.basic.incorporate_country_code" ||
      e.target.name === "individual.basic.first_name" ||
      e.target.name === "individual.basic.last_name" ||
      e.target.name === "individual.basic.nationality_code"
    ) {
      setUpdateLabel(true);
    }
  };

  const handleChangeCheckBox = (e) => {
    setIdentityDataFields({ ...identityDataFields, [e.target.name]: e.target.checked });
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
    if (customerType == "corporate" && (entityType == "" || entityType === null)) {
      setEntityError(true);
      topFunction();
      return;
    } else {
      setEntityError(false);
    }
    if (identityDataFields && identityDataFields.hasOwnProperty(customerType + ".basic.ownership")) {
      if (identityDataFields[customerType + ".basic.ownership"] == "") {
        setOwnerShipError(true);
        return;
      }
      if (parseInt(identityDataFields[customerType + ".basic.ownership"]) > 100) {
        setOwnerShipError(true);
        return;
      }
    } else if (particularAddedData && particularAddedData.hasOwnProperty(customerType + ".basic.ownership")) {
      if (particularAddedData[customerType + ".basic.ownership"] == "") {
        setOwnerShipError(true);
        return;
      }
      if (parseInt(particularAddedData[customerType + ".basic.ownership"]) > 100) {
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
      parent_id: identity_id,
      customer_type_key: customerType.toUpperCase(),
      data: identityDataFields ? identityDataFields : {},
      roles: selectedRoles,
      fund_id: props?.dataOfAccountSetup?.fund_id,
      entity_type_id: customerType == "individual" ? null : entityType.toString(),
    };
    if (!addNewCrp) {
      dataToSend["identity_id"] = crp_id;
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
      handleAlert({
        variant: "success",
        message: "CRP Added Successfully",
        show: true,
        hideAuto: true,
      })
      let customerType = response?.data?.type.toLowerCase();
      let crpId = response?.data?.id;
      getCRPsByIdentityId(identity_id_from_props);
      getSpecificIdentityCRP(crpId);
      clearInputFieldsAndForms();
      setCustomerType(null);
      showParticularForm = false;
      // setTimeout(function () {
      //     navigate(-1);
      // }, 1000)

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
    return particularAddedData[key]?.value == null ? "" : particularAddedData[key]?.value;
  };
  const handleSelectRolesChange = (selectedOptions) => {
    setSelectedRolesMeta(selectedOptions);
    console.log(selectedOptions, "selectedOptions");
    setRolesError("");
  };
  const handleChangeEntityKey = (e) => {
    setEntityType(e.target.value);
  };
  const handleAddNewCRP = (type, selectedCrpId) => {
    setSelectedRolesMeta([]);
    setLabel(null);
    setParticularAddedData([]);

    setIdentityDataFields(null);
    setEntityType("");
    setCustomerType(type);
    setIdentityId(selectedCrpId);
    crpIdValueSelected = selectedCrpId;
    setAddNewCrp(true);
    setShowParticularFormData(true);
  };
  const handleEditCRP = (type, selectedCrpId, parentId) => {
    console.log(selectedCrpId, "selectedCrpId");
    if (parentId != 0) {
      setCustomerType(type);
      crpIdValueSelected = selectedCrpId;
      setCrpId(selectedCrpId);
      setAddNewCrp(false);
    }
  };
  const handleShowHideCRP = (type, selectedCrpId, parentId) => {
    setCrpIdentityId();
    console.log(selectedCrpId, "selectedCrpId");
    setCrpId(null);
    setCustomerType(null);
    setAddNewCrp(null);
    if (parentId != 0) {
      setCustomerType(type);
      crpIdValueSelected = selectedCrpId;
      setCrpId(selectedCrpId);
      setAddNewCrp(false);
      if (oldCrpId == selectedCrpId) {
        showParticularForm = !showParticularForm;
      } else {
        showParticularForm = true;
      }
      setShowParticularFormData(showParticularForm);
      oldCrpId = selectedCrpId;
      // setOldCrpId(selectedCrpId)
      setRandomKey(Math.floor(Math.random() * 99999) + 1);
    }
  };
  const handleShowHideCRPProps = (type, selectedCrpId, parentId) => {
    console.log(selectedCrpId, "selectedCrpId");
    setCrpId(null);
    setCustomerType(null);
    setAddNewCrp(null);
    if (parentId != 0) {
      setCustomerType(type);
      crpIdValueSelected = selectedCrpId;
      setCrpId(selectedCrpId);
      setAddNewCrp(false);
      if (oldCrpId == selectedCrpId) {
        showParticularForm = !showParticularForm;
      } else {
        showParticularForm = true;
      }
      setShowParticularFormData(showParticularForm);
      oldCrpId = selectedCrpId;
      // setOldCrpId(selectedCrpId)
      setRandomKey(Math.floor(Math.random() * 99999) + 1);
    }
  };

  const toggleExpandById = (data, id) => {
    return data.map((item) => {
      if (item.data.id === id) {
        console.log(item.expanded, "matched toggleExpandById");
        return {
          ...item,
          expanded: item.expanded === true ? false : true,
        };
      }

      if (item.children) {
        return {
          ...item,
          children: toggleExpandById(item.children, id),
        };
      }

      return item;
    });
  };

  const nodeContentRenderer = ({ node }) => {
    console.log(showParticularForm, "showParticularForm nodeContentRenderer nodeContentRenderer");
    console.log(node, "node nodenode");
    console.log(crpIdValueSelected, "crpIdValueSelected crpIdValueSelected");
    console.log(node?.data.id, "node?.data.id node?.data.id");
    let ownerShip = 0;
    let borderStyle = "";
    if (node?.type == "CORPORATE") {
      if (node?.children) {
        for (let a of node?.children) {
          ownerShip += parseInt(a?.ownerShip);
        }
      }

      if (ownerShip != "100") {
        borderStyle = "1px solid red";
      }
      if (node?.data.id == crpIdValueSelected) {
        console.log("crp id matcheededed");
        borderStyle = "2px solid #1b636e";
      }
    }
    if (node?.data.id == crpIdValueSelected) {
      console.log("crp id matcheededed");
      borderStyle = "2px solid #1b636e";
    }
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          width: "100%",
          padding: node?.data?.parentId == "0" ? "20px 10px" : "5px 10px",
          border: `${borderStyle}`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            maxWidth: "80%",
            wordWrap: "break-word",
            alignItems: "center",
          }}
        >
          <div>
            {node?.data?.type == "INDIVIDUAL" ? (
              <IndividualIcon
                className={"nodeIcon"}
                fontSize={"large"}
                color={"action"}
                style={{
                  fill: theme == "dark" || theme == undefined ? "white" : "black",
                }}
              />
            ) : (
              <EntityIcon
                className={"nodeIcon"}
                fontSize={"large"}
                color={"action"}
                style={{
                  fill: theme == "dark" || theme == undefined ? "white" : "black",
                }}
              />
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "80%",
              wordWrap: "break-word",
            }}
          >
            <span>{node.type}</span>
            <span style={{ overflow: "hidden" }}>{node.name}</span>
            {node?.data?.parentId != "0" && <span>OwnerShip: {node.ownerShip + "%"}</span>}
            {node?.data?.parentId != "0" && (
              <span>
                <Dropdown align="end">
                  <Dropdown.Toggle as="span" className="dropdown-ellipses" role="button">
                    <Button
                      className="lift"
                      style={{
                        backgroundColor: "transparent",
                        borderColor: "transparent",
                        padding: "0px",
                      }}
                    >
                      Roles: <FeatherIcon icon="info" size="1em" color="#2c7be5" />
                    </Button>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>{node?.rolesData && node?.rolesData.map((item, index) => <Dropdown.Item href="javascript:void(0);">{item}</Dropdown.Item>)}</Dropdown.Menu>
                </Dropdown>
              </span>
            )}
          </div>
        </div>
        <div style={{ marginLeft: "20px" }}>
          {node?.data?.parentId != "0" && (
            <div>
              <Button
                onClick={() => handleShowHideCRP(node?.data?.type == "CORPORATE" ? "corporate" : "individual", node?.data.id, node?.data?.parentId)}
                className="lift"
                style={{
                  height: "30px",
                  width: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "6px",
                  marginTop: "5px",
                  marginBottom: "5px",
                }}
              >
                <FeatherIcon icon={showParticularForm && oldCrpId == node?.data.id ? "eye" : "eye-off"} size="1em" />
              </Button>

              <Button
                onClick={() => handleDeleteCRP(node)} //
                className="lift"
                style={{
                  height: "30px",
                  width: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "6px",
                  marginTop: "5px",
                  marginBottom: "5px",
                  backgroundColor: "red", // Add the red background color
                }}
              >
                <FeatherIcon icon="trash" size="1em" />
              </Button>
            </div>
          )}
          {node?.data?.type == "CORPORATE" && (
            <Dropdown align="end">
              <Dropdown.Toggle as="span" className="dropdown-ellipses" role="button">
                <Button
                  className="lift"
                  onClick={() => {
                    clearInputFieldsAndForms();
                    setParticularAddedDataRoles([]);
                    setParticularAddedData([]);
                    setCustomerType(null);
                    showParticularForm = false;
                  }}
                  style={{
                    height: "30px",
                    width: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "6px",
                  }}
                >
                  <FeatherIcon icon="plus" size="1em" />
                </Button>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  href="javascript:void(0);"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleAddNewCRP("individual", node?.data?.id);
                  }}
                >
                  Individual
                </Dropdown.Item>
                <Dropdown.Item
                  href="javascript:void(0);"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleAddNewCRP("corporate", node?.data?.id);
                  }}
                >
                  Corporate
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </div>
    );
  };
  const getNodeClassName = (node) => {
    return "ownership-error-border";
    console.log(node, "node");
    console.log(node?.data?.children, "node?.data?.children");
    let nodeId = node?.data?.id;
    let ownerShip = 0;
    if (node?.type == "CORPORATE") {
      if (node?.children) {
        for (let a of node?.children) {
          ownerShip += parseInt(a?.ownerShip);
        }
      }

      if (ownerShip != "100") {
        return "ownership-error-border";
      }
    }
    if (nodeId == crpId) {
      return "active-node-border";
    }
    return "";
    // if (node.id === YOUR_SPECIFIC_NODE_ID) {
    //   return 'custom-border';
    // }
    // return '';
  };
  const handleShowMoreFields = () => {
    setIsShowMoreFields(!isShowMoreFields);
  };
  const zoomStep = 10;
  const zoomInCallback = () => {
    if (graphZoom < 120) {
      setGraphZoom(graphZoom + zoomStep);
    }
  };

  const zoomIOutCallback = () => {
    if (graphZoom > 40) {
      setGraphZoom(graphZoom - zoomStep);
    }
  };
  const handlePhoneNumber = (phone, formKey, e) => {
    setIdentityDataFields({
      ...identityDataFields,
      [formKey]: phone,
    });
  };
  const handleChangeDate = (name, value) => {
    // setIdentityDataFields({ ...identityDataFields, [name]: value });
    setIdentityDataFields({ ...identityDataFields, [name]: format(new Date(value[0]), "yyyy-MM-dd") });
  };
  return (
    <div className={`bg-gradient-stepper-card-${theme} w-full`}>
       <div className={`bg-gradient-stepper-card-${theme} w-full`}>
        <div className="justify-center flex w-full gap-4">
          {showParticularFormData}
          {showParticularForm}
         
          <div className={`w-full lg:w-5/12 xl:w-5/12 bg-color-card-${theme} shadow-${theme} rounded-lg border border-color-${theme} ml-6`}>
            {/* {isLoaderCrp && (
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "20rem" }}>
                                <Spinner animation="grow" />
                            </div>
                        )} */}
            <div>
              <div className={`bg-color-card-${theme} shadow-${theme} border border-color-${theme} rounded-t-lg py-[12px] px-[24px] mb-4`}>
                <div className={`flex justify-between items-center`}>
                  <h3 className={`text-color-text-${theme}`}>Ultimate Beneficial Owner (UBO)</h3>
                  <div className={`flex justify-between gap-4 bg-[#2c7ce3] p-2 rounded-full items-center`}>
                    <FeatherIcon icon="zoom-out" size="20px" onClick={zoomIOutCallback} />
                    <FeatherIcon icon="zoom-in" size="20px" onClick={zoomInCallback} />
                  </div>
                </div>
              </div>
              <div style={{ height: "70vh", overflow: "auto" }}>
                <div style={{ zoom: `${graphZoom}%`, height: "100vh" }}>
                  {treeData.length > 0 && (
                    <SortableTree
                      key={randomKey}
                      treeData={treeData}
                      nodeContentRenderer={nodeContentRenderer}
                      canDrag={false}
                      // onChange={treeDatas => setTreeData(treeDatas)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={`w-full lg:w-7/12 xl:w-7/12 bg-color-card-${theme} shadow-${theme} rounded-lg border border-color-${theme} mr-6`}>
          
            {showParticularFormData ? (
              <div>
                <div>
                  <div className={`flex bg-color-card-${theme} shadow-${theme} border-b border-color-${theme} rounded-t-lg px-[24px] py-[10px] mb-10`} style={{ justifyContent: "space-between", alignItems: "center", textTransform: "capitalize" }}>
                    <h3 className="mb-0" style={{ textTransform: "capitalize" }}>
                      {customerType}
                    </h3>
                    <div>
                      {customerType && (
                        <>
                          {customerType == "individual" ? (
                            <img src="/img/investor/default-avatar.png" alt="..." className="" style={{ height: "35px", marginRight: "8px" }} />
                          ) : (
                            // <EntityIcon
                            //   className={"nodeIcon"}
                            //   fontSize={"large"}
                            //   color={"action"}
                            //   style={{
                            //     fill: theme == "dark" || theme == undefined ? "white" : "black",
                            //   }}
                            // />
                            <img src={UserIcon} alt="EntityIcon" className="w-10"/>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Card.Body style={{ height: "70vh", overflow: "auto" }}>
                  {customerType && showParticularFormData && (
                    <>
                      {message && (
                        <div>
                          <Alert closeLabel dismissible={true} key="success" variant="success" onClose={() => setMessage(null)}>
                            Identity {identity_id ? "Updated" : "Added"} Successfully
                          </Alert>
                        </div>
                      )}
                      {errorMessage && (
                        <div>
                          <Alert closeLabel dismissible={true} key="danger" variant="danger" onClose={() => SetErrorMessage(null)}>
                            {messageValue}
                          </Alert>
                        </div>
                      )}
                      {isLoader || isLoaderCrp ? (
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "20rem" }}>
                          <Spinner animation="grow" />
                        </div>
                      ) : (
                        <form className={`ml-8 mr-8`}>
                          <div className="flex flex-col gap-4">
                            <div className="">
                              <div className="flex flex-col gap-2">
                                <label className={`text-color-text-${theme} font-light text-[15px]`}>Parent Identity Label</label>
                                <input type="text" className={`bg-color-textfield-dropdown-${theme} shadow-${theme} text-color-text-${theme} py-2 px-4 rounded-lg`} value={parentLabel} readOnly disabled placeholder="Parent Label Of Identity" />
                              </div>
                            </div>
                            <div className="">
                              <div className="flex flex-col gap-2">
                                <label className={`text-color-text-${theme} font-light text-[15px]`}>Identity Label</label>
                                <input
                                  type="text"
                                  className={label ? `bg-color-textfield-dropdown-${theme} shadow-${theme} py-2 px-4 rounded-lg` : `bg-color-textfield-dropdown-${theme} shadow-${theme} py-2 px-4 rounded-lg border border-orange-500`}
                                  name={"label"}
                                  value={label}
                                  placeholder="Label Of Identity"
                                  onChange={(e) => {
                                    handleChangeLabel(e);
                                  }}
                                />
                                {labelError && <span className="error-fields">Enter Label To Continue</span>}
                              </div>
                            </div>
                            {customerType == "corporate" && (
                              <div className="">
                                <div className="flex flex-col gap-2">
                                  <label className={`text-color-text-${theme} font-light text-[15px]`}> Entity Type {!entityType && <span className="text-red-500">*</span>}</label>
                                  <select
                                    type="text"
                                    className={entityType ? `bg-color-textfield-dropdown-${theme} shadow-${theme} py-2 px-4 rounded-lg text-color-text-${theme} appearance-none` : `text-color-text-${theme} bg-color-textfield-dropdown-${theme} shadow-${theme} py-2 px-4 rounded-lg border border-orange-500 appearance-none`}
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
                                            <option key={index} value={entityTypeList[item]?.value} selected={entityTypeList[item]?.value == entityType}>
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
                            <div className="grid grid-cols-2 gap-4">
                            {particularFields &&
                              particularFields &&
                              particularFields.map((item, index) => {
                                let key = Object.keys(item);
                                let checkFieldsShow = item[key[0]].hasOwnProperty("enabled");
                                if (checkFieldsShow && item[key[0]]?.enabled) {
                                  if (item[key[0]]?.for == "crp" || item[key[0]]?.for == "all") {
                                    let key = Object.keys(item);
                                    if (key) {
                                      let keyValues = key[0].split(".");
                                      let customerTypes = keyValues[0];
                                      let formType = keyValues[1];
                                      let fieldName = keyValues[2];
                                      let label = fieldName.replaceAll("_", " ");
                                      let formKeyVal = key[0];
                                      let editableField = item[key[0]]?.editable ? item[key[0]]?.editable : true;
                                      let valueField = item[key[0]]?.value;
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
                                      let crpCustomerType = customerTypes + "." + formType;
                                      let paramFieldCrp = customerType + "." + "crp";
                                      if(requiredField){
                                        allRequiredField.push(key[0]);

                                      }
                                      if (customerTypes == customerType && requiredField) {
                                        if (fieldType == "text") {
                                          if (fieldName == "phone") {
                                            return (
                                              <div className="" key={index}>
                                                <div className="flex flex-col gap-2">
                                                  <label className={`text-color-text-${theme} font-light text-[15px]`}>
                                                    {label}
                                                    {requiredField && <span className="text-danger">*</span>}
                                                  </label>
                                                  <div
                                                    className={
                                                      requiredField && !identityDataFields?.[formKeyVal] && (getUpdatedData(formKeyVal) == "" || getUpdatedData(formKeyVal) == null)
                                                        ? `bg-color-textfield-dropdown-${theme} shadow-${theme} py-2 px-4 rounded-lg text-color-text-${theme} appearance-none` : `text-color-text-${theme} bg-color-textfield-dropdown-${theme} shadow-${theme} py-2 px-4 rounded-lg border border-orange-500 appearance-none`
                                                    }
                                                  >
                                                    <PhoneInput
                                                      value={getUpdatedData(formKeyVal)}
                                                      country={"sg"}
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
                                              <div className="" key={index}>
                                                <div className="flex flex-col gap-2">
                                                  <label className={`text-color-text-${theme} font-light text-[15px]`}>
                                                    {label}
                                                    {requiredField && <span className="text-red-500">*</span>}
                                                  </label>
                                                  <input
                                                    type={fieldType}
                                                    className={requiredField && !identityDataFields?.[formKeyVal] && (getUpdatedData(formKeyVal) == "" || getUpdatedData(formKeyVal) == null) ? `bg-color-textfield-dropdown-${theme} shadow-${theme} py-2 px-4 rounded-lg text-color-text-${theme} appearance-none border border-orange-500` : `text-color-text-${theme} bg-color-textfield-dropdown-${theme} shadow-${theme} py-2 px-4 rounded-lg  appearance-none`}
                                                    defaultValue={editableField === false ? valueField : getUpdatedData(formKeyVal)}
                                                    readOnly={!editableField}
                                                    name={formKeyVal}
                                                    placeholder={label}
                                                    onChange={(e) => {
                                                      handleChange(e);
                                                    }}
                                                  />
                                                  {fieldName == "ownership" && ownerShipError && <span className="error-fields">Ownership(%) should be between 0-100</span>}
                                                </div>
                                              </div>
                                            );
                                          }
                                        }
                                        if (fieldType == "date") {
                                          return (
                                            <div className="" key={index}>
                                              <div className="flex flex-col gap-2">
                                                <label className={`text-color-text-${theme} font-light text-[15px]`}>
                                                  {label}
                                                  {requiredField && <span className="text-danger">*</span>}
                                                </label>
                                                {/* <input
                                                type={fieldType}
                                                defaultValue={editableField === false ? valueField : getUpdatedData(formKeyVal)}
                                                readOnly={!editableField}
                                                className={requiredField && !identityDataFields?.[formKeyVal] && (getUpdatedData(formKeyVal) == "" || getUpdatedData(formKeyVal) == null) ? "form-control" : "form-control"}
                                                name={formKeyVal}
                                                placeholder={label}
                                                onChange={(e) => {
                                                  handleChange(e);
                                                }}
                                              /> */}
                                                <Flatpickr
                                                  placeholder={label}
                                                  defaultValue={editableField === false ? valueField : getUpdatedData(formKeyVal)}
                                                  readOnly={!editableField}
                                                  className={requiredField && !identityDataFields?.[formKeyVal] && (getUpdatedData(formKeyVal) == "" || getUpdatedData(formKeyVal) == null) ? "form-control field_warning" : "form-control"}
                                                  name={formKeyVal}
                                                  options={{
                                                    dateFormat: formatDateRegionWise(null, null, true),
                                                    allowInput: true,
                                                  }}
                                                  value={formatDateRegionWise(editableField === false ? valueField : getUpdatedData(formKeyVal))}
                                                  onChange={(e) => {
                                                    handleChangeDate(formKeyVal, e);
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          );
                                        }

                                        if (fieldType == "dd") {
                                          if (sourceType == "table" || sourceType == "custom") {
                                            return (
                                              <div className="" key={index}>
                                                <div className="flex flex-col gap-2">
                                                  <label className={`text-color-text-${theme} font-light text-[15px]`}>
                                                    {label}
                                                    {requiredField && <span className="text-danger">*</span>}
                                                  </label>
                                                  <select
                                                    className={requiredField && !identityDataFields?.[formKeyVal] && (getUpdatedData(formKeyVal) == "" || getUpdatedData(formKeyVal) == null) ? `bg-color-textfield-dropdown-${theme} shadow-${theme} py-2 px-4 rounded-lg text-color-text-${theme} appearance-none border border-orange-500` : `text-color-text-${theme} bg-color-textfield-dropdown-${theme} shadow-${theme} py-2 px-4 rounded-lg  appearance-none`}
                                                    defaultValue={editableField === false ? valueField : getUpdatedData(formKeyVal)}
                                                    readOnly={!editableField}
                                                    name={formKeyVal}
                                                    onChange={(e) => {
                                                      handleChange(e);
                                                    }}
                                                  >
                                                    <option value="">Select {label}</option>
                                                    {fieldData &&
                                                      fieldData.map((dat, index) => (
                                                        <option key={index} value={dat[returnKey]} selected={editableField == false && valueField == dat[returnKey] ? true : getUpdatedData(formKeyVal) == dat[returnKey] ? true : false}>
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
                                              <div className="" key={index}>
                                                <div className="flex flex-col gap-2">
                                                  <label className={`text-color-text-${theme} font-light text-[15px]`}>
                                                    {label}
                                                    {requiredField && <span className="text-red-500">*</span>}
                                                  </label>
                                                  <select
                                                    className={requiredField && !identityDataFields?.[formKeyVal] && (getUpdatedData(formKeyVal) == "" || getUpdatedData(formKeyVal) == null) ? `bg-color-textfield-dropdown-${theme} shadow-${theme} py-2 px-4 rounded-lg text-color-text-${theme} appearance-none border border-orange-500` : `text-color-text-${theme} bg-color-textfield-dropdown-${theme} shadow-${theme} py-2 px-4 rounded-lg  appearance-none`}
                                                    defaultValue={editableField === false ? valueField : getUpdatedData(formKeyVal)}
                                                    disabled={!editableField}
                                                    name={formKeyVal}
                                                    onChange={(e) => {
                                                      handleChange(e);
                                                    }}
                                                  >
                                                    <option value="">Select {label}</option>
                                                    {fieldData &&
                                                      Object.keys(fieldData).map((dat, index) => (
                                                        <option key={index}
                                                          value={fieldData[dat][returnKey]}
                                                          selected={editableField == false && valueField == fieldData[dat][returnKey] ? true : getUpdatedData(formKeyVal) == fieldData[dat][returnKey] ? true : false}
                                                        >
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
                                            <div key={index} className="" style={{ display: "flex", alignItems: "center", marginBottom: "25px" }}>
                                              <Form.Check
                                                // className={requiredField && !identityDataFields?.[formKeyVal] && (getUpdatedData(formKeyVal) == '' || getUpdatedData(formKeyVal) == null) ? "checkbox-field field_warning" : "checkbox-field"}
                                                className={``}
                                                type={"checkbox"}
                                                id={formKeyVal}
                                                name={formKeyVal}
                                                label={label}
                                                defaultChecked={editableField === false ? valueField : getUpdatedData(formKeyVal)}
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
                          </div>
                          {selectedRolesForSelectData.length > 0 && crp_id ? (
                            <div>
                              
                              <h2>Roles</h2>
                              <div className="">
                                <div className="flex flex-col gap-2">
                                  <label className={`text-color-text-${theme} font-light text-[15px]`}>Select Roles {<span className="text-red-500">*</span>}</label>
                                  <Select
                                    onChange={handleSelectRolesChange}
                                    isSearchable={true}
                                    isMulti
                                    defaultValue={selectedRolesForSelectData}
                                    options={rolesMeta}
                                    placeholder={"Select Roles"}
                                    className={selectedRolesForSelectData.length > 0 && crp_id ? `bg-color-textfield-dropdown-${theme} shadow-${theme} py-2 px-4 rounded-lg text-color-text-${theme} appearance-none ` : `text-color-text-${theme} border border-orange-500 bg-color-textfield-dropdown-${theme} shadow-${theme} py-2 px-4 rounded-lg  appearance-none`}
                                  />
                                  {rolesError && <span className="error-fields">Select Roles To Continue</span>}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <h2 className="text-xl mt-4 mb-4">Roles</h2>
                              <div className="">
                                <div className="flex flex-col gap-2">
                                  <label className={`text-color-text-${theme} font-light text-[15px]`}>Select Roles{<span className="text-red-500">*</span>}</label>
                                  <Select
                                    onChange={handleSelectRolesChange}
                                    isSearchable={true}
                                    isMulti
                                    defaultValue={selectedRolesForSelectData}
                                    options={rolesMeta}
                                    placeholder={"Select Roles"}
                                    className={selectedRolesForSelectData.length > 0 && crp_id ? `bg-color-textfield-dropdown-${theme} shadow-${theme} py-2 px-4 rounded-lg text-color-text-${theme} appearance-none ` : `text-color-text-${theme} border border-orange-500 bg-color-textfield-dropdown-${theme} shadow-${theme} py-2 px-4 rounded-lg  appearance-none`}
                                  />
                                  {rolesError && <span className="error-fields">Select Roles To Continue</span>}
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex" style={{ justifyContent: "flex-end" }}>
                            <button
                              className={`bg-color-cancelBtn-${theme}  hover:bg-color-cancelBtn-hover-${theme} mt-6 border border-white hover:border-color-iconButton-hover-${theme} transition-all duration-300 ease-in-out px-6 py-3 rounded-lg text-white outline-none`}
                              onClick={() => {
                                handleShowMoreFields();
                              }}
                            >
                              {isShowMoreFields ? "Hide Extra Fields" : "Show More Fields"}
                            </button>
                          </div>
                          {isShowMoreFields && (
                            <div className="row">
                              {particularFields &&
                                particularFields &&
                                particularFields.map((item, index) => {
                                  let key = Object.keys(item);
                                  let checkFieldsShow = item[key[0]].hasOwnProperty("enabled");
                                  if (checkFieldsShow && item[key[0]]?.enabled) {
                                    if (item[key[0]]?.for == "crp" || item[key[0]]?.for == "all") {
                                      let key = Object.keys(item);
                                      if (key) {
                                        let keyValues = key[0].split(".");
                                        let customerTypes = keyValues[0];
                                        let formType = keyValues[1];
                                        let fieldName = keyValues[2];
                                        let label = fieldName.replaceAll("_", " ");
                                        let formKeyVal = key[0];

                                        let editableField = item[key[0]]?.editable ? item[key[0]]?.editable : true;
                                        let valueField = item[key[0]]?.value;
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
                                        let crpCustomerType = customerTypes + "." + formType;
                                        let paramFieldCrp = customerType + "." + "crp";
                                        if (customerTypes == customerType && !requiredField) {
                                          if (fieldType == "text") {
                                            return (
                                              <div className="col-6 col-md-6">
                                                <div className="form-group">
                                                  <label className="form-label">
                                                    {label}
                                                    {requiredField && <span className="text-danger">*</span>}
                                                  </label>
                                                  <input
                                                    type={fieldType}
                                                    className={requiredField && !identityDataFields?.[formKeyVal] && (getUpdatedData(formKeyVal) == "" || getUpdatedData(formKeyVal) == null) ? "form-control field_warning" : "form-control"}
                                                    defaultValue={editableField === false ? valueField : getUpdatedData(formKeyVal)}
                                                    readOnly={!editableField}
                                                    name={formKeyVal}
                                                    placeholder={label}
                                                    onChange={(e) => {
                                                      handleChange(e);
                                                    }}
                                                  />
                                                  {fieldName == "ownership" && ownerShipError && <span className="error-fields">Ownership(%) should be between 0-100</span>}
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
                                                    {requiredField && <span className="text-danger">*</span>}
                                                  </label>
                                                  <input
                                                    type={fieldType}
                                                    defaultValue={editableField === false ? valueField : getUpdatedData(formKeyVal)}
                                                    readOnly={!editableField}
                                                    className={requiredField && !identityDataFields?.[formKeyVal] && (getUpdatedData(formKeyVal) == "" || getUpdatedData(formKeyVal) == null) ? "form-control field_warning" : "form-control"}
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
                                            if (sourceType == "table" || sourceType == "custom") {
                                              return (
                                                <div className="col-6 col-md-6">
                                                  <div className="form-group">
                                                    <label className="form-label">
                                                      {label}
                                                      {requiredField && <span className="text-danger">*</span>}
                                                    </label>
                                                    <select
                                                      className={requiredField && !identityDataFields?.[formKeyVal] && (getUpdatedData(formKeyVal) == "" || getUpdatedData(formKeyVal) == null) ? "form-control field_warning" : "form-control"}
                                                      defaultValue={editableField === false ? valueField : getUpdatedData(formKeyVal)}
                                                      readOnly={!editableField}
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
                                                    <label className="form-label">
                                                      {label}
                                                      {requiredField && <span className="text-danger">*</span>}
                                                    </label>
                                                    <select
                                                      className={requiredField && !identityDataFields?.[formKeyVal] && (getUpdatedData(formKeyVal) == "" || getUpdatedData(formKeyVal) == null) ? "form-control field_warning" : "form-control"}
                                                      defaultValue={editableField === false ? valueField : getUpdatedData(formKeyVal)}
                                                      disabled={!editableField}
                                                      name={formKeyVal}
                                                      onChange={(e) => {
                                                        handleChange(e);
                                                      }}
                                                    >
                                                      <option value="">Select {label}</option>
                                                      {fieldData &&
                                                        Object.keys(fieldData).map((dat, index) => (
                                                          <option
                                                            value={fieldData[dat][returnKey]}
                                                            selected={editableField == false && valueField == fieldData[dat][returnKey] ? true : getUpdatedData(formKeyVal) == fieldData[dat][returnKey] ? true : false}
                                                          >
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
                                              <div key={index} className="col-6 col-md-6" style={{ display: "flex", alignItems: "center", marginBottom: "25px" }}>
                                                <Form.Check
                                                  // className={requiredField && !identityDataFields?.[formKeyVal] && (getUpdatedData(formKeyVal) == '' || getUpdatedData(formKeyVal) == null) ? "checkbox-field field_warning" : "checkbox-field"}
                                                  className={"checkbox-field"}
                                                  type={"checkbox"}
                                                  id={formKeyVal}
                                                  name={formKeyVal}
                                                  label={label}
                                                  defaultChecked={editableField === false ? valueField : getUpdatedData(formKeyVal)}
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
                          )}
                          <div className="flex justify-center">
                            <button
                              className={` px-8 py-3 rounded-lg text-white outline-none transition-all duration-300 ease-in-out bg-color-stepper-button-${theme} hover:bg-color-stepper-button-hover-${theme} `}
                              onClick={() => {
                                handleSubmit();
                              }}
                              disabled={!handleValidate() || selectedRolesMeta?.length === 0}
                            >
                              Save changes
                            </button>
                          </div>
                        </form>
                      )}
                      <br />
                      <br />
                    </>
                  )}
                </Card.Body>
              </div>
            ) : (
              <div>
                <div className="px-2 py-2">
                  <div className={`flex justify-between gap-2`}>
                    <FaExclamationCircle style={{ color: "orange" }} />

                    <span className={`text-color-text-${theme} `}>To Update Existing Corporate Underlying Parties, Please Click on the "view" icon. If none exist, you can add new ones by clicking on the "plus" icon. </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {deleteConfirmationModal && (
          <DeleteAccountModal
            clearFieldsAndForms={clearInputFieldsAndForms}
            openDeleteModal={deleteConfirmationModal}
            handleClose={handleCloseModal}
            selectedRow={selectedRow}
            handleAlert={handleAlert}
            getList={() => getCRPsByIdentityId(identity_id_from_props)}
          />
        )}
        {alertProps.show && (
          <CustomAlert handleCloseAlert={handleCloseAlert} message={alertProps.message} variant={alertProps.variant} show={alertProps.show} hideAuto={alertProps.hideAuto} onClose={() => setAlertProps({ ...alertProps, show: false })}>
            {alertProps.message}
          </CustomAlert>
        )}
      </div>
    </div>
  );
}
