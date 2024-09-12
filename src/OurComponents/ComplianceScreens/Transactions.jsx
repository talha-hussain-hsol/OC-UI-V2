import React, { useState } from "react";
import image from '../../Assets/react.svg'
import { useTheme } from "../../contexts/themeContext";
import Table from "../Reusable Components/Tables/Table";


import { IoSettingsOutline } from "react-icons/io5";
import { MdFileDownload, MdFileDownloadDone } from "react-icons/md";


const Transactions = () => {

    const { theme } = useTheme();

    const data = [
        {
            id: 1,
            account: 'Demo Fund Clio Aguirre BYEWYe',
            trxid: '8805fc1a-f132-4300-8a7e-4403e06e9b24	',
            dealingDate: 'Null',
            recievedDate: '12-09-2024	',
            type: 'Subscription',
            status: "Accepted",
            source: "integrated",
            amount: "$67.9"
          },{
            id: 2,
            account: 'Demo Fund Clio Aguirre BYEWYe',
            trxid: '8805fc1a-f132-4300-8a7e-4403e06e9b24	',
            dealingDate: 'Null',
            recievedDate: '12-09-2024	',
            type: 'Subscription',
            status: "Accepted",
            source: "integrated",
            amount: "$67.9"
          },{
            id: 3,
            account: 'Demo Fund Clio Aguirre BYEWYe',
            trxid: '8805fc1a-f132-4300-8a7e-4403e06e9b24	',
            dealingDate: 'Null',
            recievedDate: '12-09-2024	',
            type: 'Subscription',
            status: "Accepted",
            source: "integrated",
            amount: "$67.9"
          },{
            id: 4,
            account: 'Demo Fund Clio Aguirre BYEWYe',
            trxid: '8805fc1a-f132-4300-8a7e-4403e06e9b24	',
            dealingDate: 'Null',
            recievedDate: '12-09-2024	',
            type: 'Subscription',
            status: "Accepted",
            source: "integrated",
            amount: "$67.9"
          },{
            id: 5,
            account: 'Demo Fund Clio Aguirre BYEWYe',
            trxid: '8805fc1a-f132-4300-8a7e-4403e06e9b24	',
            dealingDate: 'Null',
            recievedDate: '12-09-2024	',
            type: 'Subscription',
            status: "Accepted",
            source: "integrated",
            amount: "$67.9"
          },{
            id: 6,
            account: 'Demo Fund Clio Aguirre BYEWYe',
            trxid: '8805fc1a-f132-4300-8a7e-4403e06e9b24	',
            dealingDate: 'Null',
            recievedDate: '12-09-2024	',
            type: 'Subscription',
            status: "Accepted",
            source: "integrated",
            amount: "$67.9"
          },{
            id: 7,
            account: 'Demo Fund Clio Aguirre BYEWYe',
            trxid: '8805fc1a-f132-4300-8a7e-4403e06e9b24	',
            dealingDate: 'Null',
            recievedDate: '12-09-2024	',
            type: 'Subscription',
            status: "Accepted",
            source: "integrated",
            amount: "$67.9"
          },{
            id: 8,
            account: 'Demo Fund Clio Aguirre BYEWYe',
            trxid: '8805fc1a-f132-4300-8a7e-4403e06e9b24	',
            dealingDate: 'Null',
            recievedDate: '12-09-2024	',
            type: 'Subscription',
            status: "Accepted",
            source: "integrated",
            amount: "$67.9"
          },{
          id: 9,
          account: 'Demo Fund Clio Aguirre BYEWYe',
          trxid: '8805fc1a-f132-4300-8a7e-4403e06e9b24	',
          dealingDate: 'Null',
          recievedDate: '12-09-2024	',
          type: 'Subscription',
          status: "Accepted",
          source: "integrated",
          amount: "$67.9"
        },
      ];

      const dataHeader = [
        "ACCOUNT",
        "TRXID",
        "DEALING DATE",
        "RECIEVED DATE",
        "TYPE",
        "STATUS",
        "SOURCE",
        "AMOUNT"
    ];

  return (
    <div className={`bg-color-card-${theme} shadow-${theme} mb-8 w-full`}>
            <Table
              headers={dataHeader}
              headerClassName={`bg-color-table-header-${theme}`}
              rows={data}
              renderRow={(row) => (
                <>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 uppercase font-light text-xs sm:text-sm">{row.account}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 font-light text-xs sm:text-sm">{row.trxid}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 font-light text-xs sm:text-sm">{row.dealingDate}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 font-light text-xs sm:text-sm">{row.recievedDate}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 font-light text-xs sm:text-sm">{row.type}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 font-light text-xs sm:text-sm text-green-500 flex items-center"><MdFileDownloadDone />{row.status}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 font-light text-xs sm:text-sm">{row.source}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 font-light text-xs sm:text-sm">{row.amount}</td>
                </>
              )}
            />
          </div>
  )
}

export default Transactions