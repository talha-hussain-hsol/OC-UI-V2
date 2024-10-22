import React from "react";
import { Pagination } from "react-bootstrap";

const pagination = ({
  pageIndex,
  totalPages,
  handleClickPrevious,
  handleClickNext,
  setPageIndex,
  setOffset,
  limit,
}) => {
  const maxVisiblePages = 5;

  const renderPageItems = () => {
    let items = [];

    for (let i = 0; i < totalPages; i++) {
      if (
        i === 0 ||
        i === totalPages - 1 ||
        i === pageIndex ||
        (i >= pageIndex - Math.floor(maxVisiblePages / 2) &&
          i <= pageIndex + Math.floor(maxVisiblePages / 2))
      ) {
        items.push(
          <Pagination.Item
            key={i}
            active={i === pageIndex}
            onClick={(e) => {
              e.preventDefault();
              setPageIndex(i);
              setOffset(i * limit);
            }}
          >
            {i + 1}
          </Pagination.Item>
        );
      } else if (
        (i === pageIndex - Math.floor(maxVisiblePages / 2) - 1 &&
          pageIndex > Math.floor(maxVisiblePages / 2)) ||
        (i === pageIndex + Math.floor(maxVisiblePages / 2) + 1 &&
          pageIndex < totalPages - Math.floor(maxVisiblePages / 2))
      ) {
        items.push(<Pagination.Ellipsis key={i} />);
      }
    }

    return items;
  };

  return (
    <Pagination size="lg">
      <Pagination.Prev
        disabled={pageIndex === 0}
        onClick={handleClickPrevious}
      />
      {renderPageItems()}
      <Pagination.Next
        disabled={pageIndex >= totalPages - 1}
        onClick={handleClickNext}
      />
    </Pagination>
  );
};

export default pagination;
