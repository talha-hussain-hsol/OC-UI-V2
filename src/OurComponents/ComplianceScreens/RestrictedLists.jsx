import React, { useState, useEffect, useRef } from "react";
import image from '../../Assets/react.svg'
import { useTheme } from "../../contexts/themeContext";
import Table from "../Reusable Components/Tables/Table";
import { BsThreeDotsVertical } from "react-icons/bs";


const RestrictedLists = () => {

    const { theme } = useTheme();
    const [selectedRow, setSelectedRow] = useState(null);
    const dropdownRef = useRef(null); // Reference for detecting outside click


    const data = [
        {
            id: 1,
            listName: 'Eveniet nemo vel un',
            businessUnit: 'Demo Fund',
            customerCount: '0',
            createdAt: '12/07/2024',
            updatedAt: '12/09/2024',
          },{
            id: 2,
            listName: 'Eveniet nemo vel un',
            businessUnit: 'Demo Fund',
            customerCount: '2',
            createdAt: '12/07/2024',
            updatedAt: '12/09/2024',
          },{
            id: 3,
            listName: 'Eveniet nemo vel un',
            businessUnit: 'Demo Fund',
            customerCount: '1',
            createdAt: '12/07/2024',
            updatedAt: '12/09/2024',
          },{
            id: 4,
            listName: 'Eveniet nemo vel un',
            businessUnit: 'Singapore Fund',
            customerCount: '0',
            createdAt: '12/07/2024',
            updatedAt: '12/09/2024',
          },{
            id: 5,
            listName: 'Eveniet nemo vel un',
            businessUnit: 'Demo Fund',
            customerCount: '2',
            createdAt: '12/07/2024',
            updatedAt: '12/09/2024',
          },{
            id: 6,
            listName: 'Eveniet nemo vel un',
            businessUnit: 'Demo Fund',
            customerCount: '2',
            createdAt: '12/07/2024',
            updatedAt: '12/09/2024',
          },{
            id: 7,
            listName: 'Documentation',
            businessUnit: 'Demo Fund',
            customerCount: '2',
            createdAt: '12/07/2024',
            updatedAt: '12/09/2024',
          },{
            id: 8,
            listName: 'Eveniet nemo vel un',
            businessUnit: 'Singapore Fund',
            customerCount: '2',
            createdAt: '12/07/2024',
            updatedAt: '12/09/2024',
          },{
            id: 9,
            listName: 'Eveniet nemo vel un',
            businessUnit: 'Demo Fund',
            customerCount: '0',
            createdAt: '12/07/2024',
            updatedAt: '12/09/2024',
          },{
            id: 10,
            listName: 'Documentation',
            businessUnit: 'Demo Fund',
            customerCount: '1',
            createdAt: '12/07/2024',
            updatedAt: '12/09/2024',
          },
      ];

      const dataHeader = [
        "list name",
        "bussiness unit",
        "customer count",
        "created at",
        "updated at",
        ""
    ];

    const handleThreeDotsClick = (rowId) => {
        setSelectedRow(rowId === selectedRow ? null : rowId); // Toggle the dropdown for the clicked row
      };


      useEffect(() => {
        const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setSelectedRow(null); // Close the dropdown
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [dropdownRef]);

  return (
    <>
      <div className={`bg-color-header-${theme} rounded-2xl shadow-${theme} ml-4 sm:ml-6 flex flex-col justify-center h-full w-full`}>
        <h1 className={`text-color-text-${theme} mt-4 ml-2 sm:ml-4 my-5 rounded-md font-light text-base`}>
          Restricted List
        </h1>

        <div className={`w-full items-center bg-color-header-${theme}`}>            
          <div className={`bg-color-card-${theme} flex justify-between w-full`} >
            <Table
              headers={dataHeader}
              headerClassName={`bg-color-table-header-${theme}`}
              rows={data}
              renderRow={(row) => (
                <>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 uppercase font-light text-xs sm:text-sm items-center">{row.listName}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 font-light text-xs sm:text-sm items-center">{row.businessUnit}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 font-light text-xs sm:text-sm items-center">{row.customerCount}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 font-light text-xs sm:text-sm items-center">{row.createdAt}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 font-light text-xs sm:text-sm items-center">{row.updatedAt}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 font-light text-xs sm:text-sm items-center text-white flex mt-3"><BsThreeDotsVertical
                  className="cursor-pointer text-lg"
                  onClick={() => handleThreeDotsClick(row.id)}
                 />
                  {selectedRow === row.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-slate-800 shadow-lg rounded-lg z-10 text-white" ref={dropdownRef}>
                        <button className="block px-4 py-2 w-full text-left text-sm hover:bg-slate-600">
                          Edit
                        </button>
                        <button className="block px-4 py-2 w-full text-left text-sm hover:bg-slate-600">
                          Delete
                        </button>
                      </div>
                    )}
                 </td>
                </>
              )}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default RestrictedLists



