import {
  Button,
  Col,
  Container,
  Row,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { DynamicHeader, ProfileHeader } from "../../../widgets";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getCustomerIdentityList,
  updateIdentityStatusAPI,
} from "../../../api/network/customerApi";
import axios from "axios";
// import SpinnerWithBackDrop from "../../../widgets/bootstrap-component/SpinnerWithBackDrop";
import Loader from "../../../components/ui/loader";
import { AiTwotoneEdit } from "react-icons/ai";
import Pagination from "../../shared-components/pagination";

export default function Identities() {
  const [profileListData, setProfileListData] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [isLoaderIdentites, setIsLoaderIdentities] = useState(false);
  const cancelTokenSource = axios.CancelToken.source();
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalIdentitiesCount, setTotalIdentitiesCount] = useState(0);
  const [pageOptions, setPageOptions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    handleGetIdentityList();
  }, [pageIndex]);

  const handleGetIdentityList = async () => {
    if (!hasMore) return;

    setIsLoaderIdentities(true);
    try {
      const response = await getCustomerIdentityList(
        offset,
        limit,
        cancelTokenSource.token
      );
      const newIdentities = response.data?.rows || [];
      setTotalIdentitiesCount(response.data?.count || 0);

      if (response?.success && newIdentities.length > 0) {
        setProfileListData(newIdentities);
        setOffset((prevOffset) => prevOffset + limit);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching identities", error);
    } finally {
      setIsLoaderIdentities(false);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();

    handleGetIdentityList(abortController);

    return () => {
      abortController.abort();
    };
  }, []);

  const handleEditClick = (identityId, identityType) => {
    navigate(
      `/profile/identity/${identityType.toLowerCase()}/particular/${identityId}`
    );
  };

  const handleChangeStatus = async (value, identityId) => {
    let dataToSend = { status: value };
    setIsLoader(true);
    const response = await updateIdentityStatusAPI(
      dataToSend,
      identityId,
      cancelTokenSource.token
    );
    if (response.success === true) {
      setIsLoader(false);
      handleGetIdentityList();
    } else {
      setIsLoader(false);
    }
  };

  const headerButtonCallBack = (e) => {
    e.preventDefault();
    navigate("/profile/identities");
  };

  const handleClickPrevious = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
      setOffset((pageIndex - 1) * limit);
    }
  };

  const handleClickNext = () => {
    if ((pageIndex + 1) * limit < totalIdentitiesCount) {
      setPageIndex(pageIndex + 1);
      setOffset((pageIndex + 1) * limit);
    }
  };

  // const maxVisiblePages = 5;
  const totalPages = Math.ceil(totalIdentitiesCount / limit);

  // const renderPageItems = () => {
  //   let items = [];

  //   for (let i = 0; i < totalPages; i++) {
  //     if (
  //       i === 0 ||
  //       i === totalPages - 1 ||
  //       i === pageIndex ||
  //       (i >= pageIndex - Math.floor(maxVisiblePages / 2) &&
  //         i <= pageIndex + Math.floor(maxVisiblePages / 2))
  //     ) {
  //       items.push(
  //         <Pagination.Item
  //           key={i}
  //           active={i === pageIndex}
  //           onClick={(e) => {
  //             e.preventDefault();
  //             setPageIndex(i);
  //             setOffset(i * limit);
  //           }}
  //         >
  //           {i + 1}
  //         </Pagination.Item>
  //       );
  //     } else if (
  //       (i === pageIndex - Math.floor(maxVisiblePages / 2) - 1 &&
  //         pageIndex > Math.floor(maxVisiblePages / 2)) ||
  //       (i === pageIndex + Math.floor(maxVisiblePages / 2) + 1 &&
  //         pageIndex < totalPages - Math.floor(maxVisiblePages / 2))
  //     ) {
  //       items.push(<Pagination.Ellipsis key={i} />);
  //     }
  //   }

  //   return items;
  // };

  return (
    <div className="main-content">
      <DynamicHeader
        style={{ marginBottom: "0rem" }}
        title="My Identities"
        titlesmall="OverView"
        buttoncallback={headerButtonCallBack}
        isShowFundLogo={true}
      />

      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12} lg={12} xl={12}>
            <ProfileHeader />
            <div className="card">
              <div className="card-header" style={{ padding: "40px 20px" }}>
                <span style={{ color: "gray", fontSize: "12px" }}>
                  <p className="mb-0">
                    Please note that you can set your identities to "Inactive"
                    or "Active" by using the toggle button. Your submitted
                    account applications will not be impacted if you set your
                    identities as "Inactive"
                  </p>
                  <p className="mb-0">
                    To delete/withdraw an account application, please proceed to
                    the Account Details page to perform this action.
                  </p>
                  <p className="mb-0">
                    Please note that you can only delete/withdraw an application
                    which are in "Draft" or "Pending" statues. Applications that
                    has been already processed for KYC screening cannot be
                    deleted/withdrawn.{" "}
                  </p>
                  <p className="mb-0">
                    You may contact your Account Manager to assist you in this
                    case.
                  </p>
                </span>
              </div>
              <div className="table-responsive">
                {isLoaderIdentites ? (
                  // <SpinnerWithBackDrop
                  //   animation="grow"
                  //   custom={true}
                  //   height="70vh"
                  // />
                  <Loader />
                ) : (
                  <table className="table table-sm table-nowrap card-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="list">
                      {profileListData.length > 0 ? (
                        profileListData.map((item, index) => (
                          <tr key={index}>
                            <td>
                              {item?.label &&
                                item?.label
                                  .toLowerCase()
                                  .replace(/^\w/, (c) => c.toUpperCase())}
                            </td>
                            <td>
                              {item?.type &&
                                item?.type
                                  .toLowerCase()
                                  .replace(/^\w/, (c) => c.toUpperCase())}
                            </td>
                            <td>
                              <span
                                className={
                                  item?.status === "active"
                                    ? "text-success"
                                    : "text-warning"
                                }
                              >
                                {item?.status}
                              </span>
                            </td>
                            <td
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Edit</Tooltip>}
                              >
                                <span>
                                  <AiTwotoneEdit
                                    style={{
                                      cursor: "pointer",
                                      marginRight: "10px",
                                      marginLeft: "8px",
                                    }}
                                    onClick={() =>
                                      handleEditClick(item.id, item.type)
                                    }
                                  />
                                </span>
                              </OverlayTrigger>
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Change Status</Tooltip>}
                              >
                                <div className="form-check form-switch">
                                  <input
                                    className="form-check-input"
                                    id={`switchOne${index}`}
                                    type="checkbox"
                                    checked={item?.status === "active"}
                                    onChange={(event) => {
                                      handleChangeStatus(
                                        event.target.checked
                                          ? "activate"
                                          : "deactivate",
                                        item.id
                                      );
                                    }}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor={`switchOne${index}`}
                                  >
                                    {item?.status === "active"
                                      ? "active"
                                      : "in active"}
                                  </label>
                                </div>
                              </OverlayTrigger>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <p>No Data</p>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "-1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "2rem",
                  }}
                >
                  <Pagination
                    pageIndex={pageIndex}
                    totalPages={totalPages}
                    handleClickPrevious={handleClickPrevious}
                    handleClickNext={handleClickNext}
                    setPageIndex={setPageIndex}
                    setOffset={setOffset}
                    limit={limit}
                  />
                </div>
              </div>
            </div>
            <br />
            <br />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
