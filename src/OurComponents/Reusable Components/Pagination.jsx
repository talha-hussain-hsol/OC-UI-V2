import React from "react";
import { useTheme } from "../../contexts/themeContext";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";

const Pagination = ({
  pageIndex,
  totalPages,
  handleClickPrevious,
  handleClickNext,
  setPageIndex,
  setOffset,
  limit,
}) => {
  const maxVisiblePages = 5;
  const { theme } = useTheme();

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
          <button
            key={i}
            className={`px-6 py-3 border-x border-color-${theme}  ${
              i === pageIndex
                ? `bg-color-button-${theme} text-white`
                : `bg-color-pagination-${theme} text-color-icon-text-${theme} font-thin hover:bg-color-pagination-hover-${theme} transition duration-300 ease-in-out `
            }`}
            onClick={(e) => {
              e.preventDefault();
              setPageIndex(i);
              setOffset(i * limit);
            }}
          >
            {i + 1}
          </button>
        );
      } else if (
        (i === pageIndex - Math.floor(maxVisiblePages / 2) - 1 &&
          pageIndex > Math.floor(maxVisiblePages / 2)) ||
        (i === pageIndex + Math.floor(maxVisiblePages / 2) + 1 &&
          pageIndex < totalPages - Math.floor(maxVisiblePages / 2))
      ) {
        items.push(
          <span
            key={i}
            className={`bg-color-pagination-${theme} hover:bg-color-pagination-hover-${theme} text-color-icon-text-${theme} px-6 py-3 transition duration-300 ease-in-out`}
          >
            ...
          </span>
        );
      }
    }

    return items;
  };

  return (
    <div
      className={`flex justify-center items-center border border-color-${theme} rounded`}
    >
      <button
        className={`px-6 py-4  ${
          pageIndex === 0
            ? `bg-color-pagination-disable-${theme} text-color-icon-text-${theme} cursor-not-allowed`
            : `bg-color-pagination-${theme} text-color-icon-text-${theme}  hover:bg-color-pagination-hover-${theme} transition duration-300 ease-in-out`
        }`}
        onClick={handleClickPrevious}
        disabled={pageIndex === 0}
      >
        <IoMdArrowDropleft
          size={17}
          className={`text-color-icon-text-${theme}`}
        />
      </button>
      {renderPageItems()}
      <button
        className={`px-6 py-4  ${
          pageIndex >= totalPages - 1
            ? `bg-color-pagination-disable-${theme} text-gray-600 cursor-not-allowed`
            : `bg-color-pagination-${theme} text-color-icon-text-${theme} hover:bg-color-pagination-hover-${theme} transition duration-300 ease-in-out`
        }`}
        onClick={handleClickNext}
        disabled={pageIndex >= totalPages - 1}
      >
        <IoMdArrowDropright
          size={17}
          className={`text-color-icon-text-${theme}`}
        />
      </button>
    </div>
  );
};

export default Pagination;
