import React from "react";
import { useTheme } from "../../../contexts/themeContext";

const Table = ({
  headers,
  rows,
  renderRow,
  className,
  headerClassName,
  rowsClassName,
  showField,
}) => {
  const { theme } = useTheme();
  return (
    <div className="w-full overflow-x-auto rounded-lg">
      <table className={`w-full ${className}`}>
        <thead>
          <tr
            className={` text-[#6e84a3] sm:text-[10px] text-[6px] text-left font-light uppercase border-color-${theme} border-b-[1px] ${headerClassName}`}
          >
            {headers.map((header, index) => (
              <th key={index} className="py-4 px-4 sm:px-6 ">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row, index) => (
              <tr
                key={index}
                className={`text-color-h1-${theme} sm:text-sm text-[6px] text-left font-medium border-color-${theme} border-t-[1px] ${rowsClassName}`}
              >
                {renderRow(row)}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={headers.length}
                className="text-center py-4 text-[#6e84a3]"
              ></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
