import { Button, Col, Container, Form, Row, Nav, Dropdown } from "react-bootstrap";
import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { IndeterminateCheckbox } from "../../../../../../components/vendor";
import TableComponentScreening from "../../../../../shared-components/table-component-screening";
import { updateScreeningStatusAPI } from "../../../../../../api/network/AdministrationApi/AdministrationApi";
import axios from "axios";
import { format } from "date-fns";

export default function RestrictedList({ ...props }) {
  console.log(props, "props");
  console.log(props?.screeningDetail, "props?.screeningDetail");
  console.log(props?.screeningDetail?.restrictedList?.restrictedListResults, "props?.screeningDetail?.internetSearchResults");
  const params = useParams();
  const cancelTokenSource = axios.CancelToken.source();
  const [restrictedListResults, setRestrictedListResults] = useState(props?.screeningDetail?.internal_list?.restrictedListResults?.items ? props?.screeningDetail?.internal_list?.restrictedListResults?.items : []);


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
        accessor: "name",
      },

      {
        Header: "Country",
        accessor: "countryName",
      },
      {
        Header: "Date Of Birth",
        accessor: "dob",
        Cell: ({ value }) => <div>{format(new Date(value), "dd/MM/yyyy")}</div>,
      },
      {
        Header: "Identity Number",
        accessor: "identityNumber",
      },
      {
        Header: "Refrence Number",
        accessor: "referenceNumber",
      },
      {
        Header: "Status",
        accessor: "markedStatus",
        Cell: (props) => <div style={props?.cell.row.original?.markedStatus == "positive" ? { color: "green" } : { color: "red" }}>{props?.cell.row.original?.markedStatus == "not_set" ? "Not Set" : props?.cell.row.original?.markedStatus}</div>,
      },
    ],
    []
  );
  const handleMarkStatus = (e, status, selectedId, comment) => {
    const selectedIdAsString = selectedId.map((num) => num.toString());

    let dataToSend = {
      id: props?.screeningDetail?.restrictedList?.id,
      status: status,
      UpdateDocumentID: selectedIdAsString,
      comment: comment,
    };
    console.log("fata to send", dataToSend);
    updateStatus(dataToSend);
  };
  const updateStatus = async (dataToSend) => {
    const response = await updateScreeningStatusAPI(params?.fund_id, dataToSend, cancelTokenSource.token);
    if (response.success == true) {
      props?.refreshData(props?.screeningDetail?.id);
      setScreeningDowJonesData([]);
    } else {
      // setIsLoader(false)
      // console.log('Failed Response', response);
    }
  };
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
              pageNumberChangedCallback={pageNumberChangedCallback}
              currentPage={props?.currentPage}
              pagination={true}
              columns={columns}
              allData={restrictedListResults}
              handleMarkStatusFunction={handleMarkStatus}
              isRestrictedList={true}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
