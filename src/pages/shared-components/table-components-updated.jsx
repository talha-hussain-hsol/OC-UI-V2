import React from 'react';
import { useTable, usePagination } from 'react-table';

const MyTable = ({ fetchData,columns, data, pageCount, loading, onPageChange, onPageSizeChange }) => {
 
  const tableData = React.useMemo(() => data, [data]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    pageOptions,
    page,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: tableData,
      initialState: { pageIndex: 0, pageSize: 10 },
      manualPagination: true,
      pageCount,
    },
    usePagination
  );

  React.useEffect(() => {
    fetchData({ pageIndex, pageSize });
  }, [fetchData, pageIndex, pageSize]);

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        <button onClick={() => onPageChange(0)} disabled={pageIndex === 0}>
          {'<<'}
        </button>{' '}
        <button onClick={() => onPageChange(pageIndex - 1)} disabled={pageIndex === 0}>
          {'<'}
        </button>{' '}
        <button onClick={() => onPageChange(pageIndex + 1)} disabled={pageIndex === pageOptions.length - 1}>
          {'>'}
        </button>{' '}
        <button onClick={() => onPageChange(pageOptions.length - 1)} disabled={pageIndex === pageOptions.length - 1}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(event) => {
              const pageNumber = event.target.value ? Number(event.target.value) - 1 : 0;
              onPageChange(pageNumber);
            }}
            style={{ width: '50px' }}
          />
        </span>{' '}
        <select value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value))}>
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      {!loading && <div>Loading...</div>}
    </>
  );
};

export default MyTable;
