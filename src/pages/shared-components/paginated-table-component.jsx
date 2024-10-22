import React, { useCallback, useMemo } from "react";
import {
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table";
// import FeatherIcon from "feather-icons-react";
import {
  Alert,
  Button,
  Card,
  CloseButton,
  Col,
  Pagination,
  Row,
  Table,
  Form,
} from "react-bootstrap";
import classNames from "classnames";

const PaginatedTableComponent = ({
  columns,
  allData,
  totalLimit,
  fetchPageData,
  pagination = true,
  isDomain = false,
  offset,
  setOffset,
  pageLimit = 10,
}) => {
  const data = useMemo(() => allData, [allData]);

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
    state: { selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      manualPagination: pagination, // Enable manual pagination
      pageCount: Math.ceil(totalLimit / pageLimit),
      // pageCount: Math.ceil((allData || []).length < pageLimit && offset ? (totalLimit/offset) :(totalLimit / (allData || []).length) || 1), // Calculate total pages
      initialState: {
        pageIndex: 0,
        pageSize: (allData || []).length || 1,
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
  );

  /**
    handlePageChange handles the page change from the numbers inside the table
    @Param: option => it includes the page number which is starting from 0
        For Example
        0 means 1 in a table
        1 means 2 in a table
  */

  const handlePageChange = useCallback(
    (option) => {
      gotoPage(option);
      if (pageOptions?.length > 1) {
        fetchPageData(option * pageLimit, pageLimit);
      }
      setOffset(option);
    },
    [fetchPageData, gotoPage, pageLimit, pageOptions?.length, setOffset]
  );

  const handleNext = useCallback(() => {
    nextPage();
    if (offset === 0) {
      fetchPageData(offset + pageLimit, pageLimit);
      setOffset(offset + 1);
    } else {
      fetchPageData((offset + 1) * pageLimit, pageLimit);
      setOffset(offset + 1);
    }
  }, [fetchPageData, nextPage, offset, pageLimit, setOffset]);

  const handlePrevious = useCallback(() => {
    previousPage();
    if (offset === 0) {
      fetchPageData(offset, pageLimit);
      setOffset(0);
    } else {
      fetchPageData(Math.abs(offset - 1) * pageLimit, pageLimit);
      setOffset(Math.abs(offset - 1));
    }
  }, [fetchPageData, offset, pageLimit, previousPage, setOffset]);

  return (
    <>
      <Card>
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
                        className: classNames(
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
                <td colSpan={columns.length}>No data available</td>
              </tr>
            )}
          </tbody>
        </Table>
        {pagination && (
          <Card.Footer className="d-flex justify-content-between">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "-1rem",
                width: "100%",
              }}
            >
              <Pagination size="lg">
                <Pagination.Prev
                  className="ps-0 pe-4 border-end"
                  disabled={offset === 0} // Fix: Correctly disable if on the first page
                  onClick={handlePrevious}
                >
                  Prev
                </Pagination.Prev>

                {/* Always show the first page */}
                <Pagination.Item
                  active={offset === 0}
                  onClick={() => handlePageChange(0)}
                >
                  1
                </Pagination.Item>

                {/* Show ellipses if we're far from the first page */}
                {offset > 9 && <Pagination.Ellipsis disabled />}

                {/* Show the range of pages around the current page */}
                {pageOptions
                  .slice(
                    Math.max(1, offset - 4),
                    Math.min(offset + 5, pageOptions.length - 1)
                  )
                  .map((option, index) => (
                    <Pagination.Item
                      key={index}
                      active={option === offset}
                      onClick={() => handlePageChange(option)}
                    >
                      {option + 1}
                    </Pagination.Item>
                  ))}

                {/* Show ellipses if we're far from the last page */}
                {offset < pageOptions.length - 10 && (
                  <Pagination.Ellipsis disabled />
                )}

                {/* Always show the last page */}
                {pageOptions.length > 1 && (
                  <Pagination.Item
                    active={offset === pageOptions.length - 1}
                    onClick={() => handlePageChange(pageOptions.length - 1)}
                  >
                    {pageOptions.length}
                  </Pagination.Item>
                )}

                <Pagination.Next
                  className="ps-4 pe-0 border-start"
                  disabled={offset === pageOptions.length - 1} // Fix: Correctly disable if on the last page
                  onClick={handleNext}
                >
                  Next
                </Pagination.Next>
              </Pagination>
            </div>
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
};
export default React.memo(PaginatedTableComponent);
