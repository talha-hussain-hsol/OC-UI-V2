import React, { useMemo, useState, useEffect } from 'react';
import {
  Col,
  Row,
  Container,
  Spinner,
  Button,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import FeatherIcon from 'feather-icons-react';
import axios from "axios";
import { getQuickScanListAPI, postQuickScanAPI, DownloadQuickScanAllReportAPI } from "../../../../../api/network/AdministrationApi/AdministrationApi";
import { Link, useParams } from 'react-router-dom'
import KycDynamicHeader from '../../../../../widgets/KycDynamicHeader'
import QuickScanOption from './quickScanOption'
import TableComponent from "../../../../shared-components/table-components";
import { FaSync } from 'react-icons/fa';
import formatDateRegionWise from './../../../../../helpers/formatDateRegionWise';
export default function QuickScanList({ ...props }) {
  const params = useParams();
  const cancelTokenSource = axios.CancelToken.source();
  const [quickScanList, setQuickScanList] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // Add currentPage state


  useEffect(function () {
    if (params?.fund_id) {
      getQuickScanList()
    }
  }, []);
  const getQuickScanList = async () => {
    setIsLoader(true)
    const response = await getQuickScanListAPI(
      params?.fund_id,
      cancelTokenSource.token
    )
    setIsLoader(false)
    if (response.success == true) {
      setQuickScanList([])
      setTimeout(function () {
        setQuickScanList(response?.data?.quickScanList)
      }, 200)

      checkIfStatusPending(response?.data?.quickScanList)
    } else {
    }
  }
  const getQuickScanListPolling = async () => {
    const response = await getQuickScanListAPI(
      params?.fund_id,
      cancelTokenSource.token
    )
    if (response.success == true) {
      setQuickScanList([])
      setTimeout(function () {
        setQuickScanList(response?.data?.quickScanList)
      }, 200)

      checkIfStatusPending(response?.data?.quickScanList)
    } else {
    }
  }
  const handleRefreshList = () => {
    console.log("refresh called")
    getQuickScanList()
  }

  const pageNumberChangedCallback = (index) => {
    setCurrentPage(index)
    console.log("pageNumberChangedCallback index", index)
  }
  const checkIfStatusPending = (data) => {
    console.log(data, "data data")
    if (data) {
      let poll = []
      for (let a = 0; a < data.length; a++) {
        console.log(data[a]?.screenProcessed, "data[a]?.screenProcessed")
        if (!data[a]?.screenProcessed) {
          poll.push(data[a]?.id)
        }
      }
      console.log(poll, "poll")
      if (poll.length > 0) {
        setTimeout(function () {
          getQuickScanListPolling()
        }, 60000)
      }
    }
  }

  const handleRescreen = (row) => {
    console.log("row", row)
    let dataToSend = {
      advanced: { worldCheck: { individual: {} } },
      name: row?.name,
      internetSearchCheck: row?.internetSearch ? true : false,
      restrictedList: row?.restrictedList ? true : false,
      worldCheck: row?.worldCheck?.id ? true : false,
      dowJones: false,
      factiva: false,
      customerType: row?.customerType == 1 ? "INDIVIDUAL" : "CORPORATE",
      // advanced: advanceData,
    }

    SubmitQuickScan(dataToSend)
  }
  const handleDownloadReport = async (row) => {
    const result = [
      row?.worldCheck ||
        row?.dowJones
        ? "Sanction_List, "
        : "",
      row?.internetSearch
        ? "Adverse_Media_News, "
        : "",
      row?.restrictedList ? "Internal_List" : ""

    ]
      .join("")
      .trim()

    const downloadObject = {
      "Adverse_Media_News": result.includes("Adverse_Media_News"),
      "Sanction_List": result.includes("Sanction_List"),
      "Internal_List": result.includes("Internal_List"),
    };

    // Example: Log or use the downloadObject as needed
    console.log("rowdsds handleDownloadReport Object:", downloadObject);


    console.log("rowdsds handleDownloadReport", row)
    console.log("rowdsds handleDownloadReport result", typeof (result))
    setIsLoader(true)

    const response = await DownloadQuickScanAllReportAPI(
      params?.fund_id,
      row?.id,
      downloadObject,
      cancelTokenSource.token
    )
    setIsLoader(false)
    if (response.success == true) {
      window.open(response?.data?.getSignedUrl, "_blank");

    } else {
    }
  }
  const SubmitQuickScan = async (data) => {
    setIsLoader(true)

    const response = await postQuickScanAPI(
      params?.fund_id,
      data,
      cancelTokenSource.token
    )
    setIsLoader(false)
    if (response.success == true) {
      handleRefreshList()
    } else {
    }
  }
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Customer Type",
        accessor: "customerType",
        Cell: ({ value }) => (
          <div>
            {value === 1 ? (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-user">Individual</Tooltip>}
              >
                <span>
                  <FeatherIcon icon="user" size="15" />
                </span>
              </OverlayTrigger>
            ) : (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-briefcase">Corporate</Tooltip>}
              >
                <span>
                  <FeatherIcon icon="briefcase" size="15" />
                </span>
              </OverlayTrigger>
            )}
          </div>
        ),
      },

      {
        Header: "Search Engines",
        accessor: "quick_scan",
        Cell: (props) => {
          const result = [
            props.cell.row.original?.worldCheck ||
              props.cell.row.original?.dowJones
              ? "Sanction List, "
              : "",
            props.cell.row.original?.internetSearch
              ? "Adverse Media News, "
              : "",
            props.cell.row.original?.restrictedList ? "Internal List" : "",
            props.cell.row.original?.factivaList ? "Factiva" : "",
          ]
            .join("")
            .trim()

          return <>{result}</>
        },
      },

      {
        Header: "Created At",
        accessor: "created_at",
        Cell: ({ value }) => <div>{formatDateRegionWise(value)}</div>,
      },
      {
        Header: "Last Screened",
        accessor: "updated_at",
        Cell: ({ value }) => <div>{dateTimeFormat(value)}, UTC</div>,
      },
      {
        Header: "Status",
        accessor: "screenProcessed",
        Cell: ({ value }) => (
          <div>
            {value ? (
              <p>Processed</p>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                }}
              >
                <div style={{ marginRight: "2em" }}>Calculating...</div>{" "}
                <Spinner animation="border" variant="primary" />
              </div>
            )}
          </div>
        ),
      },
      {
        Header: "Action",
        Cell: (props) => (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <OverlayTrigger overlay={<Tooltip>Download</Tooltip>}>
                <Button
                  onClick={() => handleDownloadReport(props.cell.row.original)}
                  variant="outlined"
                  disabled={!props.cell.row.original?.screenProcessed}
                >
                  {" "}
                  <FeatherIcon size="15px" icon="download" color={'#2c7be5'} />
                </Button>
              </OverlayTrigger>

              <Link
                to={`/${params?.fund_id}/kyc/quick-scan-detail/${props.cell.row.original?.id}`}
              >
                <FeatherIcon size="15px" icon="edit" />
              </Link>

              {/* <Button onClick={() => handleRescreen(props.cell.row.original)} variant='primary'>
                        <FaSync />
                        </Button> */}

              {/* <FaTrash style={{ color: '#e50f36' }} onClick={() => handleRescreen(props.cell.row.original)} variant='primary'>
                        </FaTrash> */}

              <OverlayTrigger overlay={<Tooltip>Re Screen</Tooltip>}>
                <Button
                  onClick={() => handleRescreen(props.cell.row.original)}
                  variant="outlined"
                >
                  {" "}
                  <FaSync
                    style={{ color: "#0ca232" }}
                    variant="primary"
                  ></FaSync>
                </Button>
              </OverlayTrigger>
            </div>
          </>
        ),
      },
    ],
    []
  )
  const dateFormate = (dataDate) => {
    const dateString = dataDate
    const date = new Date(dateString)
    const formattedDate = date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    return formattedDate
  }
  const dateTimeFormat = (dataDate) => {
    const dateString = dataDate
    const date = new Date(dateString)

    const options = {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
      timeZone: "UTC", // Replace with the appropriate time zone for UAT
    }

    const formattedDateTime = date.toLocaleDateString("en-US", options)
    return formattedDateTime
  }

  return (
    <>
      <div className="main-content">
        <Container fluid>
          <Row className="justify-content-center">
            <Col xs={12}>
              <div class="card">
                <KycDynamicHeader title={"Quick Scan"} />
                <QuickScanOption handleRefresh={handleRefreshList} />
              </div>
              <div class="card">
                {isLoader ?
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "20rem" }}>
                    <Spinner animation="grow" variant='primary' />
                  </div>
                  : null}
                {quickScanList.length > 0 ?
                  <TableComponent
                    pagination={true}
                    columns={columns}
                    allData={quickScanList}
                    pageNumberChangedCallback={pageNumberChangedCallback}
                    currentPage={currentPage}
                  />
                  : null
                }
              </div>
            </Col>
          </Row>
        </Container>
      </div>


    </>
  );
}