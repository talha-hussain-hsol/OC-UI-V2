import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Col, Row, Container, Dropdown, Alert } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import axios from "axios";
import { getRestrictedListAPI } from "../../../../api/network/AdministrationApi/AdministrationApi";
import { useParams, useNavigate } from "react-router-dom";
import ModalRestricted from "./modal";
import { format } from "date-fns";
import DeleteModal from "./deleteModal";
import CustomAlert from "../../../../widgets/components/Alerts";
import checkPermissions from "../../../../helpers/checkPermissions";
import PaginatedTableComponent from "../../../shared-components/paginated-table-component";
// import LoadingSpinner from "../../../../widgets/bootstrap-component/Spinner";
import Loader from "../../../../components/ui/loader";

const RestrictedList = () => {
  const params = useParams();
  const navigate = useNavigate();
  const cancelTokenSource = axios.CancelToken.source();
  const [restrictedList, setRestrictedList] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [isAlertSuccess, setIsAlertSuccess] = useState(false);
  const [sentToEdit, setSendToEdit] = useState({});
  const [totalLimit, setTotalLimit] = useState(0);
  const [offset, setOffset] = useState(0);
  const handleClose = () => setDeleteModalShow(false);
  const [alertProps, setAlertProps] = useState({
    variant: "",
    message: "",
    show: false,
    hideAuto: false,
  });
  const handleAlert = ({ variant, message, hideAuto }) => {
    setAlertProps({ variant, message, show: true, hideAuto });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAlertSuccess(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isAlertSuccess]);

  const getRestrictedList = useCallback(
    async (offset = 0, limit = 5) => {
      setIsLoader(true);
      const response = await getRestrictedListAPI(
        params?.fund_id,
        offset,
        limit,
        cancelTokenSource.token
      );

      if (response.success === true) {
        setRestrictedList(response?.data?.restricted_lists);
        if (totalLimit !== response.data.count) {
          setTotalLimit(response.data.count);
        }
        setIsLoader(false);
      } else {
        setIsLoader(false);
      }
    },
    [cancelTokenSource.token, params?.fund_id, totalLimit]
  );

  useEffect(function () {
    if (params?.fund_id && !restrictedList.length) {
      getRestrictedList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditClick = useCallback(
    (value) => {
      setSendToEdit(value.original);
      navigate(`/${params?.fund_id}/restricted/list/${value.original.id}`, {
        state: value.original,
      });
    },
    [navigate, params?.fund_id]
  );

  const handleDeleteClick = useCallback((value) => {
    setDeleteModalShow(true);
    setSendToEdit(value.original);
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "LIST NAME",
        accessor: "name",
      },
      {
        Header: "BUSINESS UNIT",
        accessor: "business_units",
        Cell: ({ value }) => <p>{value[0].name}</p>,
      },
      {
        Header: "Customers Count",
        accessor: "customers_count",
      },
      {
        Header: "CREATED AT",
        accessor: "created_at",
        Cell: ({ value }) => <p>{format(new Date(value), "dd/MM/yyyy")}</p>,
      },
      {
        Header: "UPDATED AT",
        accessor: "updated_at",
        Cell: ({ value }) => <p>{format(new Date(value), "dd/MM/yyyy")}</p>,
      },
      {
        id: "actions",
        disableSortBy: true,
        Cell: ({ row }) =>
          (checkPermissions("RESTRICTED_LIST_UPDATE") ||
            checkPermissions("RESTRICTED_LIST_DELETE")) && (
            <Dropdown align="end">
              <Dropdown.Toggle
                as="span"
                className="dropdown-ellipses"
                role="button"
              >
                <FeatherIcon icon="more-vertical" size="17" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {checkPermissions("RESTRICTED_LIST_UPDATE") && (
                  <Dropdown.Item onClick={() => handleEditClick(row)}>
                    Edit
                  </Dropdown.Item>
                )}
                {checkPermissions("RESTRICTED_LIST_DELETE") && (
                  <Dropdown.Item onClick={() => handleDeleteClick(row)}>
                    Delete
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          ),
      },
    ],
    [handleDeleteClick, handleEditClick]
  );

  const handleAddNewList = useCallback(() => {
    setModalShow(true);
  }, []);

  const handleCloseAlert = useCallback(() => {
    setAlertProps({ ...alertProps, show: false });
  }, [alertProps]);

  return (
    <>
      <div className="main-content">
        {deleteModalShow && (
          <DeleteModal
            handleAlert={handleAlert}
            getList={getRestrictedList}
            openDeleteModal={deleteModalShow}
            handleClose={handleClose}
            selectedRow={sentToEdit}
          />
        )}
        {alertProps.show && (
          <CustomAlert
            handleCloseAlert={handleCloseAlert}
            message={alertProps.message}
            variant={alertProps.variant}
            show={alertProps.show}
            hideAuto={alertProps.hideAuto}
            onClose={() => setAlertProps({ ...alertProps, show: false })}
          >
            {alertProps.message}
          </CustomAlert>
        )}

        <Container fluid>
          <Row className="justify-content-center">
            <Col xs={12}>
              <div class="card">
                <Row className="justify-content-center">
                  {
                    <ModalRestricted
                      setIsAlertSuccess={() => setIsAlertSuccess(true)}
                      show={modalShow}
                      onHide={() => setModalShow(false)}
                      getRestrictedList={getRestrictedList}
                    />
                  }
                  <Col xs={12}>
                    <div class="card">
                      <div class="card-header">
                        <h4 class="card-header-title">Restricted List</h4>
                        {checkPermissions("RESTRICTED_LIST_CREATE") && (
                          <div
                            onClick={(e) => {
                              handleAddNewList(e);
                            }}
                            class="btn btn-sm btn-white me-2"
                          >
                            Add New List
                          </div>
                        )}
                      </div>
                      <div class="card-body">
                        <div class="row">
                          <div class="col-md-12">
                            {isAlertSuccess && (
                              <Alert
                                variant={isAlertSuccess ? "success" : "danger"}
                                className="list-alert alert-dismissible border"
                                dismissible={true}
                                onClose={() => setIsAlertSuccess(false)}
                              >
                                {"List Added Successfully"}
                              </Alert>
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
                                <Loader animation="grow" />
                              </div>
                            ) : (
                              <PaginatedTableComponent
                                totalLimit={totalLimit}
                                fetchPageData={getRestrictedList}
                                pagination={true}
                                columns={columns}
                                allData={restrictedList}
                                setOffset={setOffset}
                                offset={offset}
                                pageLimit={5}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};
export default React.memo(RestrictedList);
