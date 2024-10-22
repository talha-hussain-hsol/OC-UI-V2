import {
  Button,
  Col,
  Container,
  Form,
  Nav,
  Spinner,
  Alert,
  Card,
  Dropdown,
  ListGroup,
  Row,
} from "react-bootstrap";
import React, { useEffect, useState } from "react";
import {
  getIdentityDocument,
  getRequiredDocument,
  getSingleDocument,
  getParticularsDetailByIdentityIdAPI,
  getRequiredDocumentCRP,
  deleteDocument,
} from "../../../../api/network/customerApi";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { HiDownload } from "react-icons/hi";
import { AiFillDelete, AiTwotoneEdit } from "react-icons/ai";
import DocumentModal from "./documentModal/DocumentModal";
// import LoadingSpinner from "../../../../widgets/bootstrap-component/Spinner";
// import SpinnerWithBackDrop from "../../../../widgets/bootstrap-component/SpinnerWithBackDrop";
// import CustomAlert from "../../../../widgets/bootstrap-component/Alert";
import Loader from "../../../../components/ui/loader";
import { BsChevronRight } from "react-icons/bs";
import { format } from "date-fns";
import { Avatar } from "../../../../components";
export default function documents({
  faceVerificationDocumentId,
  uppsalaStatus,
  isShowInvestmentTab,
}) {
  const [alertSucessDocumentAdd, setAlertSucessDocumentAdd] = useState(false);
  const [alertFailedDocumentAdd, setAlertFailedDocumentAdd] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [modalShow, setModalShow] = useState(false);
  const [isItemSelected, setIsItemSelected] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(false);
  const [requiredDocumentSelected, setRequiredDocumentSelected] =
    useState(null);
  const [documentUploadedSelected, setDocumentUploadedSelected] = useState([]);
  const [identityUploadDocList, setIdentityUploadDocList] = useState([]);
  const [requiredDocList, setRequiredDocList] = useState([]);
  const [isrequiredDocListExist, setIsRequiredDocListExist] = useState(true);
  const [isEntityValueExist, setIsEntityValueExist] = useState(true);
  const [entityValue, setEntityValue] = useState("");
  const [isLoaderCorporate, setIsLoaderCorporate] = useState("");
  const [isDocumentDeleted, setIsDocumentDeleted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoader, setIsLoader] = useState(false);
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
  const handleDocumentUploadedSelected = (document) => {
    setDocumentUploadedSelected(document);
  };

  //   const { data } = route.params;
  let { identity_id, account_id, type } = useParams();
  console.log("awais checking location", location);

  useEffect(() => {
    console.log(type, "type type type");
    if (type == "corporate") {
      console.log("heheheheheheh");
      getSpecificIdentityParticulars();
    }
  }, [type]);

  useEffect(() => {
    console.log("faceVerificationDocumentId check", faceVerificationDocumentId);
    console.log("faceVerificationDocumentId uppsalaStatus", uppsalaStatus);
  }, [uppsalaStatus, faceVerificationDocumentId]);
  useEffect(() => {
    handleGetIdentityDocumentApi();
    handleGetRequiredDocumentApi();
    console.log("awais checking identity_id", account_id);
  }, [identity_id]);

  useEffect(() => {
    console.log("awais 111 documentUploadedSelected", documentUploadedSelected);
    console.log("awais 111 requiredDocList", requiredDocList);
    console.log(
      "awais 111 requiredDocList identityUploadDocList",
      identityUploadDocList
    );
  }, [documentUploadedSelected, requiredDocList, identityUploadDocList]);

  //handle soft delete document
  const handleDeleteDocument = async (documentId, documentTypeId) => {
    console.log("documentTypeId", documentTypeId);
    const identityUploadDoc = identityUploadDocList[documentTypeId];

    console.log(`checking delete document`, documentUploadedSelected);
    setIsLoader(true);
    const response = await deleteDocument(documentId, cancelTokenSource.token);
    console.log("object 1 getSingleDocument", response);
    if (response.success == true) {
      // hide.style("display", "none")
      const reRenderDocs = documentUploadedSelected.filter(
        (item) => item.id !== documentId
      );
      const resultIdentityUploadDoc = identityUploadDoc.filter(
        (item) => item.id !== documentId
      );
      console.log(reRenderDocs, "reRenderDocs");
      setDocumentUploadedSelected(reRenderDocs);

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

  const getSpecificIdentityParticulars = async () => {
    setIsLoaderCorporate(true);
    const response = await getParticularsDetailByIdentityIdAPI(
      identity_id,
      cancelTokenSource.token
    );
    if (response.success == true) {
      setIsLoaderCorporate(false);
      console.log("getSpecificIdentityParticulars", response.data);
      console.log(
        response.data?.meta?.data["corporate.basic.entity_type_id"]?.value,
        "response.data?.meta?.data[corporate.basic.entity_type_id"
      );
      console.log(
        response.data?.meta?.data["corporate.basic.entity_type_id"],
        "response.data?.meta?.data[corporate.basic.entity_"
      );
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
    const timer = setTimeout(() => {
      setIsDocumentDeleted(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isDocumentDeleted]);

  const handleCloseAlert = () => {
    setAlertProps({ ...alertProps, show: false });
  };

  useEffect(() => {
    console.log("documentUploadedSelected", documentUploadedSelected);
    console.log(
      "documentUploadedSelected requiredDocumentSelected",
      requiredDocumentSelected
    );
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
    console.log(`checking`);
    setIsLoader(true);

    const response = await getIdentityDocument(
      identity_id,
      cancelTokenSource.token
    );
    console.log("object 1", response);
    if (response.success == true) {
      setIsLoader(false);
      setIdentityUploadDocList(response?.data?.IdentityDocuments);
    } else {
      setIsLoader(false);
    }
  };
  const handleGetRequiredDocumentApi = async () => {
    console.log(`checking`);
    setIsLoader(true);
    if (account_id) {
      const response = await getRequiredDocumentCRP(
        account_id,
        identity_id,
        cancelTokenSource.token
      );
      console.log("object 1 setRequiredDocList", response);
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

  const handleNextStep = () => {
    let nextStepRoute;

    // Check if faceVerificationDocumentId is not null
    if (faceVerificationDocumentId !== null) {
      nextStepRoute = `/profile/identity/${type}/face-verification/${identity_id}/${account_id}`;
    } else {
      // If faceVerificationDocumentId is null, check uppsalaStatus
      if (uppsalaStatus) {
        nextStepRoute = `/profile/identity/${type}/wallets/${identity_id}/${account_id}`;
      } else {
        if (isShowInvestmentTab) {
          nextStepRoute = `/profile/identity/${type}/investments/${identity_id}/${account_id}`;
        } else {
          nextStepRoute = `/profile/identity/${type}/overview/${identity_id}/${account_id}`;
        }
      }
    }

    navigate(nextStepRoute);
  };

  const getUploadedIdentityDocData = (id) => {
    console.log("aaaaaa id", id);
    console.log("aaaaaa identityUploadDocList", identityUploadDocList);
    const keysOfIdentityDocumentData = identityUploadDocList[id];
    if (keysOfIdentityDocumentData) {
      console.log("keysOfIdentityDocumentData", keysOfIdentityDocumentData);
      return keysOfIdentityDocumentData[0];
    }
  };
  const handleWarningMessage = (item) => {
    console.log("aaaaaa id", item?.id);
    console.log("aaaaaa identityUploadDocList", identityUploadDocList);
    const keysOfIdentityDocumentData = identityUploadDocList[item?.id];
    if (keysOfIdentityDocumentData) {
      console.log("keysOfIdentityDocumentData", keysOfIdentityDocumentData);

      return false;
    } else {
      if (item?.isRequired) {
        return true;
      }

      return false;
    }
  };
  const getUploadedDocumentChildName = (doc) => {
    console.log(
      "getUploadedDocumentChildName identityUploadDocList",
      identityUploadDocList[doc?.id]
    );
    console.log(
      "getUploadedDocumentChildName identityUploadDocList",
      identityUploadDocList[doc]
    );

    const dataforChildName = identityUploadDocList[doc?.id];

    if (dataforChildName) {
      if (dataforChildName.length > 0) {
        console.log("getUploadedDocumentChildName id innn iffff", doc);
        const childSubDocId = dataforChildName.map(
          (ids) => ids.subDocumentTypeId
        );
        const uniqueChildSubDocId = [...new Set(childSubDocId)];
        console.log("childSubDocId childSubDocId", uniqueChildSubDocId);

        let children = uniqueChildSubDocId
          .map((id) => {
            let item = doc.children.find((c) => c.id === id);
            if (item) {
              return item;
            }
            return null;
          })
          .filter((c) => c);

        if (children.length > 0) {
          console.log("childSubDocId childSubDocId innnnnnnnnnnn", children);
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
    if (typeof document === "object") {
      setIsItemSelected(true);
      let selectedFromUploadDocument = identityUploadDocList[document?.id];
      console.log("selectedFromUploadDocument", selectedFromUploadDocument);
      if (selectedFromUploadDocument !== undefined) {
        setDocumentUploadedSelected(selectedFromUploadDocument);
      } else {
        setDocumentUploadedSelected([]);
      }

      setRequiredDocumentSelected(document);
      console.log("document", document);
    } else {
      setIsItemSelected(true);
      let selectedFromUploadDocument = identityUploadDocList[document];
      console.log("selectedFromUploadDocument", selectedFromUploadDocument);
      if (selectedFromUploadDocument !== undefined) {
        setDocumentUploadedSelected(selectedFromUploadDocument);
      } else {
        setDocumentUploadedSelected([]);
      }
      setRequiredDocumentSelected(selectedFromUploadDocument[0]);
    }
    console.log("document typeof document", typeof document);
    setSelectedIndex(index);
  };

  const handleClickSingleDocument = async (documentId) => {
    console.log(`checking single document`);
    setIsLoader(true);

    const response = await getSingleDocument(
      documentId,
      cancelTokenSource.token
    );
    console.log("object 1 getSingleDocument", response);
    if (response.success == true) {
      setIsLoader(false);
      let url = response.data.IdentityDocumentSignedUrl;
      window.open(url, "_blank");
    } else {
      setIsLoader(false);
    }
  };

  const renderRequiredDocuments = (entityValueData) => (
    <div
      className="row"
      style={{ alignItems: "space-between", marginTop: "20px" }}
    >
      <div className="col-sm-5 col-md-5 col-lg-5">
        {requiredDocList
          .filter((document) => {
            return (
              document?.category_key == "DOCUMENT" &&
              document?.key != "FACE_VERIFICATION"
            );
          })
          .map((item) => {
            console.log(entityValueData, "entityValueData");

            return (
              <div
                className={
                  requiredDocumentSelected?.id == item.id && isItemSelected
                    ? "card  "
                    : handleWarningMessage(item)
                    ? "card field_warning "
                    : "card"
                }
              >
                <div
                  onClick={() => handleSingleDocumentClick(item)}
                  role="button"
                  className={
                    requiredDocumentSelected?.id == item.id && isItemSelected
                      ? "activeClassForDocument"
                      : null
                  }
                >
                  <div className="card-body">
                    <div
                      className="row"
                      style={{
                        flexDirection: "column",
                        alignItems: "start",
                        padding: "10px 0px",
                        justifyContent: "start",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "start",
                          marginBottom: "5px",
                        }}
                      >
                        <h4 className="font-weight-base">{item?.name}</h4>
                      </div>
                      {getUploadedDocumentChildName(item) !== null &&
                        getUploadedDocumentChildName(item).map((child) => {
                          return (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "start",
                                marginTop: "3px",
                              }}
                            >
                              <h6
                                className="font-weight-base"
                                style={{ marginBottom: "1px" }}
                              >
                                {child.name}
                              </h6>
                            </div>
                          );
                        })}
                      {getUploadedIdentityDocData(item?.id) == null ||
                      getUploadedIdentityDocData(item?.id) ==
                        undefined ? null : (
                        <>
                          <div
                            className="mb-1 mt-3"
                            style={{
                              display: "flex",
                              justifyContent: "start",
                              alignItems: "start",
                            }}
                          >
                            <small
                              className="text-muted mr-1"
                              style={{ marginRight: "0.5em" }}
                            >
                              Issue Date:{" "}
                            </small>

                            <small className="text-muted">
                              {getUploadedIdentityDocData(item?.id)
                                ?.issuedDate != null
                                ? getUploadedIdentityDocData(item?.id)
                                    ?.issuedDate
                                  ? format(
                                      new Date(
                                        getUploadedIdentityDocData(
                                          item?.id
                                        )?.issuedDate
                                      ),
                                      "dd/MM/yyyy"
                                    )
                                  : ""
                                : "N/A"}
                            </small>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "start",
                              alignItems: "start",
                            }}
                          >
                            <small
                              className="text-muted mr-1"
                              style={{ marginRight: "0.5em" }}
                            >
                              Expiry Date:{" "}
                            </small>
                            <small className="text-muted">
                              {getUploadedIdentityDocData(item?.id)
                                ?.expiryDate != null
                                ? getUploadedIdentityDocData(item?.id)
                                    ?.expiryDate
                                  ? format(
                                      new Date(
                                        getUploadedIdentityDocData(
                                          item?.id
                                        )?.expiryDate
                                      ),
                                      "dd/MM/yyyy"
                                    )
                                  : ""
                                : "N/A"}
                            </small>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
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
      {isItemSelected ? (
        <div className="col-sm-6 col-md-6 col-lg-6">
          <div
            className="row mb-4"
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: "1px",
              justifyContent: "center",
            }}
          >
            <div
              className="col-sm-10 col-md-10 col-lg-10"
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: "1px",
                justifyContent: "center",
              }}
            >
              <Button
                onClick={() => setModalShow(true)}
                variant="primary"
                size="lg"
                style={{ minWidth: "100%" }}
              >
                Add New Document
              </Button>
            </div>
          </div>

          {!(documentUploadedSelected.length > 0) ? (
            <div
              className="row"
              style={{ alignItems: "center", marginTop: "20px" }}
            >
              <h4 style={{ textAlign: "center" }}>
                There is no documents uploaded as yet.
              </h4>
            </div>
          ) : (
            <div
              className="row"
              style={{
                flexDirection: "column",
                alignItems: "center",
                marginTop: "8px",
                justifyContent: "space-between",
              }}
            >
              {documentUploadedSelected.map((item) => {
                return (
                  <>
                    {isLoader && (
                      // <SpinnerWithBackDrop
                      //   animation="grow"
                      //   custom={true}
                      //   height="70vh"
                      // />
                      <Loader />
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
                              alignItems: "center",
                              marginTop: "1px",
                              justifyContent: "space-between",
                            }}
                          >
                            <div
                              className="col-sm-9 col-md-9 col-lg-9 "
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "start",
                              }}
                            >
                              <div>
                                <small
                                  className="text-muted"
                                  style={{ marginRight: "0.5em" }}
                                >
                                  Issue Date:
                                </small>
                                <small className="text-muted">
                                  {item?.issuedDate != null
                                    ? item?.issuedDate
                                      ? format(
                                          new Date(item?.issuedDate),
                                          "dd/MM/yyyy"
                                        )
                                      : ""
                                    : "N/A"}
                                </small>
                              </div>
                              <div
                                className="col-sm-9 col-md-9 col-lg-9"
                                style={{
                                  display: "flex",
                                  justifyContent: "start",
                                  alignItems: "start",
                                }}
                              >
                                <small
                                  className="text-muted"
                                  style={{ marginRight: "0.5em" }}
                                >
                                  Expiry Date:
                                </small>
                                <small className="text-muted">
                                  {item?.expiryDate != null
                                    ? item?.expiryDate
                                      ? format(
                                          new Date(item?.expiryDate),
                                          "dd/MM/yyyy"
                                        )
                                      : ""
                                    : "N/A"}
                                </small>
                              </div>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "right",
                              }}
                              className="col-sm-3 col-md-3 col-lg-3"
                            >
                              <Button
                                style={{ marginRight: "1em" }}
                                onClick={() =>
                                  handleClickSingleDocument(item?.id)
                                }
                              >
                                <HiDownload />
                              </Button>
                              <Button
                                className="btn btn-danger"
                                onClick={() =>
                                  handleDeleteDocument(
                                    item?.id,
                                    item?.documentTypeId
                                  )
                                }
                              >
                                <AiFillDelete />
                              </Button>
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
              style={{ alignItems: "center", marginTop: "20px" }}
            >
              <h4 style={{ textAlign: "center" }}>
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
      style={{ alignItems: "space-between", marginTop: "20px" }}
    >
      <div className="col-sm-5 col-md-5 col-lg-5">
        {Object.keys(identityUploadDocList).map((item, index) => {
          console.log("dasdasd");
          return (
            <div className="card">
              {
                console.log(
                  "identityUploadDocList65432100000000000",
                  identityUploadDocList[item]
                )
                // console.log(`hi=documentUploadedSelected= ${identityUploadDocList[item][0]?.id} and isItemSelected=${identityUploadDocList} item=${item} requiredDocumentSelected=${requiredDocumentSelected}`)
              }
              <div
                onClick={() => handleSingleDocumentClick(item, index)}
                role="button"
                className={
                  selectedIndex == index && isItemSelected
                    ? "activeClassForDocument"
                    : null
                }
              >
                <div className="card-body">
                  <div
                    className="row"
                    style={{
                      flexDirection: "column",
                      alignItems: "start",
                      padding: "10px 0px",
                      justifyContent: "start",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        marginBottom: "5px",
                      }}
                    >
                      <h4 className="font-weight-base">
                        {identityUploadDocList[item][0].documentName}
                      </h4>
                    </div>
                    {getUploadedDocumentChildName(item) !== null &&
                      getUploadedDocumentChildName(item).map((child) => {
                        return (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "start",
                              marginTop: "3px",
                            }}
                          >
                            <h6
                              className="font-weight-base"
                              style={{ marginBottom: "1px" }}
                            >
                              {child.name}
                            </h6>
                          </div>
                        );
                      })}
                    {getUploadedIdentityDocData(item?.id) == null ||
                    getUploadedIdentityDocData(item?.id) == undefined ? null : (
                      <>
                        <div
                          className="mb-1 mt-3"
                          style={{
                            display: "flex",
                            justifyContent: "start",
                            alignItems: "start",
                          }}
                        >
                          <small
                            className="text-muted mr-1"
                            style={{ marginRight: "0.5em" }}
                          >
                            Issue Date:{" "}
                          </small>

                          <small className="text-muted">
                            {getUploadedIdentityDocData(item?.id)?.issuedDate !=
                            null
                              ? format(
                                  new Date(
                                    getUploadedIdentityDocData(
                                      item?.id
                                    )?.issuedDate
                                  ),
                                  "dd/MM/yyyy"
                                )
                              : "N/A"}
                          </small>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "start",
                            alignItems: "start",
                          }}
                        >
                          <small
                            className="text-muted mr-1"
                            style={{ marginRight: "0.5em" }}
                          >
                            Expiry Date:{" "}
                          </small>
                          <small className="text-muted">
                            {getUploadedIdentityDocData(item?.id)?.expiryDate !=
                            null
                              ? format(
                                  new Date(
                                    getUploadedIdentityDocData(
                                      item?.id
                                    )?.expiryDate
                                  ),
                                  "dd/MM/yyyy"
                                )
                              : "N/A"}
                          </small>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {isItemSelected ? (
        <div className="col-sm-6 col-md-6 col-lg-6">
          {!(documentUploadedSelected.length > 0) ? (
            <div
              className="row"
              style={{ alignItems: "center", marginTop: "20px" }}
            >
              <h4 style={{ textAlign: "center" }}>
                There is no documents uploaded as yet.
              </h4>
            </div>
          ) : (
            <div
              className="row"
              style={{
                flexDirection: "column",
                alignItems: "center",
                marginTop: "8px",
                justifyContent: "space-between",
              }}
            >
              {documentUploadedSelected.map((item) => {
                return (
                  <>
                    <div className="col-sm-10 col-md-10 col-lg-10">
                      {isLoader && (
                        // <SpinnerWithBackDrop
                        //   animation="grow"
                        //   custom={true}
                        //   height="70vh"
                        // />
                        <Loader />
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
                                alignItems: "center",
                                marginTop: "1px",
                                justifyContent: "space-between",
                              }}
                            >
                              <div
                                className="col-sm-9 col-md-9 col-lg-9 "
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  alignItems: "start",
                                }}
                              >
                                <div>
                                  <small
                                    className="text-muted"
                                    style={{ marginRight: "0.5em" }}
                                  >
                                    Issue Date:
                                  </small>
                                  <small className="text-muted">
                                    {item?.issuedDate
                                      ? format(
                                          new Date(item?.issuedDate),
                                          "dd/MM/yyyy"
                                        )
                                      : ""}
                                  </small>
                                </div>
                                <div
                                  className="col-sm-9 col-md-9 col-lg-9"
                                  style={{
                                    display: "flex",
                                    justifyContent: "start",
                                    alignItems: "start",
                                  }}
                                >
                                  <small
                                    className="text-muted"
                                    style={{ marginRight: "0.5em" }}
                                  >
                                    Expiry Date:
                                  </small>
                                  <small className="text-muted">
                                    {item?.expiryDate
                                      ? format(
                                          new Date(item?.expiryDate),
                                          "dd/MM/yyyy"
                                        )
                                      : ""}
                                  </small>
                                </div>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "right",
                                }}
                                className="col-sm-3 col-md-3 col-lg-3"
                              >
                                <Button
                                  onClick={() =>
                                    handleClickSingleDocument(item?.id)
                                  }
                                >
                                  <HiDownload />
                                </Button>
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
              style={{ alignItems: "center", marginTop: "20px" }}
            >
              <h4 style={{ textAlign: "center" }}>
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
      style={{ alignItems: "space-between", marginTop: "20px" }}
    >
      <div className="col-sm-5 col-md-5 col-lg-5">
        {requiredDocList
          .filter((document) => {
            return document?.category_key == "DOCUMENT";
          })
          .map((item, index) => {
            return (
              <>
                <Card>
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
                            ? "activeClassForDocument"
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
                </Card>
                <div className="card">
                  {alertFailedDocumentAdd ? (
                    // <CustomAlert
                    //   message={errorMessage}
                    //   variant="danger"
                    //   show={alertFailedDocumentAdd}
                    //   hideAuto={alertProps.hideAuto}
                    //   onClose={() =>
                    //     setAlertProps({ ...alertProps, show: false })
                    //   }
                    //   className="position-fixed bottom-0 start-50 translate-middle-x"
                    //   handleCloseAlert={handleCloseAlert}
                    // >
                    //   {alertProps.message}
                    // </CustomAlert>
                    <></>
                  ) : null}
                  {alertSucessDocumentAdd ? (
                    // <CustomAlert
                    //   message="Document Added Successfully"
                    //   variant="success"
                    //   show={alertSucessDocumentAdd}
                    //   hideAuto={alertProps.hideAuto}
                    //   onClose={() =>
                    //     setAlertProps({ ...alertProps, show: false })
                    //   }
                    //   className="position-fixed bottom-0 start-50 translate-middle-x"
                    //   handleCloseAlert={handleCloseAlert}
                    // >
                    //   {alertProps.message}
                    // </CustomAlert>
                    <></>
                  ) : null}
                  {isDocumentDeleted ? (
                    // <CustomAlert
                    //   message="Document Deleted Successfully"
                    //   variant="success"
                    //   show={isDocumentDeleted}
                    //   hideAuto={alertProps.hideAuto}
                    //   onClose={() =>
                    //     setAlertProps({ ...alertProps, show: false })
                    //   }
                    //   className="position-fixed bottom-0 start-50 translate-middle-x"
                    //   handleCloseAlert={handleCloseAlert}
                    // />
                    <></>
                  ) : null}
                  <div
                    onClick={() => handleSingleDocumentClick(item)}
                    role="button"
                    className={
                      requiredDocumentSelected?.id == item.id && isItemSelected
                        ? "activeClassForDocument"
                        : null
                    }
                  >
                    <div className="card-body">
                      <div
                        className="row"
                        style={{
                          flexDirection: "column",
                          alignItems: "start",
                          padding: "10px 0px",
                          justifyContent: "start",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "start",
                            marginBottom: "5px",
                          }}
                        >
                          <h4 className="font-weight-base">{item?.name}</h4>
                        </div>
                        {getUploadedDocumentChildName(item) !== null &&
                          getUploadedDocumentChildName(item).map((child) => {
                            return (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "start",
                                  marginTop: "3px",
                                }}
                              >
                                <h6
                                  className="font-weight-base"
                                  style={{ marginBottom: "1px" }}
                                >
                                  {child.name}
                                </h6>
                              </div>
                            );
                          })}
                        {getUploadedIdentityDocData(item?.id) == null ||
                        getUploadedIdentityDocData(item?.id) ==
                          undefined ? null : (
                          <>
                            <div
                              className="mb-1 mt-3"
                              style={{
                                display: "flex",
                                justifyContent: "start",
                                alignItems: "start",
                              }}
                            >
                              <small
                                className="text-muted mr-1"
                                style={{ marginRight: "0.5em" }}
                              >
                                Issue Date:{" "}
                              </small>

                              <small className="text-muted">
                                {getUploadedIdentityDocData(item?.id)
                                  ?.issuedDate != null
                                  ? getUploadedIdentityDocData(item?.id)
                                      ?.issuedDate
                                    ? format(
                                        new Date(
                                          getUploadedIdentityDocData(
                                            item?.id
                                          )?.issuedDate
                                        ),
                                        "dd/MM/yyyy"
                                      )
                                    : ""
                                  : "N/A"}
                              </small>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "start",
                                alignItems: "start",
                              }}
                            >
                              <small
                                className="text-muted mr-1"
                                style={{ marginRight: "0.5em" }}
                              >
                                Expiry Date:{" "}
                              </small>
                              <small className="text-muted">
                                {getUploadedIdentityDocData(item?.id)
                                  ?.expiryDate != null
                                  ? getUploadedIdentityDocData(item?.id)
                                      ?.expiryDate
                                    ? format(
                                        new Date(
                                          getUploadedIdentityDocData(
                                            item?.id
                                          )?.expiryDate
                                        ),
                                        "dd/MM/yyyy"
                                      )
                                    : ""
                                  : "N/A"}
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
              flexDirection: "row",
              alignItems: "center",
              marginTop: "1px",
              justifyContent: "center",
            }}
          >
            <div
              className="col-sm-10 col-md-10 col-lg-10"
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: "1px",
                justifyContent: "center",
              }}
            >
              <Button
                onClick={() => setModalShow(true)}
                variant="primary"
                size="lg"
                style={{ minWidth: "100%" }}
              >
                Add New Document
              </Button>
            </div>
          </div>

          {!(documentUploadedSelected.length > 0) ? (
            <div
              className="row"
              style={{ alignItems: "center", marginTop: "20px" }}
            >
              <h4 style={{ textAlign: "center" }}>
                There is no documents uploaded as yet.
              </h4>
            </div>
          ) : (
            <div
              className="row"
              style={{
                flexDirection: "column",
                alignItems: "center",
                marginTop: "8px",
                justifyContent: "space-between",
              }}
            >
              {documentUploadedSelected.map((item) => {
                return (
                  <>
                    {isLoader && (
                      // <SpinnerWithBackDrop
                      //   animation="grow"
                      //   custom={true}
                      //   height="70vh"
                      // />
                      <Loader />
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
                              alignItems: "center",
                              marginTop: "1px",
                              justifyContent: "space-between",
                            }}
                          >
                            <div
                              className="col-sm-9 col-md-9 col-lg-9 "
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "start",
                              }}
                            >
                              <div>
                                <small
                                  className="text-muted"
                                  style={{ marginRight: "0.5em" }}
                                >
                                  Issue Date:
                                </small>
                                <small className="text-muted">
                                  {item?.issuedDate != null
                                    ? item?.issuedDate
                                      ? format(
                                          new Date(item?.issuedDate),
                                          "dd/MM/yyyy"
                                        )
                                      : ""
                                    : "N/A"}
                                </small>
                              </div>
                              <div
                                className="col-sm-9 col-md-9 col-lg-9"
                                style={{
                                  display: "flex",
                                  justifyContent: "start",
                                  alignItems: "start",
                                }}
                              >
                                <small
                                  className="text-muted"
                                  style={{ marginRight: "0.5em" }}
                                >
                                  Expiry Date:
                                </small>
                                <small className="text-muted">
                                  {item?.expiryDate != null
                                    ? item?.expiryDate
                                      ? format(
                                          new Date(item?.expiryDate),
                                          "dd/MM/yyyy"
                                        )
                                      : ""
                                    : "N/A"}
                                </small>
                              </div>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "right",
                              }}
                              className="col-sm-3 col-md-3 col-lg-3"
                            >
                              <Button
                                onClick={() =>
                                  handleClickSingleDocument(item?.id)
                                }
                              >
                                <HiDownload />
                              </Button>
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
              style={{ alignItems: "center", marginTop: "20px" }}
            >
              <h4 style={{ textAlign: "center" }}>
                Please Select The Document To Proceed With The Upload.
              </h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  return (
    <>
      {isLoaderCorporate && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "20rem",
          }}
        >
          {/* <LoadingSpinner animation="grow" custom={true} height="70vh" />
           */}
          <Loader />
        </div>
      )}
      {isDocumentDeleted ? (
        // <CustomAlert
        //   message="Document Deleted Successfully"
        //   variant="success"
        //   show={isDocumentDeleted}
        //   hideAuto={alertProps.hideAuto}
        //   onClose={() => setAlertProps({ ...alertProps, show: false })}
        //   className="position-fixed bottom-0 start-50 translate-middle-x"
        //   handleCloseAlert={handleCloseAlert}
        // />
        <></>
      ) : null}
      {modalShow && (
        <DocumentModal
          setAlertSucessDocumentAdd={setAlertSucessDocumentAdd}
          setAlertFailedDocumentAdd={setAlertFailedDocumentAdd}
          setErrorMessage={setErrorMessage}
          list={handleGetIdentityDocumentApi}
          show={modalShow}
          onHide={() => setModalShow(false)}
          requiredDocumentSelected={requiredDocumentSelected}
          documentUploadedSelected={documentUploadedSelected}
          entityValueData={entityValue}
          handleDocumentUploadedSelected={handleDocumentUploadedSelected}
        />
      )}

      <div className="main-content">
        <Container fluid>
          <Row className="justify-content-center"></Row>
          {alertFailedDocumentAdd ? (
            // <CustomAlert
            //   message={errorMessage}
            //   variant="danger"
            //   show={alertFailedDocumentAdd}
            //   hideAuto={alertProps.hideAuto}
            //   onClose={() => setAlertProps({ ...alertProps, show: false })}
            //   className="position-fixed bottom-0 start-50 translate-middle-x"
            //   handleCloseAlert={handleCloseAlert}
            // >
            //   {alertProps.message}
            // </CustomAlert>
            <></>
          ) : null}
          {alertSucessDocumentAdd ? (
            // <CustomAlert
            //   message="Document Added Successfully"
            //   variant="success"
            //   show={alertSucessDocumentAdd}
            //   hideAuto={alertProps.hideAuto}
            //   onClose={() => setAlertProps({ ...alertProps, show: false })}
            //   className="position-fixed bottom-0 start-50 translate-middle-x"
            //   handleCloseAlert={handleCloseAlert}
            // >
            //   {alertProps.message}
            // </CustomAlert>
            <></>
          ) : null}
          {console.log(isEntityValueExist, "isEntityValueExist")}
          {!isEntityValueExist ? (
            <Row className="justify-content-center">
              <Col xs={12} lg={10} xl={10}>
                <div>
                  <h3>
                    Select Entity Type from particulars screen to upload
                    documents
                  </h3>
                </div>
              </Col>
            </Row>
          ) : (
            <Row className="justify-content-center">
              <Col xs={12} lg={10} xl={10}>
                {isLoader ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "20rem",
                    }}
                  >
                    {/* <LoadingSpinner
                      animation="grow"
                      custom={true}
                      height="70vh"
                    /> */}
                    <Loader />
                  </div>
                ) : !(identity_id == undefined) ? (
                  <>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <h4>
                        Please ensure that documents uploaded are Certified True
                        Copies (CTC). Please speak to your account
                        representative for any questions.
                      </h4>
                    </div>
                    {isrequiredDocListExist ? (
                      requiredDocList.length > 0 ? (
                        <>
                          {renderRequiredDocuments(entityValue)}

                          <hr />
                        </>
                      ) : null
                    ) : (
                      renderUploadedDocuments()
                    )}
                  </>
                ) : (
                  <>
                    <div className="card ">
                      <div className="card-body">
                        <div
                          className="row"
                          style={{ alignItems: "center", marginTop: "20px" }}
                        >
                          <h4 style={{ textAlign: "center" }}>
                            Please Attach Fund To Identity To Add Documents
                          </h4>
                        </div>
                      </div>
                    </div>
                    <hr />
                  </>
                )}
              </Col>
            </Row>
          )}
          <Row className="justify-content-center">
            {!location?.state?.isCrp && identity_id && account_id && (
              <Col
                style={{ display: "flex", justifyContent: "end" }}
                xs={12}
                lg={10}
                xl={10}
              >
                <Button onClick={handleNextStep}>
                  Next <BsChevronRight />
                </Button>
              </Col>
            )}
          </Row>
        </Container>
      </div>
    </>
  );
}
