import React, { useMemo, useState, useEffect } from "react";
import { Col, Row, Container, Form, Tooltip, OverlayTrigger, Pagination } from "react-bootstrap";
// import { format } from "date-fns";
import { Search } from "feather-icons-react";
import FeatherIcon from "feather-icons-react";
import axios from "axios";
import TableComponent from "../../../../shared-components/table-component-with-backend-pagination";
// import DatePicker from "react-datepicker";
import { getDueDiligenceAPI } from "../../../../../api/network/AdministrationApi/AdministrationApi";
import {  useNavigate, useParams } from "react-router-dom";
import KycDynamicHeader from "../../../../../widgets/KycDynamicHeader";
// import { search } from "../../../../../data";
// import { CloudLightning } from "feather-icons-react/build/IconComponents";
import { Flatpickr } from "../../../../../components/vendor";
// import "./due-diligence.module.scss";
// import LoadingSpinner from "../../../../../widgets/bootstrap-component/Spinner";
import Loader from "../../../../../components/ui/loader";
import formatDateRegionWise from './../../../../../helpers/formatDateRegionWise';
export default function DueDiligenceList({ ...props }) {
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm();
  const params = useParams();
  const navigate = useNavigate();
  const cancelTokenSource = axios.CancelToken.source();
  const [dueDiligence, setDueDiligence] = useState([]);
  const [count, setCount] = useState(0);
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [searchName, setSearchName] = useState("");
  const [valueFilter, setValueFilter] = useState("ACTION_REQUIRED");
  const [valueResult, setValueResult] = useState("ALL");
  const [value, setValue] = useState("0");
  const [dealingDate, setDealingDate] = useState(new Date());
  const [dueData, setDueData] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageOptions, setPageOptions] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const isEndDateDisabled = selectedStartDate === "";

  useEffect(
    function () {
      console.log("dueDiligence", dueDiligence);
    },
    [dueDiligence]
  );
  useEffect(
    function () {
      if (dueDiligence && count != 0) {
        let totalRecords = count
        let numberOfPages = totalRecords / rowsPerPage
        let roundedUp = Math.ceil(numberOfPages)
        let resultArray = []
        for (let i = 1; i <= roundedUp; i++) {
          resultArray.push(i)
        }
        setPageOptions(resultArray)
      }
    },
    [dueDiligence, count]
  );
  // useEffect(() => {
  //   getDueDiligenceList();
  // }, [selectedEndDate, valueResult, valueFilter]);
  useEffect(() => {
    if (params?.fund_id && pageIndex !== undefined && pageIndex !== null) {
      getDueDiligenceList();
    }
  }, [pageIndex, params?.fund_id,selectedEndDate, valueResult, valueFilter]);
  // }, []);
  useEffect(() => {
    console.log("dueDiligence,", dueDiligence);
  }, [dueDiligence]);
  // handlers
  const handleDateChangeStartDate = (date) => {
    setSelectedStartDate(date);
  };
  const handleDateChangeEndDate = (date) => {
    setSelectedEndDate(date);
  };
  const handleChangeResult = (event) => {
    setValueFilter(event.target.value);
  };
  const handleChangeResultFilter = (event) => {
    setDueDiligence([]);
    setValueResult(event.target.value);
    // setValueResult()
  };
  const handleClickPrevious = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  };

  const handleClickNext = () => {
    if (pageIndex < pageOptions.length - 1) {
      setPageIndex(pageIndex + 1);
    }
  };
  const gotoPage = (page) => {
    setPageIndex(page)
  }
  const handleSearchName = (e) => {
    console.log(e, "Search event");
    setSearchName(e.target.value);
  };
  // const onSubmit = (data) => {
  //   console.log(data);
  // };
  const handleSubmitSearchName = () => {
    getDueDiligenceList();
  };
  let tooltipMessage = "abc";

  const getDueDiligenceList = async () => {
    let offset = 0;
    if (pageIndex > 0) {
      offset = rowsPerPage * pageIndex;
    }
    setIsLoader(true);
    const dataToSend = {
      startDate: selectedStartDate == "" ? null : selectedStartDate,
      endDate: selectedEndDate == "" ? null : selectedEndDate,
      type: valueResult == "ALL" ? null : valueResult,
      offset: offset,
      limit: rowsPerPage,
      name: searchName == "" ? null : searchName,
      filter: valueFilter,
    };

    const response = await getDueDiligenceAPI(params?.fund_id, dataToSend, cancelTokenSource.token);
    if (response.success == true) {
      setDueDiligence(response?.data?.on_going_due_diligence);
      setCount(response?.data?.count);
      setIsLoader(false);
    } else {
      setIsLoader(false);
      console.log("failed responseddd", response);
    }
  };
  const pageNumberChangedCallback = (e) => {
    console.log(e, "pageNumberChangedCallback");
  };

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ value }) => (
          <div>
            {value.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
          </div>
        ),
      },

      {
        Header: " CUSTOMER TYPE",
        accessor: "customerType",
        Cell: (props) => (
          <span>
  {props.cell.row.original?.identityInfo?.type
    ? props.cell.row.original.identityInfo.type
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    : ''}
  <span>
    {props.cell.row.original?.identityInfo?.parentId !== "0" ? " (CRP)" : ''}
  </span>
</span>
        ),
      },

      {
        Header: "UPDATE AT",
        accessor: "updated_at",
        Cell: ({ value }) => formatDateRegionWise(value,true),
      },
      {
        Header: "RESULT",
        accessor: "result",
        Cell: (props) => (
          <button
            style={{ fontSize: "12px", padding: "5px" ,fontWeight:"bold"}}
            onClick={(e) => {
              handleClickActionRequired(props.cell.row.original)
            }}
            className={props.cell.row.original?.result.replaceAll('_',' ') ==="No Hit"? "btn btn-success":"btn btn-danger"}
          >
           <span>
  {props.cell.row.original?.result
    ? props.cell.row.original.result
        .replaceAll('_', ' ')  // Replace underscores with spaces
        .split(' ')            // Split into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())  // Capitalize each word
        .join(' ')             // Join the words back together
    : ''}
</span>

          </button>
        ),
      },
    ],
    []
  )
  const handleClickActionRequired = (data) => {
    console.log(data, "datataatfastda")
    // return;
    navigate(
      `/${params?.fund_id
      }/kyc/account/identity/${data?.identityInfo?.type.toLowerCase()}/screening/${data?.identity_id
      }/${data?.accountId}`
    )
  }

  const maxVisiblePages = 5;
  const renderPageItems = () => {
    let items = [];
    const totalPages = pageOptions.length;

    for (let i = 0; i < totalPages; i++) {
      if (i === 0 || i === totalPages - 1 || i === pageIndex || (i >= pageIndex - Math.floor(maxVisiblePages / 2) && i <= pageIndex + Math.floor(maxVisiblePages / 2))) {
        items.push(
          <Pagination.Item
            key={i}
            active={i === pageIndex}
            onClick={(e) => {
              e.preventDefault();
              gotoPage(i);
            }}
          >
            {i + 1}
          </Pagination.Item>
        );
      } else if ((i === pageIndex - Math.floor(maxVisiblePages / 2) - 1 && pageIndex > Math.floor(maxVisiblePages / 2)) || (i === pageIndex + Math.floor(maxVisiblePages / 2) + 1 && pageIndex < totalPages - Math.floor(maxVisiblePages / 2))) {
        items.push(<Pagination.Ellipsis key={i} />);
      }
    }

    return items;
  };
  return (
    <>
      <div className="main-content">
        <Container fluid>
          <Row className="justify-content-center">
            <Col xs={12}>
              <div class="card">
                <div>
                  <KycDynamicHeader
                    title={"Ongoing Due Diligence"}
                    icon={
                      <>
                        <OverlayTrigger
                          overlay={<Tooltip>{tooltipMessage}</Tooltip>}
                        >
                          <FeatherIcon
                            icon="info"
                            size="20px"
                            style={{ marginRight: "500px" }}
                          />
                        </OverlayTrigger>
                      </>
                    }
                  />
                </div>
                <div className="mt-5 mb-5" style={{ display: "flex", flexDirection: "column",alignItems:'center' }}>
                  {" "}
                  <small
                    style={{ textAlign: "center", width:'60%' }}
                    className="text-muted"
                  >
                   One Constellation performs scans of your customer list against key sanction list and terrorist list tracked by OCscan engine. 
                   The system default scan frequency is set as daily. 
                   The Ongoing Due Diligences displays the historic audit trail of the daily scan performed. You can filter the list to display customers with hits only.
                  </small>

                </div>
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
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      marginTop: "10px",
                    }}
                  >
                    <Container fluid>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "2em",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            width: "30%",
                            justifyContent: "space-between",
                          }}
                        >
                          <Form.Group controlId="startDate">
                            <Flatpickr
                              placeholder="Select Start Date"
                              className="form-control"
                              options={{
                                dateFormat: formatDateRegionWise(null, null, true),
                              }}
                              value={selectedStartDate}
                              onChange={handleDateChangeStartDate}
                            />
                          </Form.Group>
                          <h3 style={{ margin: "6px" }}>To</h3>
                          <Form.Group controlId="endDate">
                            <Flatpickr
                              className="form-control"
                              placeholder="Select End Date.."
                              options={{
                                dateFormat: formatDateRegionWise(null, null, true),
                              }}
                              value={selectedEndDate}
                              onChange={handleDateChangeEndDate}
                              disabled={isEndDateDisabled}
                            />
                          </Form.Group>
                        </div>
                        <div style={{ display: "flex" }}>
                          <Form.Group controlId="inputField">
                            <Form.Control
                              type="text"
                              placeholder="Search by name"
                              value={searchName}
                              onChange={handleSearchName}
                            />
                          </Form.Group>
                          <span style={{ margin: "6px" }}>
                            <Search
                              size="20px"
                              onClick={handleSubmitSearchName}
                            />
                          </span>
                        </div>
                      </div>
                    </Container>

                    <Container fluid>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Form.Group>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "start",
                            }}
                          >
                            <div className="me-5 mb-2">
                              <Form.Check
                                type={"radio"}
                                label={"All"}
                                value={"ALL"}
                                checked={valueResult === "ALL"}
                                onChange={handleChangeResultFilter}
                              />
                            </div>
                            <div className="me-5 mb-2">
                              <Form.Check
                                type={"radio"}
                                label={"Individual"}
                                value={"INDIVIDUAL"}
                                checked={valueResult === "INDIVIDUAL"}
                                onChange={handleChangeResultFilter}
                              />
                            </div>
                            <div className="me-5 mb-2">
                              <Form.Check
                                type={"radio"}
                                label={"Corporate"}
                                value={"CORPORATE"}
                                checked={valueResult === "CORPORATE"}
                                onChange={handleChangeResultFilter}
                              />
                            </div>
                          </div>
                        </Form.Group>
                        <Form.Group>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "start",
                            }}
                          >
                            <div className="me-5 mb-2">
                              <Form.Check
                                type={"radio"}
                                label={"Both"}
                                value={"BOTH"}
                                checked={valueFilter === "BOTH"}
                                onChange={handleChangeResult}
                              />
                            </div>
                            <div className="me-5 mb-2">
                              <Form.Check
                                type={"radio"}
                                label={"Action Required"}
                                value={"ACTION_REQUIRED"}
                                checked={valueFilter === "ACTION_REQUIRED"}
                                onChange={handleChangeResult}
                              />
                            </div>
                            <div className="me-5 mb-2">
                              <Form.Check
                                type={"radio"}
                                label={"No Hit"}
                                value={"NO_HIT"}
                                checked={valueFilter === "NO_HIT"}
                                onChange={handleChangeResult}
                              />
                            </div>
                          </div>
                        </Form.Group>
                      </div>
                    </Container>
                  </div>
                )}
               
                <Row
                  style={{ marginTop: "2em" }}
                  className="justify-content-center"
                >
                  {console.log(dueDiligence,'dueDiligencedueDiligencedueDiligencedueDiligence')}
                  <Col xs={12}>
                    {!isLoader && (
                      <TableComponent
                        pagination={false}
                        columns={columns}
                        allData={dueDiligence}
                        searchable={false}
                        // pageNumberChangedCallback={pageNumberChangedCallback}
                      />
                    )}
                  </Col>
                </Row>

                <div style={{ display: "flex", justifyContent: "center", marginTop: "-1rem" }}>
                        <div >
                          <Pagination size="lg">
                            <Pagination.Prev
                              disabled={pageIndex === 0}
                              onClick={(e) => {
                                handleClickPrevious(e);
                              }}
                            />
                            {renderPageItems()}
                            <Pagination.Next
                              disabled={pageIndex === pageOptions.length - 1}
                              onClick={(e) => {
                                handleClickNext(e);
                              }}
                            />
                          </Pagination>
                        </div>
                      </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}
