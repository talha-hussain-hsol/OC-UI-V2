import {
    Button,
    Col,
    Container,
    Row,
  } from "react-bootstrap"
  import React, { useState, useMemo } from "react"
  import { useParams } from "react-router-dom"
  import {
    IndeterminateCheckbox,
  } from "../../../../../../components/vendor"
  import TableComponentScreening from "../../../../../shared-components/table-component-screening"
  import {
    updateScreeningStatusAPI,
  } from "../../../../../../api/network/AdministrationApi/AdministrationApi"
  import axios from "axios"
  
  export default function InternetSearch({ ...props }) {
    console.log(props, "props")
    console.log(props?.screeningDetail, "props?.screeningDetail")
    console.log(
      props?.screeningDetail?.internetSearchResults,
      "props?.screeningDetail?.internetSearchResults"
    )
    const params = useParams()
    const cancelTokenSource = axios.CancelToken.source()
    const [screeningInternetSearchData, setScreeningInternetSearchData] =
      useState(props?.screeningDetail?.adverse_media_news?.internetSearchResults)
  
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
          Header: "Link Detail",
          accessor: "title",
          Cell: (props) => (
            <>
              <a target="_blank" href={props?.cell.row.original?.link}>
                {props?.cell.row.original?.title
                  .split(/\s+/)
                  .slice(0, 8)
                  .join(" ") + "..."}
              </a>
              <br />
              {props?.cell.row.original?.summary
                .split(/\s+/)
                .slice(0, 10)
                .join(" ") + "..."}
            </>
          ),
        },
        {
          Header: "Most Relevant Name",
          accessor: "link",
          Cell: (propsData) => (
            <>
              <p>{props?.screeningDetail?.name}</p>
            </>
          ),
        },
        {
          Header: "Comment",
          accessor: "comment",
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
                : props?.cell.row.original?.markedStatus == "positive"
                ? "Matched"
                : "Not Matched"}
            </div>
          ),
        },
      ],
      []
    )
    const handleMarkStatus = (e, status, selectedId, comment) => {
      let dataToSend = {
        id: props?.screeningDetail?.adverse_media_news?.id,
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
        //   setScreeningDowJonesData([])
      } else {
        // setIsLoader(false)
        // console.log('Failed Response', response);
      }
    }
    const pageNumberChangedCallback = (index) => {
      props?.handleCurrentPage(index);
      console.log("pageNumberChangedCallback index", index);
    };
    return (
      <div className="main-content">
        <Container fluid>
          <Row className="justify-content-center">
            <Col xs={12} lg={12} xl={12}>
              <TableComponentScreening
                pagination={true}
                columns={columns}
                pageNumberChangedCallback={pageNumberChangedCallback}
                currentPage={props?.currentPage}
                allData={props?.screeningDetail?.adverse_media_news == undefined ? [] :screeningInternetSearchData}
                handleMarkStatusFunction={handleMarkStatus}
                isInterNetSearch={true}
              />
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
  