import {
    Button,
    Col,
    Container,
    Form,
    Row,
    Nav,
    Dropdown,
    Modal,
    Table,
  } from "react-bootstrap"
  import React, { useState, useEffect, useMemo } from "react"
  import { useParams } from "react-router-dom"
  import {IndeterminateCheckbox} from "../../../../../../components/vendor"
  import TableComponentScreening from "../../../../../shared-components/table-component-screening"
  import FeatherIcon from "feather-icons-react"
  import {
    updateScreeningStatusAPI,
    getSingleWorldCheckResultAPI,
    getDownloadQuickScanReportAPI,
  } from "../../../../../../api/network/AdministrationApi/AdministrationApi"
  import axios from "axios"
//   import LoadingSpinner from "../../../../../../widgets/bootstrap-component/Spinner"
import Loader from "../../../../../../components/ui/loader"
//   import { MdFormatListBulleted } from "react-icons/md"
  
  export default function worldCheck({ ...props }) {
    console.log(
      props?.screeningDetail,
      "props?.screeningDetail props?.screeningDetail"
    )
    const cancelTokenSource = axios.CancelToken.source()
    const params = useParams()
    console.log(params, "params params params")
    const [screeningWorldCheckData, setScreeningWorldCheckData] = useState(null)
    const [screeningDowJonesDetailData, setScreeningDowJonesDetailData] =
      useState(null)
    const [isLoader, setIsLoader] = useState(true)
    const [modal, setModal] = useState(false)
    const [isDownload, setIsDownload] = useState(false)
    const [gender, setGender] = useState(null)
    const [events, setEvents] = useState([])
  
    useEffect(
      function () {
        if (screeningDowJonesDetailData) {
          setModal(true)
          if (isDownload) {
            setTimeout(function () {
              let elementToPrint = document.getElementById("printablediv")
              let newWin = window.open("", "_blank")
              newWin.document.write(elementToPrint.innerHTML)
              newWin.print()
              newWin.close()
              setModal(false)
            }, 1000)
          }
        }
      },
      [screeningDowJonesDetailData]
    )
    useEffect(
      function () {
        let screeningData = []
        console.log("props?.screeningDetail", props?.screeningDetail)
        if (props?.screeningDetail) {
          setIsLoader(true)
  
          let screeningDataSepcific = null
          if (props?.screeningDetail?.section_list) {
            for (let a of props?.screeningDetail?.section_list) {
              if (a?.records?.results?.results) {
                for (let b of a?.records?.results?.results) {
                  screeningDataSepcific = b
                  screeningDataSepcific["screening_type"] = a?.screening_type
                  screeningData.push(screeningDataSepcific)
                }
              }
            }
            setIsLoader(false)
          } else {
            setIsLoader(false)
          }
          console.log(screeningData, "screeningData")
          setScreeningWorldCheckData(screeningData)
        }
      },
      [props?.screeningDetail]
    )
  
    const columns = useMemo(
      () => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
  
        {
          Header: "Name",
          accessor: "matchedTerm",
        },
        {
          Header: "category",
          accessor: "category",
          // Cell: props => { props?.cell.row.original?.primary_name?.first_name + ' ' + props?.cell.row.original?.primary_name?.middle_name ? props?.cell.row.original?.primary_name?.middle_name : '' + ' ' + props?.cell.row.original?.primary_name?.last_name }
        },
        {
          Header: "Country",
          accessor: "countryLinks",
          Cell: (props) => {
            props?.cell.row.original?.countryLinks &&
              props?.cell.row.original?.countryLinks.map((item, index) => (
                <div>
                  <p>
                    <span>{item?.countryText + " Type:" + item?.type}</span>
                  </p>
                </div>
              ))
          },
        },
        {
          Header: "% Match",
          accessor: "matchScore",
        },
        {
          Header: "Date Detail",
          accessor: "events",
          // Cell: props => { props?.cell.row.original?.events?.map((item, index) => (item?.year + ' ')) }
          Cell: (props) => {
            props?.cell.row.original?.events?.map(
              (item, index) => item?.year + " "
            )
          },
        },
  
        {
          Header: "Status",
          accessor: "markedStatus",
          Cell: (props) => (
            <div
              style={
                props?.cell.row.original?.markedStatus == "positive"
                  ? { color: "green" }
                  : { color: "red" }
              }
            >
              {props?.cell.row.original?.markedStatus == "not_set"
                ? "Not Set"
                : props?.cell.row.original?.markedStatus}
            </div>
          ),
        },
        {
          id: "actions",
          disableSortBy: true,
          Cell: (props) => (
            <Dropdown align="end">
              <Dropdown.Toggle
                as="span"
                className="dropdown-ellipses"
                role="button"
              >
                <FeatherIcon icon="more-vertical" size="17" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {/* <Dropdown.Item href="#!" onClick={(e) => { handleDownload(props?.cell.row.original?.referenceId) }}>Download</Dropdown.Item> */}
                <Dropdown.Item
                  href="#!"
                  onClick={(e) => {
                    handleViewSingleDowJonesData(
                      props?.cell.row.original?.referenceId
                    )
                  }}
                >
                  View
                </Dropdown.Item>
                <Dropdown.Item
                  href="#!"
                  onClick={(e) => {
                    handleDownloadQuickScanReport(
                      props?.cell.row.original?.referenceId
                    )
                  }}
                >
                  Download
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ),
        },
      ],
      []
    )
    const years = events?.map((event) => event?.year)
    const handleDownload = async (id) => {
      setScreeningDowJonesDetailData(null)
      setIsLoader(true)
      const response = await getSingleWorldCheckResultAPI(
        params.fund_id,
        id,
        cancelTokenSource.token
      )
      setIsLoader(false)
      if (response.success == true) {
        setScreeningDowJonesDetailData(response?.data)
        setIsDownload(true)
      } else {
      }
    }
    const handleViewSingleDowJonesData = async (id) => {
      setScreeningDowJonesDetailData(null)
      setIsLoader(true)
      const response = await getSingleWorldCheckResultAPI(
        params.fund_id,
        id,
        cancelTokenSource.token
      )
      setIsLoader(false)
      if (response.success == true) {
        setScreeningDowJonesDetailData(response?.data)
        setGender(response?.data?.gender)
        setEvents(response?.data?.events)
      } else {
      }
    }
    const handleDownloadQuickScanReport = async (id) => {
      setIsLoader(true)
      const response = await getDownloadQuickScanReportAPI(
        params.fund_id,
        params?.quick_scan_detail_id,
        id,
        cancelTokenSource.token
      )
      setIsLoader(false)
      if (response.success == true) {
        window.open(response?.data, "_blank").focus()
      } else {
      }
    }
    const handleMarkStatus = (e, status, selectedId, comment) => {
      let dataToSend = {
        id: props?.screeningDetail?.section_list[0]?.id,
        status: status,
        UpdateDocumentID: selectedId,
        comment: comment,
      }
      updateStatus(dataToSend)
    }
    const updateStatus = async (dataToSend) => {
      const response = await updateScreeningStatusAPI(
        params?.fund_id,
        dataToSend,
        cancelTokenSource.token
      )
      if (response.success == true) {
        props?.refreshData(props?.screeningDetail?.id)
        setScreeningDowJonesData([])
      } else {
        // setIsLoader(false)
        // console.log('Failed Response', response);
      }
    }
    const handleClose = () => {
      setModal(false)
    }
    const pageNumberChangedCallback = (index) => {
      props?.handleCurrentPage(index)
      console.log("pageNumberChangedCallback index", index)
    }
  
    return (
      <div className="main-content">
        {console.log(screeningWorldCheckData, "screeningWorldCheckData")}
        <Container fluid>
          <Row className="justify-content-center">
            {isLoader ? (
              <Loader custom={true} />
            ) : (
              <Col xs={12} lg={12} xl={12}>
                {screeningWorldCheckData?.length > 0 ? (
                  <TableComponentScreening
                    pageNumberChangedCallback={pageNumberChangedCallback}
                    currentPage={props?.currentPage}
                    pagination={true}
                    columns={columns}
                    allData={screeningWorldCheckData}
                    handleMarkStatusFunction={handleMarkStatus}
                    isWorldCheck={true}
                  />
                ) : (
                  <TableComponentScreening
                    pageNumberChangedCallback={pageNumberChangedCallback}
                    currentPage={props?.currentPage}
                    pagination={true}
                    columns={columns}
                    allData={[]}
                    handleMarkStatusFunction={handleMarkStatus}
                    isWorldCheck={true}
                  />
                )}
              </Col>
            )}
          </Row>
        </Container>
        <Modal
          size="xl"
          show={modal}
          onHide={handleClose}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>WORLD CHECK DETAIL</Modal.Title>
          </Modal.Header>
          <Modal.Body className="show-grid">
            <Container id="printablediv">
              <div className="row">
                <div className="at-thememodal">
                  <div className={"space-between"}>
                    <h2 id={"screeningWorldCheckDetailH2"}>
                      {" "}
                      {screeningDowJonesDetailData?.name}
                    </h2>
                  </div>
                  <div className={""}>
                    <div className={"screeningWorldCheckDetailSection"}>
                      <Table className="table table-sm table-nowrap card-table">
                        <tbody>
                          <tr>
                            <th scope="row">PRIMARY NAME</th>
                            <td className="display-5">
                              {screeningDowJonesDetailData?.names[0]?.fullName}
                            </td>
                          </tr>
  
                          {gender ? (
                            <tr>
                              <th scope="row">Gender</th>
                              <td className="display-5">{gender}</td>
                            </tr>
                          ) : null}
  
                          <tr>
                            <th scope="row">Category</th>
                            <td className="display-5">
                              {screeningDowJonesDetailData?.category}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
  
                    <div className={"screeningWorldCheckDetailSection"}>
                      <h2 className={"screeningWorldCheckDetailSectionH2"}>
                        Name Detail
                      </h2>
  
                      <div class="table-responsive">
                        <table class="table table-sm table-nowrap card-table">
                          <thead>
                            <tr>
                              <th>Title</th>
                              <th>Detail Type</th>
                              <th>Text</th>
                            </tr>
                          </thead>
                          <tbody>
                            {screeningDowJonesDetailData?.details?.map(
                              (item, index) => {
                                return (
                                  <tr>
                                    <td>{item?.title}</td>
                                    <td>{item?.detailType}</td>
                                    <td>{item?.text}</td>
                                  </tr>
                                )
                              }
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {/* <div className={"screeningWorldCheckDetailSection"}>
                                          <h2 className={"screeningWorldCheckDetailSectionH2"}>RISKS</h2>
                                          <div style={{ display: "flex", justifyContent: "start" }}>
                                              {screeningDowJonesDetailData?.attributes?.person?.icon_hints?.map((item, index) => {
                                                  return (
                                                      <h3 style={{ marginRight: "13%" }} className={"screeningWorldCheckDetailSectionH3"}>
                                                          {item}
                                                      </h3>
                                                  );
                                              })}
                                          </div>
                                      </div> */}
  
                    <div
                      className={"screeningWorldCheckDetailSection"}
                      style={{ padding: "20px" }}
                    >
                      <h2 className={"screeningWorldCheckDetailSectionH2"}>
                        Country Links
                      </h2>
  
                      <div className="row">
                        <table className="table table-sm table-nowrap card-table">
                          <tbody>
                            {screeningDowJonesDetailData?.countryLinks?.map(
                              (item, index) => (
                                <tr key={index}>
                                  <th scope="row">{item?.type}</th>
                                  <td>{item?.countryText}</td>
                                </tr>
                              )
                            )}
                          </tbody>
  
                          {events ? (
                            <tbody>
                              <tr>
                                <th scope="row">{events && events[0]?.type}</th>
  
                                <td>{years && years?.join(", ")}</td>
                              </tr>
                            </tbody>
                          ) : null}
                        </table>
                      </div>
                    </div>
                    <div className={"screeningWorldCheckDetailSection"}>
                      <h2 className={"screeningWorldCheckDetailSectionH2"}>
                        Sources
                      </h2>
                      <div class="table-responsive">
                        <table class="table table-sm table-nowrap card-table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Type</th>
                              <th>Description</th>
                              <th>Abbreviation</th>
                              <th>Provider Source Status</th>
                              <th>Region Of Authority</th>
                              <th>Subscription Category</th>
                            </tr>
                          </thead>
                          <tbody>
                            {screeningDowJonesDetailData?.sources?.map(
                              (item, index) => {
                                return (
                                  <tr>
                                    <td>{item?.name}</td>
                                    <td>{item?.type?.name}</td>
                                    <td>{item?.type?.category?.description}</td>
                                    <td>{item?.abbreviation}</td>
                                    <td>{item?.providerSourceStatus}</td>
                                    <td>{item?.regionOfAuthority}</td>
                                    <td>{item?.subscriptionCategory}</td>
                                  </tr>
                                )
                              }
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className={"screeningWorldCheckDetailSection"}>
                      <h2 className={"screeningWorldCheckDetailSectionH2"}>
                        Web Links
                      </h2>
  
                      {screeningDowJonesDetailData?.weblinks?.map(
                        (item, index) => {
                          return (
                            <h3
                              className={"screeningWorldCheckDetailSectionH3"}
                              style={{ marginBottom: "10px", overflow: "hidden" }}
                            >
                              <a
                                target="_blank"
                                className={"dowJonesLink"}
                                href={item?.uri}
                              >
                                {item?.uri}
                              </a>
                            </h3>
                          )
                        }
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setModal(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
  