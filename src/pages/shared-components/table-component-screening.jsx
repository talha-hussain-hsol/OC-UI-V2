import React, { useEffect, useState, useMemo } from "react";
import { useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from "react-table";
import FeatherIcon from "feather-icons-react";
import { Alert, Badge, Button, Card, CloseButton, Col, Dropdown, Form, InputGroup, ListGroup, Pagination, Row, Table, Container, Modal } from "react-bootstrap";
import className from "classnames";
import { IndeterminateCheckbox, Select } from "../../components/vendor";

export default function TableComponentScreening({ ...props }) {
  console.log(props?.pagination, 'pagination props')
  const columns = props.columns;
  console.log("props.allData", props.allData)
  const data = useMemo(() => props.allData, []);
  const [status, setStatus] = useState("");
  const [openModel, setOpenModel] = useState(false);
  const [comment, setComment] = useState("");
  const [alert, setAlert] = useState(false);
  const [selectedIdData, setSelectedIdData] = useState([]);
  const maxCharacters = 1000;
  const pagesOptions = [
    { value: 5, label: "5 per page" },
    { value: 10, label: "10 per page" },
    { value: -1, label: "All" },
  ];

  var {
    canNextPage,
    canPreviousPage,
    getTableBodyProps,
    gotoPage,
    headerGroups,
    nextPage,
    page,
    pageOptions,
    prepareRow,
    previousPage,
    setGlobalFilter,
    rows,
    state: { pageIndex, selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: props?.currentPage ? props?.currentPage : 0, pageSize: props?.pagination ? 5 : -1 }, // Set initial page index and page size based on pagination prop
      onPageChange: (pageIndex) => {
        props?.pageNumberChangedCallback(pageIndex); // Call the callback function with the updated pageIndex
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
  );
  useEffect(() => {
    props?.pageNumberChangedCallback(pageIndex);
  }, [pageIndex, props?.pageNumberChangedCallback]);
  console.log("props?.currentPageprops?.currentPage",props?.currentPage)

  var selectedUserIds = Object.keys(selectedRowIds).map((id) => rows[id].original.peid);
  if (props?.isInterNetSearch) {
    selectedUserIds = Object.keys(selectedRowIds).map((id) => rows[id].original.referenceUpdateId);
  }

  if (props?.isRestrictedList) {
    selectedUserIds = Object.keys(selectedRowIds).map((id) => console.log('rows[id].original,rows[id].original', rows[id].original));
    selectedUserIds = Object.keys(selectedRowIds).map((id) => rows[id].original.id);
  }
  if (props?.isWorldCheck) {
    selectedUserIds = Object.keys(selectedRowIds).map((id) => rows[id].original.resultId);
  }

  console.log(selectedRowIds, "selectedRowIds our");
  const handleMarkStatus = (e, status, selectedId) => {
    console.log(status, "status");
    console.log(selectedId, "selectedId");
    setStatus(status);
    setOpenModel(true);
  };
  const handleMarkStatusFunction = (e, status, selectedUserIds, comment) => {
    setOpenModel(false);
    console.log(selectedRowIds, "selectedRowIds");
    props?.handleMarkStatusFunction(e, status, selectedUserIds, comment);
    selectedRowIds = null;
    selectedUserIds = [];
  };
  const handleChangeComment = (e) => {
    if (e.target.value.length <= maxCharacters) {
      setComment(e.target.value);
    }
  }
  return (
    <>
      <Card>
        <Card.Header>
          <Row className="align-items-center">
            {/* <Col>
              <InputGroup className="input-group-merge input-group-flush input-group-reverse">
                <Form.Control type="search" placeholder="Search" onChange={(e) => setGlobalFilter(e.target.value ? e.target.value : undefined)} />
                <InputGroup.Text>
                  <FeatherIcon icon="search" size="1em" />
                </InputGroup.Text>
              </InputGroup>
            </Col> */}
            {/* <Col xs="auto" className="me-n3">
                            <Select options={pagesOptions} layout="flush" size="sm" />
                        </Col> */}
          </Row>
        </Card.Header>
        <Table size="sm" className="card-table table-nowrap" hover responsive>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps({ role: null })}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(
                      column.getSortByToggleProps({
                        className: className(column.className, column.canSort && "is-sortable"),
                        role: null,
                      })
                    )}
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="fs-base" {...getTableBodyProps({ role: null })}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps({ role: null })}>
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps({
                          className: cell.column.className,
                          role: null,
                        })}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {props?.allData.length <= 0 && (

              <tr style={{ textAlign: "center" }}>
                <td colSpan={columns.length}>No data available.</td>
              </tr>

            )}
          </tbody>
        </Table>
        {props?.pagination &&
          <Card.Footer className="d-flex justify-content-between">
            <Pagination className="card-pagination pagination-tabs">
              <Pagination.Item className="ps-0 pe-4 border-end" disabled={!canPreviousPage} onClick={() => previousPage()}>
                <FeatherIcon icon="arrow-left" size="1em" className="me-1" /> Prev
              </Pagination.Item>
            </Pagination>
            <Pagination className="card-pagination pagination-tabs" style={{ overflowX: "auto" }}>
              {pageOptions.map((option, index) => (
                <Pagination.Item key={index} active={option === pageIndex} onClick={() => gotoPage(option)}>
                  {option + 1}
                </Pagination.Item>
              ))}
            </Pagination>
            <Pagination className="card-pagination pagination-tabs">
              <Pagination.Item className="ps-4 pe-0 border-start" disabled={!canNextPage} onClick={() => nextPage()}>
                Next <FeatherIcon icon="arrow-right" size="1em" className="ms-1" />
              </Pagination.Item>
            </Pagination>
          </Card.Footer>
        }
      </Card>

      {Object.keys(selectedRowIds).length > 0 && (
        <Alert variant="dark" className="list-alert alert-dismissible border">
          <Row className="align-items-center">
            <Col>
              <Form.Check type="checkbox" label={`${Object.keys(selectedRowIds).length} row(s)`} checked disabled />
            </Col>
            <Col xs="auto" className="me-n3">
              <Button
                variant="white-20"
                size="sm"
                onClick={(e) => {
                  handleMarkStatus(e, "positive", selectedUserIds);
                }}
              >
                {props?.isInterNetSearch ? "Matched" : "Mark Positive"}
              </Button>
              <Button
                variant="white-20"
                size="sm"
                className="ms-1"
                onClick={(e) => {
                  handleMarkStatus(e, "negative", selectedUserIds);
                }}
              >
                {props?.isInterNetSearch ? "Not Matched" : " Mark Negative"}

              </Button>
            </Col>
          </Row>
          <CloseButton />
        </Alert>
      )}
      <Modal
        show={openModel}
        onHide={(e) => {
          setOpenModel(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <div>
              <h3>Enter Comment</h3>
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="show-grid">
          <Container>
            <Row>
              <Col xs={12} md={12}>
                <textarea
                  className="form-control"
                  name="comment"
                  id="comment"
                  onChange={(e) => {
                    handleChangeComment(e)
                    // setComment(e.target.value);
                  }}
                  rows={5}
                  maxLength={maxCharacters}
                >
                  {comment}
                </textarea>
                <p>
                  {maxCharacters - comment.length}/{maxCharacters}
                </p>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={(e) => {
              handleMarkStatusFunction(e, status, selectedUserIds, comment);
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
