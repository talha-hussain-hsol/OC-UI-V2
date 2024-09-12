import React, { useState } from "react";
import { useTheme } from "../../contexts/themeContext";
import Table from "../Reusable Components/Tables/Table";
import { IoSettingsOutline } from "react-icons/io5";
import { MdFileDownloadDone } from "react-icons/md";
import { IoIosEye } from "react-icons/io";


const AlertsTransaction = () => {
    const { theme } = useTheme();

    const data = [
        {
            id: 1,
            alerts: 'Multiple Low Value Transactions From One Remitter At Entity Level	',
            amount: '$122	',
            type: 'Subscription',
            beneficiaryName: 'Ascent-Dubai		',
            remitterName: 'Hussain',
            status: <button className="p-2 bg-red-500 rounded-lg text-white ml-2 text-sm">
            Unresolved
            </button>,
            comment: "integrated",
            update: <button className="p-2 bg-green-500 rounded-lg text-white ml-2 text-sm">
            Update
            </button>,
            transactionDetails: <button className="p-2 text-green-500 ml-6 text-xl">
            <IoIosEye />
            </button>
          },{
            id: 2,
            alerts: 'Multiple Low Value Transactions From One Remitter At Entity Level	',
            amount: '$122	',
            type: 'Subscription',
            beneficiaryName: 'Ascent-Dubai		',
            remitterName: 'Hussain',
            status: <button className="p-2 bg-red-500 rounded-lg text-white ml-2 text-sm">
            Unresolved
            </button>,
            comment: "integrated",
            update: <button className="p-2 bg-green-500 rounded-lg text-white ml-2 text-sm">
            Update
            </button>,
            transactionDetails: <button className="p-2 text-green-500 ml-6 text-xl">
            <IoIosEye />
            </button>
          },{
            id: 3,
            alerts: 'Multiple Low Value Transactions From One Remitter At Entity Level	',
            amount: '$122	',
            type: 'Subscription',
            beneficiaryName: 'Ascent-Dubai		',
            remitterName: 'Hussain',
            status: <button className="p-2 bg-red-500 rounded-lg text-white ml-2 text-sm">
            Unresolved
            </button>,
            comment: "integrated",
            update: <button className="p-2 bg-green-500 rounded-lg text-white ml-2 text-sm">
            Update
            </button>,
            transactionDetails: <button className="p-2 text-green-500 ml-6 text-xl">
            <IoIosEye />
            </button>
          },{
            id: 4,
            alerts: 'Multiple Low Value Transactions From One Remitter At Entity Level	',
            amount: '$122	',
            type: 'Subscription',
            beneficiaryName: 'Ascent-Dubai		',
            remitterName: 'Hussain',
            status: <button className="p-2 bg-red-500 rounded-lg text-white ml-2 text-sm">
            Unresolved
            </button>,
            comment: "integrated",
            update: <button className="p-2 bg-green-500 rounded-lg text-white ml-2 text-sm">
            Update
            </button>,
            transactionDetails: <button className="p-2 text-green-500 ml-6 text-xl">
            <IoIosEye />
            </button>
          },{
            id: 5,
            alerts: 'Multiple Low Value Transactions From One Remitter At Entity Level	',
            amount: '$122	',
            type: 'Subscription',
            beneficiaryName: 'Ascent-Dubai		',
            remitterName: 'Hussain',
            status: <button className="p-2 bg-red-500 rounded-lg text-white ml-2 text-sm">
            Unresolved
            </button>,
            comment: "integrated",
            update: <button className="p-2 bg-green-500 rounded-lg text-white ml-2 text-sm">
            Update
            </button>,
            transactionDetails: <button className="p-2 text-green-500 ml-6 text-xl">
            <IoIosEye />
            </button>
          },{
            id: 6,
            alerts: 'Multiple Low Value Transactions From One Remitter At Entity Level	',
            amount: '$122	',
            type: 'Subscription',
            beneficiaryName: 'Ascent-Dubai		',
            remitterName: 'Hussain',
            status: <button className="p-2 bg-red-500 rounded-lg text-white ml-2 text-sm">
            Unresolved
            </button>,
            comment: "integrated",
            update: <button className="p-2 bg-green-500 rounded-lg text-white ml-2 text-sm">
            Update
            </button>,
            transactionDetails: <button className="p-2 text-green-500 ml-6 text-xl">
            <IoIosEye />
            </button>
          },{
            id: 7,
            alerts: 'Multiple Low Value Transactions From One Remitter At Entity Level	',
            amount: '$122	',
            type: 'Subscription',
            beneficiaryName: 'Ascent-Dubai		',
            remitterName: 'Hussain',
            status: <button className="p-2 bg-red-500 rounded-lg text-white ml-2 text-sm">
            Unresolved
            </button>,
            comment: "integrated",
            update: <button className="p-2 bg-green-500 rounded-lg text-white ml-2 text-sm">
            Update
            </button>,
            transactionDetails: <button className="p-2 text-green-500 ml-6 text-xl">
            <IoIosEye />
            </button>
          },{
            id: 8,
            alerts: 'Multiple Low Value Transactions From One Remitter At Entity Level	',
            amount: '$122	',
            type: 'Subscription',
            beneficiaryName: 'Ascent-Dubai		',
            remitterName: 'Hussain',
            status: <button className="p-2 bg-red-500 rounded-lg text-white ml-2 text-sm">
            Unresolved
            </button>,
            comment: "integrated",
            update: <button className="p-2 bg-green-500 rounded-lg text-white ml-2 text-sm">
            Update
            </button>,
            transactionDetails: <button className="p-2 text-green-500 ml-6 text-xl">
            <IoIosEye />
            </button>
          },{
            id: 9,
            alerts: 'Multiple Low Value Transactions From One Remitter At Entity Level	',
            amount: '$122	',
            type: 'Subscription',
            beneficiaryName: 'Ascent-Dubai		',
            remitterName: 'Hussain',
            status: <button className="p-2 bg-red-500 rounded-lg text-white ml-2 text-sm">
            Unresolved
            </button>,
            comment: "integrated",
            update: <button className="p-2 bg-green-500 rounded-lg text-white ml-2 text-sm">
            Update
            </button>,
            transactionDetails: <button className="p-2 text-green-500 ml-6 text-xl">
            <IoIosEye />
            </button>
          },{
            id: 10,
            alerts: 'Multiple Low Value Transactions From One Remitter At Entity Level	',
            amount: '$122	',
            type: 'Subscription',
            beneficiaryName: 'Ascent-Dubai		',
            remitterName: 'Hussain',
            status: <button className="p-2 bg-red-500 rounded-lg text-white ml-2 text-sm">
            Unresolved
            </button>,
            comment: "integrated",
            update: <button className="p-2 bg-green-500 rounded-lg text-white ml-2 text-sm">
            Update
            </button>,
            transactionDetails: <button className="p-2 text-green-500 ml-6 text-xl">
            <IoIosEye />
            </button>
          }
      ];

      const dataHeader = [
        "ALERTS",
        "AMOUNT",
        "TYPE",
        "BENEFICIARY NAME",
        "REMITTER NAME",
        "STATUS",
        "COMMENT",
        "UPDATE",
        "TRANSACTION DETAIL"
    ];

  return (
    <div className={`bg-color-card-${theme} shadow-${theme} mb-8 w-full`}>
            <Table
              headers={dataHeader}
              headerClassName={`bg-color-table-header-${theme}`}
              rows={data}
              renderRow={(row) => (
                <>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 font-thin text-xs sm:text-xs text-yellow-600">{row.alerts}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 font-light text-xs sm:text-sm">{row.amount}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 font-light text-xs sm:text-sm">{row.type}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 font-light text-xs sm:text-sm">{row.beneficiaryName}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 font-light text-xs sm:text-sm">{row.remitterName}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 font-light text-xs sm:text-sm">{row.status}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 font-light text-xs sm:text-sm">{row.comment}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 font-light text-xs sm:text-sm">{row.update}</td>
                  <td className="py-2 sm:py-4">
                    <button className="p-2 text-green-500 ml-6 text-xl">
                    <IoIosEye />
                    </button>
                  </td>
                </>
              )}
            />
          </div>
  )
}

export default AlertsTransaction