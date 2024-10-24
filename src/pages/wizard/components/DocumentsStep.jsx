import { Button, Col, Container, Spinner, Card, ListGroup, Row, Modal } from "react-bootstrap";
import React, { useCallback, useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";

// import { AiFillEye } from 'react-icons/ai';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { faCheck, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import Tooltip from "../../../components/tooltip/Tooltip";
import { getIdentityDocument, getSingleDocument, getParticularsDetailByIdentityIdAPI, getRequiredDocumentCRP, getCRPsByIdentityIdAPI, deleteDocument } from "../../../api/network/CustomerApi";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { HiDownload } from "react-icons/hi";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import { FaCloudUploadAlt } from "react-icons/fa";

import { AiFillDelete } from "react-icons/ai";
import DocumentModal from "../../../components/modal/DocumentModal";
import LoadingSpinner from "../../../components/ui/loader";
import SpinnerWithBackDrop from "../../../components/ui/loader";
import CustomAlert from "../../../widgets/components/Alerts";
// import  Avatar  from "../../../components/Avatar";
import "@nosferatu500/react-sortable-tree/style.css"; //install 
import SortableTree from "@nosferatu500/react-sortable-tree"; //2
import EntityIcon from "../../../icons/entity-icon-small.svg";
import formatDateRegionWise  from "../../../helpers/formatDateRegionWise";
// var theme = localStorage.getItem("portal_theme");
let crpIdValueSelected = "";
export default function Documents(props) {
  const [alertSucessDocumentAdd, setAlertSucessDocumentAdd] = useState(false);
  const [alertFailedDocumentAdd, setAlertFailedDocumentAdd] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [modalShow, setModalShow] = useState(false);
  const [isItemSelected, setIsItemSelected] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(false);
  const [isDocumentDeleted, setIsDocumentDeleted] = useState(false);
  const [requiredDocumentSelected, setRequiredDocumentSelected] = useState(null);
  const [documentUploadedSelected, setDocumentUploadedSelected] = useState([]);
  const [identityUploadDocList, setIdentityUploadDocList] = useState([]);
  const [requiredDocList, setRequiredDocList] = useState([]);
  const [isrequiredDocListExist, setIsRequiredDocListExist] = useState(true);
  const [isEntityValueExist, setIsEntityValueExist] = useState(true);
  const [entityValue, setEntityValue] = useState("");
  const [isLoaderCorporate, setIsLoaderCorporate] = useState("");

  const [isItemSelectedIdentity, setIsItemSelectedIdentity] = useState(null);
  const [identityDocumentSelected, setIdentityDocumentSelected] = useState(null);
  const [identityDocumentUploadedSelected, setIdentityDocumentUploadedSelected] = useState([]);
  const [identityselectedIndex, setIdentityselectedIndex] = useState(false);

  const [isLoader, setIsLoader] = useState(false);
  const [isLoaderCrp, setIsLoaderCrp] = useState(false);
  const [randomKey, setRandomKey] = useState(2423423);
  const [documentViewUrl, setDocumentViewUrl] = useState(null);
  const [viewModalShow, setViewModalShow] = useState(false);
  //   const [isLoader, setIsLoader] = useState(false);
  const cancelTokenSource = axios.CancelToken.source();
  const [alertProps, setAlertProps] = useState({
    variant: "",
    message: "",
    show: false,
    hideAuto: false,
  });

  const handleAlert = ({ variant, message, hideAuto }) => {
    setAlertProps({ variant, message, show: true, hideAuto });
  };
  const handleIsItemSelected = () => {
    setIsItemSelected(false);
  };

  const location = useLocation();

  //   const { data } = route.params;

  let identity_id_from_props = props?.dataOfAccountSetup?.identity_id;
  let account_id_from_props = props?.dataOfAccountSetup?.account_id;
  let crp_id_from_props = props?.crp_id;
  let customerType_from_props = props?.dataOfAccountSetup?.isIndividual ? "individual" : "corporate";
  const [identity_id, setIdentityId] = useState(identity_id_from_props);
  const [CRPIdForUpload, setCRPIdForUpload] = useState(null);

  const [account_id, setAccountId] = useState(account_id_from_props);
  const [crp_id, setCrpId] = useState(crp_id_from_props);
  const [type, setCustomerType] = useState(customerType_from_props);
  const [crpListData, setCrpListData] = useState([]);
  const [treeData, setTreeData] = useState([]);

  crpIdValueSelected = identity_id;
  useEffect(() => {
    if (type == "corporate") {
      getSpecificIdentityParticulars();
    }
  }, [type]);
  useEffect(() => {
    if (props?.crpId) {
      setCrpId(props?.crpId);
      crpIdValueSelected = props?.crpId;
      handleClickCRPProps(props?.crpType == "CORPORATE" ? "corporate" : "individual", props?.crpId, 1);
    }
  }, [props?.crpId]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDocumentDeleted(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isDocumentDeleted]);
  useEffect(() => {
    handleGetIdentityDocumentApi();
    handleGetRequiredDocumentApi();
  }, [identity_id]);
  useEffect(() => {
    // if (props?.isCrp) {
    getCRPsByIdentityId();
    // }
  }, []);

  const getCRPsByIdentityId = async () => {
    setIsLoaderCrp(true);
    const response = await getCRPsByIdentityIdAPI(identity_id, cancelTokenSource.token);
    if (response.success == true) {
      setIsLoaderCrp(false);
      setCrpListData(response?.data[0]);
      setTreeData([transformToTreeData(response?.data[0])]);
      // console.log(transformToTreeData(response?.data[0]), 'transformToTreeData(response?.data[0]')
    } else {
    }
  };
  const transformToTreeData = (node) => {
    const { id, label, children, type, roles } = node;
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
    return treeDataNode;
  };
  const handleDeleteDocument = async (documentId, documentTypeId) => {
    const identityUploadDoc = identityUploadDocList[documentTypeId];

    setIsLoader(true);
    const response = await deleteDocument(documentId, cancelTokenSource.token);
    if (response.success == true) {
      // hide.style("display", "none")
      const reRenderDocs = documentUploadedSelected.filter(
        (item) => item.id !== documentId,
      );
      console.log(reRenderDocs, '');
      const resultIdentityUploadDoc = identityUploadDoc.filter(
        (item) => item.id !== documentId,
      );
      setDocumentUploadedSelected(reRenderDocs);
      props.handleRefreshAccountDetail();
      setIsDocumentDeleted(true);
      // Set the updated identityUploadDocList with resultedidentityuploadDocuments
      setIdentityUploadDocList({
        ...identityUploadDocList,
        [documentTypeId]: resultIdentityUploadDoc,
      });

      setIsLoader(false);
    } else {
      setIsLoader(false);
    }
  };
  function flattenChildren(data) {
    const result = [];

    function flatten(node) {
      result.push({
        id: node.id,
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

      if (node.children && node.children?.length > 0) {
        node.children.forEach((child) => flatten(child));
      }
    }

    flatten(data);
    return result;
  }
  const getSpecificIdentityParticulars = async () => {
    setIsLoaderCorporate(true);
    const response = await getParticularsDetailByIdentityIdAPI(
      identity_id,
      cancelTokenSource.token,
    );
    if (response.success == true) {
      setIsLoaderCorporate(false);
      // setIsEntityValueExist(response.data?.meta?.data['corporate.basic.entity_type_id']?.value ? true : false)
      setEntityValue(response.data?.entityTypeId);
    } else {
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setAlertSucessDocumentAdd(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [alertSucessDocumentAdd]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setAlertFailedDocumentAdd(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [alertFailedDocumentAdd]);

  useEffect(() => {
    let requiredDocumentData = [];
    if (requiredDocList) {
      if (requiredDocList?.length > 0) {
        for (let required of requiredDocList) {
          if (required?.category_key == 'DOCUMENT' && required.isRequired) {
            requiredDocumentData.push(Number(required.id));
          }
        }
      }
      const uploadedDocument = Object.keys(identityUploadDocList)
      .filter(key => identityUploadDocList[key].length > 0) // Filter out keys with empty arrays
      .map(key => key.replace(/(\b\w)/g, match => match.toUpperCase())); 
      const uploadedDocumentInt = uploadedDocument.map((str) =>
        parseInt(str, 10),
      );
      if (Object.keys(identityUploadDocList)?.length == 0) {
        if (requiredDocumentData?.length > 0) {
          props.handleNextButtonClickDocumentStep(false);
        } else {
          props.handleNextButtonClickDocumentStep(true);
        }
      } else {
        props.handleNextButtonClickDocumentStep(
          requiredDocumentData.every((value) =>
            uploadedDocumentInt.includes(parseInt(value)),
          ),
        );
      }
      //  console.log(Object.keys(identityUploadDocList).every(value => requiredDocumentData.includes(value.toString()))),'kabsjd ajs dajs djas djas djas ';
    }
  }, [identityUploadDocList, requiredDocList]);

  const handleCloseAlert = () => {
    setAlertProps({ ...alertProps, show: false });
  };

  useEffect(() => {
    // console.log("identityUploadDocList requiredDocList", requiredDocList);
    // const keysOfIdentityDocument = Object.keys(identityUploadDocList);
    // console.log("identityUploadDocList keys", keysOfIdentityDocument);
    // uploadedDocuments?.map((singleDocument) => {
    //     const fundDoc = documents?.find((i) => {
    //       return i.id == singleDocument.document_type_id;
    //     });
    let accountDocuments;
    let subFundDoc;
    // if (requiredDocList.length > 0) {
    //   identityUploadDocList?.map((singleDocument) => {
    //     accountDocuments = requiredDocList?.find((item) => {
    //       return item?.id == singleDocument?.documentTypeId;
    //     });
    //     subFundDoc = requiredDocList?.find((item) => {
    //       return item.id == singleDocument.subDocumentTypeId;
    //     });

    //     if (!subFundDoc) {
    //       requiredDocList?.find((item) => {
    //         console.log(item, "iiiii");
    //         console.log(item?.children, "item?.children");
    //         if (item?.children) {
    //           if (item?.children.length > 0) {
    //             item?.children.find((child) => {
    //               console.log(child, "cccccc");
    //               if (child.id == singleDocument.sub_document_type_id) {
    //                 subFundDoc = child;
    //                 console.log(child.id == singleDocument.subDocumentTypeId, "child.id == singleDocument.sub_document_type_id");
    //                 return child.id == singleDocument.subDocumentTypeId;
    //               }
    //             });
    //           }
    //         }
    //       });
    //     }
    //   });

    //   console.log("accountDocuments", accountDocuments);
    //   console.log("accountDocuments subFundDoc", subFundDoc);
    // }
  }, [documentUploadedSelected, requiredDocumentSelected]);

  const handleGetIdentityDocumentApi = async () => {
    setIsLoader(true);

    const response = await getIdentityDocument(
      identity_id,
      cancelTokenSource.token,
    );
    if (response.success == true) {
      setIsLoader(false);
      setIdentityUploadDocList(response?.data?.IdentityDocuments);
      props.handleRefreshAccountDetail();
    } else {
      setIsLoader(false);
    }
  };
  const handleGetRequiredDocumentApi = async () => {
    setIsLoader(true);
    if (account_id) {
      const response = await getRequiredDocumentCRP(
        account_id,
        identity_id,
        cancelTokenSource.token,
      );
      if (response.success == true) {
        setIsLoader(false);
        setRequiredDocList(response?.data?.required_documents_types);

      } else {
        setIsLoader(false);
      }
    } else {
      setIsLoader(false);
      setRequiredDocList([]);
      setIsRequiredDocListExist(false);
    }
  };

  const getUploadedIdentityDocData = (id) => {
    const keysOfIdentityDocumentData = identityUploadDocList[id];
    if (keysOfIdentityDocumentData) {
      return keysOfIdentityDocumentData[0];
    }
  };
  const handleWarningMessage = (item) => {
    const keysOfIdentityDocumentData = identityUploadDocList[item?.id];
    if (keysOfIdentityDocumentData) {
      return false;
    } else {
      if (item?.isRequired) {
        return true;
      }

      return false;
    }
  };
  const getUploadedDocumentChildName = (doc) => {
    const dataforChildName = identityUploadDocList[doc?.id];

    if (dataforChildName) {
      if (dataforChildName?.length > 0) {
        const childSubDocId = dataforChildName.map(
          (ids) => ids.subDocumentTypeId,
        );
        const uniqueChildSubDocId = [...new Set(childSubDocId)];

        let children = uniqueChildSubDocId
          .map((id) => {
            let documentMeta = identityUploadDocList[doc?.id];
            const filteredObjects = documentMeta.filter(
              (obj) => obj.subDocumentTypeId === id,
            );
            const origins = filteredObjects.map((obj) => obj.meta.origin);
            let item = doc.children.find((c) => c.id === id);
            if (item) {
              item['origin'] = origins;
              return item;
            }
            return null;
          })
          .filter((c) => c);

        if (children?.length > 0) {
          return children;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  const handleSingleDocumentClick = (document, index) => {
    if (typeof document === 'object') {
      setIsItemSelected(true);
      let selectedFromUploadDocument = identityUploadDocList[document?.id];
      if (selectedFromUploadDocument !== undefined) {
        setDocumentUploadedSelected(selectedFromUploadDocument);
      } else {
        setDocumentUploadedSelected([]);
      }

      setRequiredDocumentSelected(document);
    } else {
      setIsItemSelected(true);
      let selectedFromUploadDocument = identityUploadDocList[document];
      if (selectedFromUploadDocument !== undefined) {
        setDocumentUploadedSelected(selectedFromUploadDocument);
      } else {
        setDocumentUploadedSelected([]);
      }
      setRequiredDocumentSelected(selectedFromUploadDocument[0]);
    }
    setSelectedIndex(index);
    if (!getUploadedDocumentChildName(document)) {
      setModalShow(true);
    }
  };
  const handleSingleIdentityDocumentClick = (document, index) => {
    if (typeof document === 'object') {
      setIsItemSelectedIdentity(true);
      let selectedFromUploadDocument = identityUploadDocList[document?.id];
      if (selectedFromUploadDocument !== undefined) {
        setIdentityDocumentUploadedSelected(selectedFromUploadDocument);
      } else {
        setIdentityDocumentUploadedSelected([]);
      }

      setRequiredDocumentSelected(document);
    } else {
      setIsItemSelectedIdentity(true);
      let selectedFromUploadDocument = identityUploadDocList[document];
      if (selectedFromUploadDocument !== undefined) {
        setIdentityDocumentUploadedSelected(selectedFromUploadDocument);
      } else {
        setIdentityDocumentUploadedSelected([]);
      }
      setIdentityDocumentSelected(selectedFromUploadDocument[0]);
    }
    setIdentityselectedIndex(index);
  };

  const handleClickSingleDocument = async (documentId) => {
    setIsLoader(true);

    const response = await getSingleDocument(
      documentId,
      cancelTokenSource.token,
    );
    if (response.success == true) {
      setIsLoader(false);
      let url = response.data.IdentityDocumentSignedUrl;
      window.open(url, '_blank');
    } else {
      setIsLoader(false);
    }
  };
  const handleViewSingleDocument = async (documentId) => {
    setDocumentViewUrl(null);
    setViewModalShow(false);
    setIsLoader(true);

    const response = await getSingleDocument(
      documentId,
      cancelTokenSource.token,
    );
    if (response.success == true) {
      setIsLoader(false);
      let url = response.data.IdentityDocumentSignedUrl;
      setDocumentViewUrl(url);
      setViewModalShow(true);

      // var xhr = new XMLHttpRequest();
      // xhr.responseType = 'arraybuffer';
      // xhr.open('GET', url);

      // xhr.onload = function (e) {
      //     var arrayBuffer = this.response;
      //     Tiff.initialize({
      //         TOTAL_MEMORY: 16777216 * 10
      //     });
      //     var tiff = new Tiff({
      //         buffer: arrayBuffer
      //     });
      //     var dataUri = tiff.toDataURL();
      //     document.getElementById('document_url').src = dataUri
      // }
    } else {
      setIsLoader(false);
    }
  };

  const getUploadedDocumentIfChildrenNotFound = useCallback(
    (id) => {
      const keysOfIdentityDocumentData = identityUploadDocList[id];
      if (keysOfIdentityDocumentData) {
        return keysOfIdentityDocumentData[0];
      }
    },
    [identityUploadDocList],
  );

  const checkAttachedToFund = (documentTypeId) => {
    let status = false;
    if (requiredDocList?.length > 0) {
      for (let a of requiredDocList) {
        if (a?.id == documentTypeId) {
          status = true;
        }
      }
    }
    return status;
  };
  const renderRequiredDocuments = (entityValueData) => (
    <div
      className="row"
      style={{ alignItems: 'space-between', marginTop: '20px' }}
    >
      <div
        className="col-sm-5 col-md-5 col-lg-5"
        style={{ maxHeight: '28em', minHeight: '28em', overflow: 'scroll' }}
      >
        {requiredDocList
          .filter((document) => {
            return (
              document?.category_key == 'DOCUMENT' &&
              document?.key != 'FACE_VERIFICATION'
            );
          })
          .sort((a, b) => {
            if (a.key === 'OTHER' && b.key !== 'OTHER') {
              return 1; // "OTHER" comes after other keys
            }
            if (a.key !== 'OTHER' && b.key === 'OTHER') {
              return -1; // "OTHERS" comes before other keys
            }
            return 0; // Preserve the original order if both keys are "OTHERS" or neither is "OTHERS"
          })
          .map((item) => {
            return (
                <>
              <div
                className={
                  requiredDocumentSelected?.id == item.id && isItemSelected
                    ? 'card'
                    : handleWarningMessage(item)
                    ? 'card field_warnings '
                    : getUploadedDocumentChildName(item) ||
                      getUploadedDocumentIfChildrenNotFound(item.id)
                    ? 'card field_successs'
                    : 'card'
                }
              >
                <div
                  onClick={() => handleSingleDocumentClick(item)}
                  role="button"
                  className={
                    requiredDocumentSelected?.id == item.id && isItemSelected
                      ? 'activeClassForDocument'
                      : null
                  }
                >
                  <div className="card-body">
                    <div
                      className="row"
                      style={{
                        flexDirection: 'column',
                        alignItems: 'start',
                        padding: '10px 0px',
                        justifyContent: 'start',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '5px',
                          alignItems: 'center',
                        }}
                      >
                        <h4 className="font-weight-base mb-0">{item?.name?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}</h4>
                        <BsFillArrowRightCircleFill
                          color={
                            getUploadedDocumentChildName(item) ||
                            getUploadedDocumentIfChildrenNotFound(item.id)
                              ? '#30D158'
                              : 'red'
                          }
                          fontSize={'20px'}
                        />
                      </div>
                      {getUploadedDocumentChildName(item) !== null &&
                        getUploadedDocumentChildName(item).map((child) => {
                          return (
                            <>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'start',
                                marginTop: '3px',
                              }}
                            >
                              <h6
                                className="font-weight-base"
                                style={{ marginBottom: '1px' }}
                              >
                                {child.name}{' '}
                                <span style={{ marginLeft: '5px' }}>
                                  {child?.origin[0]?.value == 'kyc' &&
                                  props?.dataOfAccountSetup
                                    ?.selectedIdentityData?.meta?.identity
                                    ?.provider == 'SIGNDESK' ? (
                                   <Tooltip>
                                    Source: CKYC
                                      <FontAwesomeIcon
                                        icon={faCheck}
                                        color="green"
                                      />
                                    </Tooltip>
                                  ) : (
                                    <Tooltip>
                                    Source: Manual Upload
                                      <FontAwesomeIcon
                                        icon={faCircleExclamation}
                                        color="orange"
                                      />
                                    </Tooltip>
                                  )}
                                </span>
                              </h6>
                            </div>
                            </>
                          );
                        })}
                      {getUploadedIdentityDocData(item?.id) == null ||
                      getUploadedIdentityDocData(item?.id) ==
                        undefined ? null : (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div
                            className=""
                            style={{
                              display: 'flex',
                              justifyContent: 'start',
                              alignItems: 'start',
                            }}
                          >
                            <small
                              className="text-muted mr-1"
                              style={{ marginRight: '0.5em' }}
                            >
                              Issue Date:{' '}
                            </small>

                            <small className="text-muted">
                              {getUploadedIdentityDocData(item?.id)
                                ?.issuedDate != null
                                ? getUploadedIdentityDocData(item?.id)
                                    ?.issuedDate
                                  ? formatDateRegionWise(
                                      getUploadedIdentityDocData(item?.id)
                                        ?.issuedDate,
                                    )
                                  : ''
                                : 'N/A'}
                            </small>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'start',
                              alignItems: 'start',
                            }}
                          >
                            <small
                              className="text-muted mr-1"
                              style={{ marginRight: '0.5em' }}
                            >
                              Expiry Date:{' '}
                            </small>
                            <small className="text-muted">
                              {getUploadedIdentityDocData(item?.id)
                                ?.expiryDate != null
                                ? getUploadedIdentityDocData(item?.id)
                                    ?.expiryDate
                                  ? formatDateRegionWise(
                                      getUploadedIdentityDocData(item?.id)
                                        ?.expiryDate,
                                    )
                                  : ''
                                : 'N/A'}
                            </small>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              </>
            );

            // } else {

            //   return (
            //     <div className="card">
            //       <div onClick={() => handleSingleDocumentClick(item)} role="button" className={requiredDocumentSelected?.id == item.id && isItemSelected ? "activeClassForDocument" : null}>
            //         <div className="card-body">
            //           <div className="row" style={{ flexDirection: "column", alignItems: "start", padding: "10px 0px", justifyContent: "start" }}>
            //             <div style={{ display: "flex", justifyContent: "start", marginBottom: "5px" }}>
            //               <h4 className="font-weight-base">{item?.name}</h4>
            //             </div>
            //             {getUploadedDocumentChildName(item) !== null &&
            //               getUploadedDocumentChildName(item).map((child) => {
            //                 return (
            //                   <div style={{ display: "flex", justifyContent: "start", marginTop: "3px" }}>
            //                     <h6 className="font-weight-base" style={{ marginBottom: "1px" }}>
            //                       {child.name}
            //                     </h6>
            //                   </div>
            //                 );
            //               })}
            //             {getUploadedIdentityDocData(item?.id) == null || getUploadedIdentityDocData(item?.id) == undefined ? null : (
            //               <>
            //                 <div className="mb-1 mt-3" style={{ display: "flex", justifyContent: "start", alignItems: "start" }}>
            //                   <small className="text-muted mr-1" style={{ marginRight: "0.5em" }}>
            //                     Issue Date:{" "}
            //                   </small>

            //                   <small className="text-muted">{getUploadedIdentityDocData(item?.id)?.issuedDate != null ? getUploadedIdentityDocData(item?.id)?.issuedDate ? format(new Date(getUploadedIdentityDocData(item?.id)?.issuedDate), "dd/MM/yyyy") : '' : "N/A"}</small>
            //                 </div>
            //                 <div style={{ display: "flex", justifyContent: "start", alignItems: "start" }}>
            //                   <small className="text-muted mr-1" style={{ marginRight: "0.5em" }}>
            //                     Expiry Date:{" "}
            //                   </small>
            //                   <small className="text-muted">{getUploadedIdentityDocData(item?.id)?.expiryDate != null ? getUploadedIdentityDocData(item?.id)?.expiryDate ? format(new Date(getUploadedIdentityDocData(item?.id)?.expiryDate), "dd/MM/yyyy") : '' : "N/A"}</small>
            //                 </div>
            //               </>
            //             )}
            //           </div>
            //         </div>
            //       </div>
            //     </div>
            //   );
            // }
          })}
      </div>
      <div className="col-sm-1 col-md-1 col-lg-1"></div>
      {isItemSelected ? (
        <div className="col-sm-6 col-md-6 col-lg-6">
          {/* <div style={{ border: '2px solid #037bff', borderRadius: '15px' }}>
                        <div style={{ flexDirection: "row", alignItems: "center", marginTop: "1px", justifyContent: "center" }} onClick={() => setModalShow(true)}>
                            <FaCloudUploadAlt color="#63c6d2" />
                            <h5>Max file size: 5MB</h5>
                            <h5>Supported files type: <strong>PNG,JPG,PDF,DOCS</strong></h5>
                        </div>
                    </div> */}
          <div
            className="row mb-4"
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: '1px',
              justifyContent: 'center',
            }}
          >
            <div
              className="col-sm-10 col-md-10 col-lg-10"
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: '1px',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginTop: '1px',
                  justifyContent: 'center',
                  border: '3px solid #043f63',
                  borderRadius: '15px',
                  padding: '15px 0px',
                  cursor: 'pointer',
                }}
                onClick={() => setModalShow(true)}
              >
                <FaCloudUploadAlt color="#63c6d2" fontSize="50px" />
                <h5>
                  Max file size: <strong>5MB</strong>
                </h5>
                <h5>
                  Supported files type: <strong>PNG,JPG,PDF,DOCS</strong>
                </h5>
              </div>
            </div>
          </div>

          {!(documentUploadedSelected?.length > 0) ? (
            <div
              className="row"
              style={{ alignItems: 'center', marginTop: '20px' }}
            >
              <h4 style={{ textAlign: 'center' }}>
                There is no documents uploaded as yet.
              </h4>
            </div>
          ) : (
            <div
              className="row"
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '8px',
                justifyContent: 'space-between',
              }}
            >
              {documentUploadedSelected.map((item) => {
                return (
                  <>
                    {isLoader && (
                      <SpinnerWithBackDrop
                        animation="grow"
                        custom={true}
                        height="70vh"
                      />
                    )}
                    <div className="col-sm-10 col-md-10 col-lg-10">
                      <div className="card ">
                        <div className="card-body">
                          <small className="text-muted">
                            {item?.subDocumentType?.name}
                            <span style={{ marginLeft: '5px' }}>
                              {item?.meta?.origin?.value == 'kyc' &&
                              props?.dataOfAccountSetup?.selectedIdentityData
                                ?.meta?.identity?.provider == 'SIGNDESK' ? (
                                <Tooltip>Source: CKYC
                                  <FontAwesomeIcon
                                    icon={faCheck}
                                    color="green"
                                  />
                                </Tooltip>
                              ) : (
                               <Tooltip>
                                Source: Manual Upload
                                  <FontAwesomeIcon
                                    icon={faCircleExclamation}
                                    color="orange"
                                  />
                                </Tooltip>
                              )}
                            </span>
                          </small>
                          <div
                            className="row"
                            style={{
                              alignItems: 'center',
                              marginTop: '1px',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div
                              className="col-sm-9 col-md-9 col-lg-9 "
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'start',
                              }}
                            >
                              <div>
                                <small
                                  className="text-muted"
                                  style={{ marginRight: '0.5em' }}
                                >
                                  Issue Date:
                                </small>
                                <small className="text-muted">
                                  {item?.issuedDate != null
                                    ? item?.issuedDate
                                      ? formatDateRegionWise(item?.issuedDate)
                                      : ''
                                    : 'N/A'}
                                </small>
                              </div>
                              <div
                                className="col-sm-9 col-md-9 col-lg-9"
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                  alignItems: 'start',
                                }}
                              >
                                <small
                                  className="text-muted"
                                  style={{ marginRight: '0.5em' }}
                                >
                                  Expiry Date:
                                </small>
                                <small className="text-muted">
                                  {item?.expiryDate != null
                                    ? item?.expiryDate
                                      ? formatDateRegionWise(item?.expiryDate)
                                      : ''
                                    : 'N/A'}
                                </small>
                              </div>
                            </div>

                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'right',
                              }}
                              className="col-sm-3 col-md-3 col-lg-3"
                            >
                              <button
                                onClick={() =>
                                  handleClickSingleDocument(item?.id)
                                }
                                style={{ padding: '10px', marginRight: '10px' }}
                              >
                                <HiDownload />
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() =>
                                  handleDeleteDocument(
                                    item?.id,
                                    item?.documentTypeId,
                                  )
                                }
                                style={{ padding: '10px' }}
                              >
                                <AiFillDelete />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="col-sm-6 col-md-6 col-lg-6">
          <div className="card-body">
            <div
              className="row"
              style={{ alignItems: 'center', marginTop: '20px' }}
            >
              <h4 style={{ textAlign: 'center' }}>
                Please Select The Document To Proceed With The Upload.
              </h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  const renderIdentityDocuments = () => (
    <div
      className="row"
      style={{ alignItems: 'space-between', marginTop: '20px' }}
    >
      <div
        className="col-sm-5 col-md-5 col-lg-5"
        style={{ maxHeight: '28em', minHeight: '28em', overflow: 'scroll' }}
      >
        {identityUploadDocList &&
          Object.keys(identityUploadDocList).map((item) => {
            let data = identityUploadDocList[item][0];
            return (
                <>
              <div
                className={
                  identityDocumentSelected?.id == data?.id &&
                  isItemSelectedIdentity
                    ? 'card  '
                    : 'card'
                }
              >
                <div
                  onClick={() => handleSingleIdentityDocumentClick(item)}
                  role="button"
                  className={
                    identityDocumentSelected?.id == data?.id &&
                    isItemSelectedIdentity
                      ? 'activeClassForDocument'
                      : null
                  }
                >
                  <div className="card-body">
                    <div
                      className="row"
                      style={{
                        flexDirection: 'column',
                        alignItems: 'start',
                        padding: '10px 0px',
                        justifyContent: 'start',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '5px',
                          alignItems: 'center',
                        }}
                      >
                        <h4 className="font-weight-base mb-0">
                          {data?.documentName}
                        </h4>
                        <BsFillArrowRightCircleFill
                          color="#037bff"
                          fontSize={'20px'}
                        />
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'start',
                          marginTop: '3px',
                        }}
                      >
                        <h6
                          className="font-weight-base"
                          style={{ marginBottom: '1px' }}
                        >
                          {data?.subDocumentType?.name}
                        </h6>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div
                          className=""
                          style={{
                            display: 'flex',
                            justifyContent: 'start',
                            alignItems: 'start',
                          }}
                        >
                          <small
                            className="text-muted mr-1"
                            style={{ marginRight: '0.5em' }}
                          >
                            Issue Date:{' '}
                          </small>

                          <small className="text-muted">
                            {data?.issuedDate
                              ? formatDateRegionWise(data?.issuedDate)
                              : 'N/A'}
                            {/* {getUploadedIdentityDocData(item?.id)?.issuedDate != null ? (getUploadedIdentityDocData(item?.id)?.issuedDate ? format(new Date(getUploadedIdentityDocData(item?.id)?.issuedDate), "dd/MM/yyyy") : "") : "N/A"} */}
                          </small>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'start',
                            alignItems: 'start',
                          }}
                        >
                          <small
                            className="text-muted mr-1"
                            style={{ marginRight: '0.5em' }}
                          >
                            Expiry Date:{' '}
                          </small>
                          <small className="text-muted">
                            {data?.expiryDate
                              ? formatDateRegionWise(data?.expiryDate)
                              : 'N/A'}
                            {/* {getUploadedIdentityDocData(item?.id)?.expiryDate != null ? (getUploadedIdentityDocData(item?.id)?.expiryDate ? format(new Date(getUploadedIdentityDocData(item?.id)?.expiryDate), "dd/MM/yyyy") : "") : "N/A"} */}
                          </small>
                        </div>
                      </div>
                      {checkAttachedToFund(data?.documentTypeId) ? (
                        <small style={{ color: 'green' }}>
                          Attached to this domain
                        </small>
                      ) : (
                        <small style={{ color: 'orange' }}>
                          Not required for this domain
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              </>
            );
          })}
      </div>
      <div className="col-sm-1 col-md-1 col-lg-1"></div>
      {isItemSelectedIdentity ? (
        <div className="col-sm-6 col-md-6 col-lg-6">
          {!(identityDocumentUploadedSelected?.length > 0) ? (
            <div
              className="row"
              style={{ alignItems: 'center', marginTop: '20px' }}
            >
              <h4 style={{ textAlign: 'center' }}>
                There is no documents uploaded as yet.
              </h4>
            </div>
          ) : (
            <div
              className="row"
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '8px',
                justifyContent: 'space-between',
              }}
            >
              {identityDocumentUploadedSelected?.map((item) => {
                return (
                  <>
                    {isLoader && (
                      <SpinnerWithBackDrop
                        animation="grow"
                        custom={true}
                        height="70vh"
                      />
                    )}
                    <div className="col-sm-10 col-md-10 col-lg-10">
                      <div className="card ">
                        <div className="card-body">
                          <small className="text-muted">
                            {item?.subDocumentType?.name}
                          </small>
                          <div
                            className="row"
                            style={{
                              alignItems: 'center',
                              marginTop: '1px',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div
                              className="col-sm-9 col-md-9 col-lg-9 "
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'start',
                              }}
                            >
                              <div>
                                <small
                                  className="text-muted"
                                  style={{ marginRight: '0.5em' }}
                                >
                                  Issue Date:
                                </small>
                                <small className="text-muted">
                                  {item?.issuedDate != null
                                    ? item?.issuedDate
                                      ? formatDateRegionWise(item?.issuedDate)
                                      : ''
                                    : 'N/A'}
                                </small>
                              </div>
                              <div
                                className="col-sm-9 col-md-9 col-lg-9"
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                  alignItems: 'start',
                                }}
                              >
                                <small
                                  className="text-muted"
                                  style={{ marginRight: '0.5em' }}
                                >
                                  Expiry Date:
                                </small>
                                <small className="text-muted">
                                  {item?.expiryDate != null
                                    ? item?.expiryDate
                                      ? formatDateRegionWise(item?.expiryDate)
                                      : ''
                                    : 'N/A'}
                                </small>
                              </div>
                            </div>

                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'right',
                              }}
                              className="col-sm-3 col-md-3 col-lg-3"
                            >
                              <button
                                onClick={() =>
                                  handleClickSingleDocument(item?.id)
                                }
                                style={{ padding: '10px', marginRight: '10px' }}
                              >
                                <HiDownload />
                              </button>
                              {/* {item?.meta?.origin?.value == 'kyc' && (
                                                                <Button className="btn btn-danger" onClick={() => handleViewSingleDocument(item?.id)} style={{ padding: '10px' }}>
                                                                    <HiEye />
                                                                </Button>
                                                            )} */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="col-sm-6 col-md-6 col-lg-6">
          <div className="card-body">
            <div
              className="row"
              style={{ alignItems: 'center', marginTop: '20px' }}
            >
              <h4 style={{ textAlign: 'center' }}>
                Please Select The Document To Proceed With The Upload.
              </h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  const renderUploadedDocuments = () => (
    <div
      className="row"
      style={{ alignItems: 'space-between', marginTop: '20px' }}
    >
      <div
        className="col-sm-5 col-md-5 col-lg-5"
        style={{ maxHeight: '28em', minHeight: '28em', overflow: 'scroll' }}
      >
        {Object.keys(identityUploadDocList).map((item, index) => {
          return (
            <>
            <div className="card">
              <div
                onClick={() => handleSingleDocumentClick(item, index)}
                role="button"
                className={
                  selectedIndex == index && isItemSelected
                    ? 'activeClassForDocument'
                    : null
                }
              >
                <div className="card-body">
                  <div
                    className="row"
                    style={{
                      flexDirection: 'column',
                      alignItems: 'start',
                      padding: '10px 0px',
                      justifyContent: 'start',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'start',
                        marginBottom: '5px',
                      }}
                    >
                      <h4 className="font-weight-base">
                        {identityUploadDocList[item][0].documentName}
                      </h4>
                    </div>
                    {getUploadedDocumentChildName(item) !== null &&
                      getUploadedDocumentChildName(item).map((child) => {
                        return (
                            <>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'start',
                              marginTop: '3px',
                            }}
                          >
                            <h6
                              className="font-weight-base"
                              style={{ marginBottom: '1px' }}
                            >
                              {child.name}
                            </h6>
                          </div>
                          </>
                        );
                      })}
                    {getUploadedIdentityDocData(item?.id) == null ||
                    getUploadedIdentityDocData(item?.id) == undefined ? null : (
                      <>
                        <div
                          className="mb-1 mt-3"
                          style={{
                            display: 'flex',
                            justifyContent: 'start',
                            alignItems: 'start',
                          }}
                        >
                          <small
                            className="text-muted mr-1"
                            style={{ marginRight: '0.5em' }}
                          >
                            Issue Date:{' '}
                          </small>

                          <small className="text-muted">
                            {getUploadedIdentityDocData(item?.id)?.issuedDate !=
                            null
                              ? formatDateRegionWise(
                                  getUploadedIdentityDocData(item?.id)
                                    ?.issuedDate,
                                )
                              : 'N/A'}
                          </small>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'start',
                            alignItems: 'start',
                          }}
                        >
                          <small
                            className="text-muted mr-1"
                            style={{ marginRight: '0.5em' }}
                          >
                            Expiry Date:{' '}
                          </small>
                          <small className="text-muted">
                            {getUploadedIdentityDocData(item?.id)?.expiryDate !=
                            null
                              ? getUploadedIdentityDocData(item?.id)?.expiryDate
                              : 'N/A'}
                          </small>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            </>
          );
        })}
      </div>

      {isItemSelected ? (
        <div className="col-sm-6 col-md-6 col-lg-6">
          {!(documentUploadedSelected?.length > 0) ? (
            <div
              className="row"
              style={{ alignItems: 'center', marginTop: '20px' }}
            >
              <h4 style={{ textAlign: 'center' }}>
                There is no documents uploaded as yet.
              </h4>
            </div>
          ) : (
            <div
              className="row"
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '8px',
                justifyContent: 'space-between',
              }}
            >
              {documentUploadedSelected.map((item) => {
                return (
                  <>
                    <div className="col-sm-10 col-md-10 col-lg-10">
                      {isLoader && (
                        <SpinnerWithBackDrop
                          animation="grow"
                          custom={true}
                          height="70vh"
                        />
                      )}
                      <div className="col-sm-10 col-md-10 col-lg-10">
                        <div className="card ">
                          <div className="card-body">
                            <small className="text-muted">
                              {item?.subDocumentType?.name}
                            </small>
                            <div
                              className="row"
                              style={{
                                alignItems: 'center',
                                marginTop: '1px',
                                justifyContent: 'space-between',
                              }}
                            >
                              <div
                                className="col-sm-9 col-md-9 col-lg-9 "
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'start',
                                }}
                              >
                                <div>
                                  <small
                                    className="text-muted"
                                    style={{ marginRight: '0.5em' }}
                                  >
                                    Issue Date:
                                  </small>
                                  <small className="text-muted">
                                    {item?.issuedDate
                                      ? formatDateRegionWise(item?.issuedDate)
                                      : ''}
                                  </small>
                                </div>
                                <div
                                  className="col-sm-9 col-md-9 col-lg-9"
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'start',
                                    alignItems: 'start',
                                  }}
                                >
                                  <small
                                    className="text-muted"
                                    style={{ marginRight: '0.5em' }}
                                  >
                                    Expiry Date:
                                  </small>
                                  <small className="text-muted">
                                    {item?.expiryDate
                                      ? formatDateRegionWise(item?.expiryDate)
                                      : ''}
                                  </small>
                                </div>
                              </div>

                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'right',
                                }}
                                className="col-sm-3 col-md-3 col-lg-3"
                              >
                                <button
                                  onClick={() =>
                                    handleClickSingleDocument(item?.id)
                                  }
                                >
                                  <HiDownload />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="col-sm-6 col-md-6 col-lg-6">
          <div className="card-body">
            <div
              className="row"
              style={{ alignItems: 'center', marginTop: '20px' }}
            >
              <h4 style={{ textAlign: 'center' }}>
                Please Select Document to Show Their History
              </h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderRequiredDocumentsnew = () => (
    <div
      className="row"
      style={{ alignItems: 'space-between', marginTop: '20px' }}
    >
      <div
        className="col-sm-5 col-md-5 col-lg-5"
        style={{ maxHeight: '28em', minHeight: '28em', overflow: 'scroll' }}
      >
        {requiredDocList
          .filter((document) => {
            return document?.category_key == 'DOCUMENT';
          })
          .map((item, index) => {

            return (
              <>
                {/* <Card>
                  <Card.Header>
                    <h4 className="card-header-title">Documents</h4>
                  </Card.Header>
                  <Card.Body>
                    <ListGroup className="list-group-flush my-n3">
                      <ListGroup.Item
                        key={index}
                        onClick={() => handleSingleDocumentClick(item)}
                        role="button"
                        className={
                          requiredDocumentSelected?.id == item.id &&
                          isItemSelected
                            ? 'activeClassForDocument'
                            : null
                        }
                      >
                        <Row className="row align-items-center">
                          <Col xs="auto">
                            <Avatar as="a" ratio="4by3">
                              <Avatar.Image className="rounded" alt="..." />
                            </Avatar>
                          </Col>
                          <Col className="ms-n2">
                            <h4 className="mb-1">
                              <a>{item?.name}</a>
                            </h4>
                            <Card.Text className="small text-muted">
                              <time dateTime="2018-05-24">Updated 4hr ago</time>
                            </Card.Text>
                          </Col>
                          <Col xs="auto">
                            <HiDownload />
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card> */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-3 bg-gray-100">
                        <h4 className="text-lg font-semibold">Documents</h4>
                    </div>
                    <div className="p-4">
                        <ul className="space-y-2">
                        {documents.map((item, index) => (
                            <li
                            key={index}
                            onClick={() => handleSingleDocumentClick(item)}
                            role="button"
                            className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-200 
                                ${requiredDocumentSelected?.id === item.id && isItemSelected ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                            >
                            <div className="flex items-center">
                                <div className="w-12 h-9 bg-gray-300 rounded-md overflow-hidden">
                                {/* Placeholder for Avatar Image */}
                                <img src={item.avatarUrl} alt="Avatar" className="object-cover w-full h-full" />
                                </div>
                                <div className="ml-3">
                                <h4 className="text-md font-semibold">{item?.name}</h4>
                                <p className="text-sm text-gray-500">
                                    <time dateTime="2018-05-24">Updated 4hr ago</time>
                                </p>
                                </div>
                            </div>
                            <div className="text-gray-500">
                                <HiDownload />
                            </div>
                            </li>
                        ))}
                        </ul>
                    </div>
                    </div>



                <div className="card">
                  {alertFailedDocumentAdd ? (
                    <CustomAlert
                      message={errorMessage}
                      variant="danger"
                      show={alertFailedDocumentAdd}
                      hideAuto={alertProps.hideAuto}
                      onClose={() =>
                        setAlertProps({ ...alertProps, show: false })
                      }
                      className="position-fixed bottom-0 start-50 translate-middle-x"
                      handleCloseAlert={handleCloseAlert}
                    >
                      {alertProps.message}
                    </CustomAlert>
                  ) : null}
                  {alertSucessDocumentAdd ? (
                    <CustomAlert
                      message="Document Added Successfully"
                      variant="success"
                      show={alertSucessDocumentAdd}
                      hideAuto={alertProps.hideAuto}
                      onClose={() =>
                        setAlertProps({ ...alertProps, show: false })
                      }
                      className="position-fixed bottom-0 start-50 translate-middle-x"
                      handleCloseAlert={handleCloseAlert}
                    >
                      {alertProps.message}
                    </CustomAlert>
                  ) : null}
                  <div
                    onClick={() => handleSingleDocumentClick(item)}
                    role="button"
                    className={
                      requiredDocumentSelected?.id == item.id && isItemSelected
                        ? 'activeClassForDocument'
                        : null
                    }
                  >
                    <div className="card-body">
                      <div
                        className="row"
                        style={{
                          flexDirection: 'column',
                          alignItems: 'start',
                          padding: '10px 0px',
                          justifyContent: 'start',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'start',
                            marginBottom: '5px',
                          }}
                        >
                          <h4 className="font-weight-base">{item?.name}</h4>
                        </div>
                        {getUploadedDocumentChildName(item) !== null &&
                          getUploadedDocumentChildName(item).map((child) => {
                            return (
                            <>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                  marginTop: '3px',
                                }}
                              >
                                <h6
                                  className="font-weight-base"
                                  style={{ marginBottom: '1px' }}
                                >
                                  {child.name}
                                </h6>
                              </div>
                              </>
                            );
                          })}
                        {getUploadedIdentityDocData(item?.id) == null ||
                        getUploadedIdentityDocData(item?.id) ==
                          undefined ? null : (
                          <>
                            <div
                              className="mb-1 mt-3"
                              style={{
                                display: 'flex',
                                justifyContent: 'start',
                                alignItems: 'start',
                              }}
                            >
                              <small
                                className="text-muted mr-1"
                                style={{ marginRight: '0.5em' }}
                              >
                                Issue Date:{' '}
                              </small>

                              <small className="text-muted">
                                {getUploadedIdentityDocData(item?.id)
                                  ?.issuedDate != null
                                  ? getUploadedIdentityDocData(item?.id)
                                      ?.issuedDate
                                    ? formatDateRegionWise(
                                        getUploadedIdentityDocData(item?.id)
                                          ?.issuedDate,
                                      )
                                    : ''
                                  : 'N/A'}
                              </small>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'start',
                                alignItems: 'start',
                              }}
                            >
                              <small
                                className="text-muted mr-1"
                                style={{ marginRight: '0.5em' }}
                              >
                                Expiry Date:{' '}
                              </small>
                              <small className="text-muted">
                                {getUploadedIdentityDocData(item?.id)
                                  ?.expiryDate != null
                                  ? getUploadedIdentityDocData(item?.id)
                                      ?.expiryDate
                                    ? formatDateRegionWise(
                                        getUploadedIdentityDocData(item?.id)
                                          ?.expiryDate,
                                      )
                                    : ''
                                  : 'N/A'}
                              </small>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
          })}
      </div>
      {isItemSelected ? (
        <div className="col-sm-6 col-md-6 col-lg-6">
          <div
            className="row mb-4"
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: '1px',
              justifyContent: 'center',
            }}
          >
            <div
              className="col-sm-10 col-md-10 col-lg-10"
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: '1px',
                justifyContent: 'center',
              }}
            >
              <button
                onClick={() => setModalShow(true)}
                size="lg"
                style={{ minWidth: '100%' }}
              >
                Add New Document
              </button>
            </div>
          </div>

          {!(documentUploadedSelected?.length > 0) ? (
            <div
              className="row"
              style={{ alignItems: 'center', marginTop: '20px' }}
            >
              <h4 style={{ textAlign: 'center' }}>
                There is no documents uploaded as yet.
              </h4>
            </div>
          ) : (
            <div
              className="row"
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '8px',
                justifyContent: 'space-between',
              }}
            >
              {documentUploadedSelected.map((item) => {
                return (
                  <>
                    {isLoader && (
                      <SpinnerWithBackDrop
                        animation="grow"
                        custom={true}
                        height="70vh"
                      />
                    )}
                    <div className="col-sm-10 col-md-10 col-lg-10">
                      <div className="card ">
                        <div className="card-body">
                          <small className="text-muted">
                            {item?.subDocumentType?.name}
                          </small>
                          <div
                            className="row"
                            style={{
                              alignItems: 'center',
                              marginTop: '1px',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div
                              className="col-sm-9 col-md-9 col-lg-9 "
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'start',
                              }}
                            >
                              <div>
                                <small
                                  className="text-muted"
                                  style={{ marginRight: '0.5em' }}
                                >
                                  Issue Date:
                                </small>
                                <small className="text-muted">
                                  {item?.issuedDate != null
                                    ? item?.issuedDate
                                      ? formatDateRegionWise(item?.issuedDate)
                                      : ''
                                    : 'N/A'}
                                </small>
                              </div>
                              <div
                                className="col-sm-9 col-md-9 col-lg-9"
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                  alignItems: 'start',
                                }}
                              >
                                <small
                                  className="text-muted"
                                  style={{ marginRight: '0.5em' }}
                                >
                                  Expiry Date:
                                </small>
                                <small className="text-muted">
                                  {item?.expiryDate != null
                                    ? item?.expiryDate
                                      ? formatDateRegionWise(item?.expiryDate)
                                      : ''
                                    : 'N/A'}
                                </small>
                              </div>
                            </div>

                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'right',
                              }}
                              className="col-sm-3 col-md-3 col-lg-3"
                            >
                              <button
                                onClick={() =>
                                  handleClickSingleDocument(item?.id)
                                }
                              >
                                <HiDownload />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="col-sm-6 col-md-6 col-lg-6">
          <div className="card-body">
            <div
              className="row"
              style={{ alignItems: 'center', marginTop: '20px' }}
            >
              <h4 style={{ textAlign: 'center' }}>
                Please Select The Document To Proceed With The Upload.
              </h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  const handleClickCRP = (type, selectedCrpId, parentId) => {
    setCustomerType(type);
    setCrpId(selectedCrpId);
    setIdentityId(selectedCrpId);
    crpIdValueSelected = selectedCrpId;
    setRandomKey(Math.floor(Math.random() * 99999) + 1);
    if (parentId == 0) {
      setCRPIdForUpload(null);
    } else {
      setCRPIdForUpload(selectedCrpId);
    }
  };
  const handleClickCRPProps = (type, selectedCrpId, parentId) => {
    setCustomerType(type);
    setCrpId(selectedCrpId);
    setIdentityId(selectedCrpId);
    crpIdValueSelected = selectedCrpId;
    setRandomKey(Math.floor(Math.random() * 99999) + 1);
    if (parentId == 0) {
      setCRPIdForUpload(null);
    } else {
      setCRPIdForUpload(selectedCrpId);
    }
  };
  const nodeContentRenderer = ({ node }) => {
    let borderStyle = "";
    if (node?.data.id == crpIdValueSelected) {
      borderStyle = "2px solid #1b636e";
    }
    return (
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", width: "100%", padding: node?.data?.parentId == "0" ? "30px 10px" : "20px 10px", border: `${borderStyle}` }}
        onClick={() => handleClickCRP(node?.data?.type == "CORPORATE" ? "corporate" : "individual", node?.data?.id, node?.data?.parentId)}
      >
        <div style={{ display: "flex", flexDirection: "row", maxWidth: "80%", wordWrap: "break-word", alignItems: "center" }}>
          <div>
            {node?.data?.type == "INDIVIDUAL" ? (
              <img src="/img/investor/default-avatar.png" alt="..." class="" style={{ height: "35px", marginRight: "8px" }} />
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
          <div style={{ display: "flex", flexDirection: "column", maxWidth: "80%", wordWrap: "break-word" }}>
            <span>{node.type}</span>
            <span style={{ overflow: "hidden" }}>{node.name}</span>
            {node?.data?.parentId != "0" && <span>OwnerShip: {node.ownerShip + "%"}</span>}
            {/* {node?.data?.parentId != "0" && (
                            <span>
                                <Dropdown align="end">
                                    <Dropdown.Toggle as="span" className="dropdown-ellipses" role="button">
                                        <Button className="lift"
                                            style={{ backgroundColor: 'transparent', borderColor: 'transparent', padding: '0px' }}
                                        >Roles: <FeatherIcon
                                                icon="info"
                                                size="1em"
                                                color="#2c7be5"
                                            /></Button>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {node?.rolesData && node?.rolesData.map((item, index) => (
                                            <Dropdown.Item href="javascript:void(0);" >{item}</Dropdown.Item>
                                        ))}

                                    </Dropdown.Menu>
                                </Dropdown>
                            </span>

                        )} */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {isLoaderCorporate && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "20rem" }}>
          <LoadingSpinner animation="grow" custom={true} height="70vh" />
        </div>
      )}
      {modalShow && (
        <DocumentModal
          accountData={props?.dataOfAccountSetup}
          handleIsItemSelected={handleIsItemSelected}
          setAlertSucessDocumentAdd={setAlertSucessDocumentAdd}
          setAlertFailedDocumentAdd={setAlertFailedDocumentAdd}
          setErrorMessage={setErrorMessage}
          list={handleGetIdentityDocumentApi}
          show={modalShow}
          onHide={() => setModalShow(false)}
          requiredDocumentSelected={requiredDocumentSelected}
          documentUploadedSelected={documentUploadedSelected}
          entityValueData={entityValue}
          CRPIdForUpload={CRPIdForUpload}
        />
      )}

      <div className="main-content">
        {/* <Container fluid>
          {alertFailedDocumentAdd ? (
            <CustomAlert
              message={errorMessage}
              variant="danger"
              show={alertFailedDocumentAdd}
              hideAuto={alertProps.hideAuto}
              onClose={() => setAlertProps({ ...alertProps, show: false })}
              className="position-fixed bottom-0 start-50 translate-middle-x"
              handleCloseAlert={handleCloseAlert}
            >
              {alertProps.message}
            </CustomAlert>
          ) : null}
          {alertSucessDocumentAdd ? (
            <CustomAlert
              message="Document Added Successfully"
              variant="success"
              show={alertSucessDocumentAdd}
              hideAuto={alertProps.hideAuto}
              onClose={() => setAlertProps({ ...alertProps, show: false })}
              className="position-fixed bottom-0 start-50 translate-middle-x"
              handleCloseAlert={handleCloseAlert}
            >
              {alertProps.message}
            </CustomAlert>
          ) : null}
          {isDocumentDeleted ? (
            <CustomAlert
              message="Document Deleted Successfully"
              variant="success"
              show={isDocumentDeleted}
              hideAuto={alertProps.hideAuto}
              onClose={() => setAlertProps({ ...alertProps, show: false })}
              className="position-fixed bottom-0 start-50 translate-middle-x"
              handleCloseAlert={handleCloseAlert}
            />
          ) : null}
          {!isEntityValueExist ? (
            <Row className="justify-content-center">
              <Col xs={12} lg={10} xl={10}>
                <div>
                  <h3>Select Entity Type from particulars screen to upload documents</h3>
                </div>
              </Col>
            </Row>
          ) : (
            <Row className="justify-content-center">
              {customerType_from_props == "corporate" && (
                <Col xs={12} lg={5} xl={5}>
                  <Card>
                    <Card.Header>
                      <h3 className="mb-0">Ultimate Beneficial Owner (UBO)</h3>
                    </Card.Header>
                    <Card.Body style={{ height: "70vh", overflow: "auto" }}>
                      {isLoaderCrp && (
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "20rem" }}>
                          <Spinner animation="grow" />
                        </div>
                      )}
                      <div style={{ height: "100vh" }}>{treeData?.length > 0 && <SortableTree key={randomKey} treeData={treeData} nodeContentRenderer={nodeContentRenderer} onChange={(treeDatas) => setTreeData(treeDatas)} />}</div>
                    </Card.Body>
                  </Card>
                </Col>
              )} */}
              
              {/* <Col xs={customerType_from_props == "corporate" ? 12 : 12} lg={customerType_from_props == "corporate" ? 7 : 10} xl={customerType_from_props == "corporate" ? 7 : 10}>
                <Card>
                  {customerType_from_props == "corporate" && (
                    <Card.Header>
                      <div className="d-flex" style={{ justifyContent: "space-between", alignItems: "center", textTransform: "capitalize" }}>
                        <h3 className="mb-0" style={{ textTransform: "capitalize" }}>
                          {type}
                        </h3>
                        {type && (
                          <>
                            {type == "individual" ? (
                              <img src="/img/investor/default-avatar.png" alt="..." class="" style={{ height: "35px", marginRight: "8px" }} />
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
                          </>
                        )}
                      </div>
                    </Card.Header>
                  )} */}

                  {/* <Card.Body style={{ height: "70vh", overflow: "auto" }}>
                    {isLoader ? (
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "20rem" }}>
                        <LoadingSpinner animation="grow" custom={true} height="70vh" />
                      </div>
                    ) : !(identity_id == undefined) ? (
                      <>
                        <div style={{ display: "flex" }}>
                          {/* <h4>Certified true copy (CTC) is required for all the provided KYC documents and it should not be older than 3 months from the date of issue</h4> 
                          <Tooltip>Please ensure that documents uploaded are Certified True Copies (CTC). Please speak to your account representative if you are unsure of what to do.
                            <FontAwesomeIcon icon={faInfoCircle} />
                            {/* <h4>Eye</h4> */}
                            
                            {/* </Tooltip>
                        </div>
                        {isrequiredDocListExist ? (
                          requiredDocList?.length > 0 ? (
                            <>
                              {renderRequiredDocuments(entityValue)}

                              <hr />
                            </>
                          ) : null
                        ) : (
                          renderUploadedDocuments()
                        )}
                      </>
                    ) : ( */}
                      {/* <>
                        <div className="card ">
                          <div className="card-body">
                            <div className="row" style={{ alignItems: "center", marginTop: "20px" }}>
                              <h4 style={{ textAlign: "center" }}>Please Attach Fund To Identity To Add Documents</h4>
                            </div>
                          </div>
                        </div>
                        <hr />
                      </>
                    )} */}
                    {/* {identityUploadDocList && Object.keys(identityUploadDocList)?.length > 0 && props?.dataOfAccountSetup?.fund_data?.fund_setting?.region.toLowerCase().includes("india") && (
                      <div>
                        <Accordion alwaysOpen={false}>
                          <Accordion.Item eventKey="0">
                            <Accordion.Header>
                              <h4>Identity CKYC Documents</h4>
                            </Accordion.Header>
                            <Accordion.Body>{renderIdentityDocuments()}</Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Container> */}

        <div className="container mx-auto px-4">
      {alertFailedDocumentAdd && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-4 rounded-lg shadow-lg">
          {errorMessage}
          <button onClick={() => setAlertProps({ ...alertProps, show: false })} className="ml-4 text-white">
            Close
          </button>
        </div>
      )}
      {alertSucessDocumentAdd && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-4 rounded-lg shadow-lg">
          Document Added Successfully
          <button onClick={() => setAlertProps({ ...alertProps, show: false })} className="ml-4 text-white">
            Close
          </button>
        </div>
      )}
      {isDocumentDeleted && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-4 rounded-lg shadow-lg">
          Document Deleted Successfully
        </div>
      )}
      {!isEntityValueExist ? (
        <div className="flex justify-center my-4">
          <h3>Select Entity Type from particulars screen to upload documents</h3>
        </div>
      ) : (
        <div className="flex justify-center my-4">
          {customerType_from_props === "corporate" && (
            <div className="w-full lg:w-1/2 xl:w-1/2 p-2">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="bg-gray-100 p-4">
                  <h3 className="mb-0">Ultimate Beneficial Owner (UBO)</h3>
                </div>
                <div className="h-[70vh] overflow-auto p-4">
                  {isLoaderCrp && (
                    <div className="flex justify-center items-center h-80">
                      <div className="loader"></div>
                    </div>
                  )}
                  <div className="h-full">
                    {treeData?.length > 0 && (
                      <SortableTree
                        key={randomKey}
                        treeData={treeData}
                        nodeContentRenderer={nodeContentRenderer}
                        onChange={(treeDatas) => setTreeData(treeDatas)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className={`w-full ${customerType_from_props === "corporate" ? 'lg:w-1/2 xl:w-1/2' : 'lg:w-3/4 xl:w-3/4'} p-2`}>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              {customerType_from_props === "corporate" && (
                <div className="bg-gray-100 p-4 flex justify-between items-center">
                  <h3 className="mb-0 capitalize">{type}</h3>
                  {type && (
                    <>
                      {type === "individual" ? (
                        <img src="/img/investor/default-avatar.png" alt="Avatar" className="h-8 mr-2" />
                      ) : (
                        <EntityIcon className="nodeIcon" fontSize="large" color="action" style={{ fill: 'currentColor' }} />
                      )}
                    </>
                  )}
                </div>
              )}
              <div className="h-[70vh] overflow-auto p-4">
                {isLoader ? (
                  <div className="flex justify-center items-center h-80">
                    <LoadingSpinner animation="grow" custom={true} height="70vh" />
                  </div>
                ) : identity_id !== undefined ? (
                  <>
                    <div className="flex items-center mb-4">
                      <Tooltip>
                        Please ensure that documents uploaded are Certified True Copies (CTC). Please speak to your account representative if you are unsure of what to do.
                        <FontAwesomeIcon icon={faInfoCircle} />
                      </Tooltip>
                    </div>
                    {isrequiredDocListExist && requiredDocList?.length > 0 ? (
                      <>
                        {renderRequiredDocuments(entityValue)}
                        <hr />
                      </>
                    ) : (
                      renderUploadedDocuments()
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex justify-center">
                      <h4>Please Attach Fund To Identity To Add Documents</h4>
                    </div>
                    <hr />
                  </>
                )}
                {identityUploadDocList && Object.keys(identityUploadDocList).length > 0 && 
                  props?.dataOfAccountSetup?.fund_data?.fund_setting?.region.toLowerCase().includes("india") && (
                      
                      <div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h4>Identity CKYC Documents</h4>
                      <div>{renderIdentityDocuments()}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>


        {/* {viewModalShow && (
          <Modal size="xl" show={viewModalShow} onHide={() => setViewModalShow(false)} aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body className="show-grid">
              <img id="document_url"></img>
            </Modal.Body>
          </Modal>
        )} */}
        {viewModalShow && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
                <div className="flex justify-end p-4">
                    <button onClick={() => setViewModalShow(false)} className="text-gray-600 hover:text-gray-900">
                    &times;
                    </button>
                </div>
                <div className="p-4">
                    <img id="document_url" className="w-full h-auto" alt="Document" />
                </div>
                </div>
            </div>
            )}

      </div>
    </>
  );
}
