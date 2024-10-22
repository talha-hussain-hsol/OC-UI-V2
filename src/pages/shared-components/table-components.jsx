import React, { useEffect, useState, useMemo } from "react";
import {
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table";
import FeatherIcon from "feather-icons-react";
import {
  Alert,
  Badge,
  Button,
  Card,
  CloseButton,
  Col,
  Dropdown,
  Form,
  InputGroup,
  ListGroup,
  Pagination,
  Row,
  Table,
  Container,
} from "react-bootstrap";
import className from "classnames";
import { IndeterminateCheckbox, Select } from "../../components/vendor";

export default function TableComponent({ ...props }) {
  const columns = props.columns;
  const { searchableCountry = false, pagination = true } = props;
  const data = useMemo(() => props.allData, []);
  console.log(data, "datatatatatatat");
  console.log(props, " propsdatatatatatatat");
  const pagesOptions = [
    { value: 5, label: "5 per page" },
    { value: 10, label: "10 per page" },
    { value: -1, label: "All" },
  ];

  const {
    getTableProps,
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
    state: { pageIndex, selectedRowIds, pageSize }, // Include pageSize in the state
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: props?.currentPage ? props?.currentPage : 0,
        pageSize: pagination ? 10 : -1,
      }, // Set initial page index and page size based on pagination prop
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

  // console.log(data, "datadatadatadatadatadatadata");
  console.log(previousPage, "previousPage");
  console.log(nextPage, "nextPage");
  console.log(page, "pagepagepage");

  return (
    <>
      <Card style={{ paddingTop: "30px" }}>
        <Card.Header>
          <Row className="align-items-center">
            {searchableCountry && (
              <Col>
                <InputGroup className="input-group-merge input-group-flush input-group-reverse">
                  <Form.Control
                    type="search"
                    placeholder="Search"
                    onChange={(e) =>
                      setGlobalFilter(
                        e.target.value ? e.target.value : undefined
                      )
                    }
                  />
                  <InputGroup.Text>
                    <FeatherIcon icon="search" size="1em" />
                  </InputGroup.Text>
                </InputGroup>
              </Col>
            )}
            {/* <Col xs="auto" className="me-n3">
              <Select options={pagesOptions} layout="flush" size="sm" />
            </Col> */}
          </Row>
        </Card.Header>
        <Table
          size="sm"
          className="card-table table-nowrap for-table-height"
          hover
          responsive
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps({ role: null })}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(
                      column.getSortByToggleProps({
                        className: className(
                          column.className,
                          column.canSort && "is-sortable"
                        ),
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
            {page.length > 0 ? (
              page.map((row, i) => {
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
              })
            ) : (
              <tr>
                <td colSpan="13" style={{ textAlign: "center" }}>
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        {pagination && (
          <Card.Footer className="d-flex justify-content-between">
            <Pagination className="card-pagination pagination-tabs">
              <Pagination.Item
                className="ps-0 pe-4 border-end"
                disabled={!canPreviousPage}
                onClick={() => previousPage()}
              >
                <FeatherIcon icon="arrow-left" size="1em" className="me-1" />{" "}
                Prev
              </Pagination.Item>
            </Pagination>
            <Pagination className="card-pagination pagination-tabs custom-pagination-tabs">
              {pageOptions.map((option, index) => (
                <Pagination.Item
                  key={index}
                  active={option === pageIndex}
                  onClick={() => gotoPage(option)}
                >
                  {option + 1}
                </Pagination.Item>
              ))}
            </Pagination>
            <Pagination className="card-pagination pagination-tabs">
              <Pagination.Item
                className="ps-4 pe-0 border-start"
                disabled={!canNextPage}
                onClick={() => nextPage()}
              >
                Next{" "}
                <FeatherIcon icon="arrow-right" size="1em" className="ms-1" />
              </Pagination.Item>
            </Pagination>
          </Card.Footer>
        )}
      </Card>

      {Object.keys(selectedRowIds).length > 0 && (
        <Alert variant="dark" className="list-alert alert-dismissible border">
          <Row className="align-items-center">
            <Col>
              <Form.Check
                type="checkbox"
                label={`${Object.keys(selectedRowIds).length} deal(s)`}
                checked
                disabled
              />
            </Col>
            <Col xs="auto" className="me-n3">
              <Button variant="white-20" size="sm">
                Edit
              </Button>
              <Button variant="white-20" size="sm" className="ms-1">
                Delete
              </Button>
            </Col>
          </Row>
          <CloseButton />
        </Alert>
      )}
    </>
  );
}
