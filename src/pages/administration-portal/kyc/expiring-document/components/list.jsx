import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Col, Row, Container } from "react-bootstrap";
import axios from "axios";
import {
  getExpiryDocumentAPI,
  getSingleDocument,
} from "../../../../../api/network/AdministrationApi/AdministrationApi";
import { Link, useParams } from "react-router-dom";
import KycDynamicHeader from "../../../../../widgets/KycDynamicHeader";
import TableComponent from "../../../../shared-components/paginated-table-component";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
// import LoadingSpinner from "../../../../../widgets/bootstrap-component/Spinner";
import Loader from "../../../../../components/ui/loader";
import FeatherIcon from "feather-icons-react";
import formatDateRegionWise from "./../../../../../helpers/formatDateRegionWise";
import ToggleBtn from "../../../../../components/toggleBtn";
import DocumentModal from "../../../../wizard/components/documentModal/DocumentModal";
import CustomAlert from "../../../../../widgets/components/Alerts";
import DocumentViewModal from "../../profile/entity/documentModal/documentViewModal";

export default function ExpiringDocumentList({ ...props }) {
  const params = useParams();
  const cancelTokenSource = axios.CancelToken.source();
  const [isLoader, setIsLoader] = useState(false);
  const [docList, setDocLists] = useState({
    expiring: [],
    expired: [],
  });
  const [expringOffset, setExpiringOffset] = useState(0);
  const [expiredOffset, setExpiredOffset] = useState(0);
  const [totalExpiringCount, setTotalExpiringCount] = useState(0);
  const [activeTab, setActiveTab] = useState("expiring_docs");
  const [totalExpriedCount, setTotalExpiredCount] = useState(0);
  const [entityPermissions, setEntityPermission] = useState([]);
  const [disableBtn, setDisableBtn] = useState(false);
  const [documentModal, setDocumentModal] = useState(false);
  const [alertSucessDocumentAdd, setAlertSucessDocumentAdd] = useState(false);
  const [alertFailedDocumentAdd, setAlertFailedDocumentAdd] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDocData, setSelectedDocData] = useState({});
  const [selectedDocUrl, setSelectedDocUrl] = useState('');
  const [viewDocumentModal, setViewDocumentModal] = useState('');
  const [contentType, setContentType] = useState('')

  const getExpiredDocList = useCallback(
    async (offset = 0, limit = 10) => {
      setIsLoader(true);

      const response = await getExpiryDocumentAPI(
        params?.fund_id,
        'expired',
        cancelTokenSource.token,
        offset,
        limit
      );
      setDisableBtn(false);

      if (response.success === true) {
        setDocLists({
          ...docList,
          expired: response?.data?.expiryDocuments,
        });
        setTotalExpiredCount(response?.data?.count);
        setIsLoader(false);
      } else {
        setIsLoader(false);
      }
    },
    [cancelTokenSource.token, docList, params?.fund_id]
  );

  const getExpiringDocList = useCallback(
    async (offset = 0, limit = 10) => {
      setIsLoader(true);

      const response = await getExpiryDocumentAPI(
        params?.fund_id,
        'expiring',
        cancelTokenSource.token,
        offset,
        limit
      );
      setDisableBtn(false);

      if (response.success === true) {
        setDocLists({
          ...docList,
          expiring: response?.data?.expiryDocuments,
        });
        setTotalExpiringCount(response?.data?.count);
        setIsLoader(false);
      } else {
        setIsLoader(false);
      }
    },
    [cancelTokenSource.token, docList, params?.fund_id]
  );

  useEffect(
    function () {
      setDisableBtn(true);
      if (params?.fund_id) {
        if (activeTab === "expired_docs") {
          getExpiredDocList();
        } else if (activeTab === "expiring_docs") {
          getExpiringDocList();
        } else {
          setDisableBtn(false);

          setIsLoader(true);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeTab, params?.fund_id]
  );

  useEffect(() => {
    const permissions = localStorage.getItem("entity_permissions");
    if (permissions) {
      const parsedPermissions = JSON.parse(permissions);
      setEntityPermission(parsedPermissions);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(selectedDocData).length) {
      setDocumentModal(true);
    }
  }, [selectedDocData]);

  const tooltip = useCallback(
    () => <Tooltip id="tooltip">View Document</Tooltip>,
    []
  );

  useEffect(() => {
    if (selectedDocUrl.length) {
      setViewDocumentModal(true);
    }
  }, [selectedDocUrl])

  const handleClickSingleViewDocument = useCallback(
    async (documentId, contentType) => {
      setIsLoader(true);

      const response = await getSingleDocument(
        documentId,
        cancelTokenSource.token
      );
      if (response.success === true) {
        const url = response.data.IdentityDocumentSignedUrl;
        setSelectedDocUrl(url)
        const type = contentType ? contentType.split('/')[1] : 'png';
        contentType && setContentType(type)
        // window.open(url, "_blank");

        setIsLoader(false);
      } else {
        setIsLoader(false);
      }
    },
    [cancelTokenSource.token]
  );

  const handleSelectedDocumentUpdate = useCallback((selectedDoc) => {
    setSelectedDocData(selectedDoc);
  }, []);

  const columns = useMemo(() => {
    const columns = [
      {
        Header: "Belongs To",
        accessor: "identity",
        // Cell: (props) => <p><Link to={`/${params?.identity?.fundId}/kyc/account/identity/${props.cell.row.original?.identity?.identityType.toLowerCase()}/summary/${props.cell.row.original?.identity?.identityId}/${props.cell.row.original?.identity?.accountId}`}>{props.cell.row.original?.identity?.belongsTo && props.cell.row.original?.identity?.belongsTo.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}</Link></p>,
        Cell: (props) => {
          const identityType =
            props.cell.row.original?.identityType === 1 ? 'INDIVIDUAL'?.toLowerCase() : 'CORPORATE'.toLowerCase() ||
            "";
          const belongsTo =
            props.cell.row.original?.belongsTo
              ?.toLowerCase()
              ?.replace(/^\w/, (c) => c.toUpperCase()) || "Unknown";
          return (
            <p>
              <Link
                to={`/${params?.fund_id}/kyc/account/identity/${identityType}/summary/${props.cell.row.original?.identityId}/${props.cell.row.original?.accountId}`}
              >
                {belongsTo}
              </Link>
            </p>
          );
        },
      },
      {
        Header: "Type",
        accessor: "documentTypeName",
        Cell: ({ value }) => (
          <p>
            {value &&
              value.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
          </p>
        ),
      },
      {
        Header: "Sub Type",
        accessor: "subDocumentTypeName",
        Cell: ({ value }) => (
          <p>
            {value &&
              value.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
          </p>
        ),
      },
      {
        Header: "Expiry Date",
        accessor: "docExpiry",
        Cell: ({ value }) => <p>{formatDateRegionWise(value)}</p>,
      },

      {
        Header: "Action",
        disableSortBy: true,
        accessor: "docId",
        Cell: ({ value, row }) => {
          return (
            <div>
              <OverlayTrigger overlay={tooltip}>
                <div className="d-flex align-items-center gap-3">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="tooltip-eye">View Document</Tooltip>}
                  >
                    <span role="button" onClick={() => handleClickSingleViewDocument(value, row?.original?.contentType || '')}>
                      <FeatherIcon icon="eye" size="1em" />
                    </span>
                  </OverlayTrigger>

                  {entityPermissions.includes("MANAGE_ALL_CUSTOMERS") && (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id="tooltip-edit">Edit Document</Tooltip>}
                    >
                      <span
                        onClick={() => handleSelectedDocumentUpdate(row?.original)}
                        className="cursor-pointer"
                      >
                        <FeatherIcon icon="edit" size="1em" />
                      </span>
                    </OverlayTrigger>
                  )}
                </div>
              </OverlayTrigger>
            </div>
          );
        },
      },
    ];
    return columns;
  }, [entityPermissions, handleClickSingleViewDocument, handleSelectedDocumentUpdate, params?.fund_id, tooltip]);

  const handlePaginatedExpiringDocs = (offset, limit) => {
    getExpiringDocList(offset, limit);
  };

  const handleExpiredDocusPagination = useCallback(
    (offset, limit) => {
      getExpiredDocList(offset, limit);
    },
    [getExpiredDocList]
  );

  const handleTabActivation = useCallback(
    (tab) => {
      if (disableBtn) return;
      setActiveTab(tab);
    },
    [disableBtn]
  );

  const handleUpdatedExpireDocuments = useCallback(async () => {
    setDisableBtn(true);

    if (params?.fund_id) {
      if (activeTab === "expired_docs") {
        getExpiredDocList();
      } else if (activeTab === "expiring_docs") {
        getExpiringDocList();
      } else {
        setDisableBtn(false);

        setIsLoader(true);
      }
    }
  }, [activeTab, getExpiredDocList, getExpiringDocList, params?.fund_id]);

  const handleModalHidden = useCallback(() => {
    setDocumentModal(false);
    setSelectedDocData({});
  }, []);

  const handleHideDocumentViewModal = useCallback(() => {
    setViewDocumentModal(false)
    setSelectedDocUrl('')
  }, [])

  return (
    <>
      <div className="main-content">
        <Container fluid>
          <Row className="justify-content-center">
            <Col xs={12}>
              <div class="card">
                <KycDynamicHeader title={"Expiring Documents"} />

                <div className="d-flex flex-column gap-5">
                  <div className="d-flex justify-content-center mt-5">
                    <ToggleBtn
                      activeTab={activeTab}
                      setActiveTab={handleTabActivation}
                    />
                  </div>

                  {activeTab === "expired_docs" ? (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <small style={{ textAlign: "center" }} className="text-muted">
                        Documents that have already passed their expiry date will be shown here, under the "Expired Documents" section.
                      </small>
                      <small style={{ textAlign: "center" }} className="text-muted">
                      These documents require immediate attention, as they are no longer valid.
                      </small>

                    </div>
                  ) : activeTab === "expiring_docs" ? (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <small style={{ textAlign: "center" }} className="text-muted">
                        Expiring Documents displays documents that are approaching their expiry date. By default, documents will appear here 3 months before they expire. 
                      </small>
                      <small style={{ textAlign: "center" }} className="text-muted">
                      If a document is due for renewal within this period, it will be listed under the "Expiring Documents" section.
                      </small>

                    </div>
                  ) : null}
                  {isLoader ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Loader animation="grow" custom={true} />
                    </div>
                  ) : (
                    <Row className="justify-content-center">
                      <Col xs={12}>
                        {activeTab === "expired_docs" ? (
                          <TableComponent
                            pagination={true}
                            columns={columns}
                            allData={docList.expired}
                            fetchPageData={handleExpiredDocusPagination}
                            setOffset={setExpiredOffset}
                            offset={expiredOffset}
                            totalLimit={totalExpriedCount}
                            pageLimit={10}
                          />
                        ) : activeTab === "expiring_docs" ? (
                          <TableComponent
                            pagination={true}
                            columns={columns}
                            allData={docList.expiring}
                            fetchPageData={handlePaginatedExpiringDocs}
                            setOffset={setExpiringOffset}
                            offset={expringOffset}
                            totalLimit={totalExpiringCount}
                            pageLimit={10}
                          />
                        ) : (
                          <p>No Documents Found!</p>
                        )}
                      </Col>
                    </Row>
                  )}
                </div>
              </div>
            </Col>
          </Row>
          <DocumentViewModal
            isLoader={isLoader}
            onHide={handleHideDocumentViewModal}
            contentType={contentType}
            url={selectedDocUrl}
            show={viewDocumentModal}
          />
          {documentModal && (
            <DocumentModal
              setAlertSucessDocumentAdd={setAlertSucessDocumentAdd}
              setAlertFailedDocumentAdd={setAlertFailedDocumentAdd}
              setErrorMessage={setErrorMessage}
              list={handleUpdatedExpireDocuments}
              show={documentModal}
              onHide={handleModalHidden}
              requiredDocumentSelected={{
                id: selectedDocData?.typeId || selectedDocData?.docTypeId,
                name: selectedDocData?.documentTypeName,
                has_amount: selectedDocData?.documentHasAmount || false,
                has_document_number: selectedDocData?.documentHasDocumentNumber || false,
                has_expiry_date: selectedDocData?.documentHasExpiryDate || false,
                has_issued_date: selectedDocData?.documentHasIssuedDate || false,
                children: selectedDocData?.subDoctypeId ?  [
                  {
                    id: selectedDocData?.subDoctypeId,
                    name: selectedDocData?.subDocumentTypeName,
                    parentId: selectedDocData?.typeId,
                    has_amount: selectedDocData?.subDocumentHasAmount || false,
                    has_document_number: selectedDocData?.subDocumentHasDocumentNumber || false,
                    has_expiry_date: selectedDocData?.subDocumentHasExpiryDate || false,
                    has_issued_date: selectedDocData?.subDocumentHasIssuedDate || false,
                  },
                ] : [],
              }}
              CRPIdForUpload={selectedDocData?.identityId || ""}
              selectedTypeId={selectedDocData?.subDoctypeId}
              updatedDocId={selectedDocData?.docId}
            />
          )}
          {alertFailedDocumentAdd ? (
            <CustomAlert
              message={errorMessage}
              variant="danger"
              show={alertFailedDocumentAdd}
              hideAuto={true}
              onClose={() => setAlertSucessDocumentAdd(false)}
              className="position-fixed bottom-0 start-50 translate-middle-x"
              handleCloseAlert={() => setAlertSucessDocumentAdd(false)}
            >
              Something went wrong!
            </CustomAlert>
          ) : null}
          {alertSucessDocumentAdd ? (
            <CustomAlert
              message="Document has been updated successfully!"
              variant="success"
              show={alertSucessDocumentAdd}
              hideAuto={true}
              onClose={() => setAlertSucessDocumentAdd(false)}
              className="position-fixed bottom-0 start-50 translate-middle-x"
              handleCloseAlert={() => setAlertSucessDocumentAdd(false)}
            >
              Document has been updated successfully!
            </CustomAlert>
          ) : null}
        </Container>
      </div>
    </>
  );
}
