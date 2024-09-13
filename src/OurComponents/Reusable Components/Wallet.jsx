import React from 'react'
import Table from './Tables/Table'
import { MdOutlineFileDownload } from "react-icons/md";
import { MdDashboardCustomize } from "react-icons/md";
import { useTheme } from '../../contexts/themeContext';

function Wallet() {
    const { theme } = useTheme();
    console.log("theme", theme);

  const DocHeaders = ["Account", "Stage", "Type", "Chain", "Address","Identity","Status","Action"];

  const docRows = [
    {
      account: 'Demo Fund 1',
      stage: 'Pending',
      type: 'Individual',
      chain: 'ADA',
      address: 'United States',
      identity: 'John Doe',
      status:'Draft',
      actionText: "Sign & Submit",
    },
    {
      account: 'Demo Fund 2',
      stage: 'Pending',
      type: 'Individual',
      chain: 'ADA',
      address: 'Singapore',
      identity:'John Doe',
      status:'Draft',
      actionText: "Sign & Submit",
    },
    {
      account: 'Demo Fund 3',
      stage: 'Pending',
      type: 'Individual',
      chain: 'ADA',
      address: 'Pakistan',
      identity:'John Doe',
      status:'Draft',
      actionText: "Sign & Submit",
    },{
      account: 'Demo Fund 4',
      stage: 'Pending',
      type: 'Individual',
      chain: 'ADA',
      address: 'Pakistan',
      identity:'John Doe',
      status:'Draft',
      actionText: "Sign & Submit",
    },{
      account: 'Demo Fund 5',
      stage:'Pending',
      type: 'Corporate',
      chain: 'ADA',
      address: 'Pakistan',
      identity:'John Doe',
      status:'Draft',
      actionText: "Sign & Submit",
    },{
      account: 'Demo Fund 6',
      stage: 'Pending',
      type: 'Individual',
      chain: 'ADA',
      address: 'Pakistan',
      identity:'John Doe',
      status:'Draft',
      actionText: "Sign & Submit",
    },{
      account: 'Demo Fund 7',
      stage:'Pending',
      type: 'Individual',
      chain: 'ADA',
      address: 'United States',
      identity:'John Doe',
      status:'Draft',
      actionText: "Sign & Submit",
    },{
      account: 'Demo Fund 8',
      stage:'Pending',
      type: 'Corporate',
      chain: 'ADA',
      address: 'Pakistan',
      identity:'John Doe',
      status:'Draft',
      actionText: "Sign & Submit",
    },{
      account: 'Demo Fund 1',
      stage:'Pending',
      type: 'Individual',
      chain: 'ADA',
      address: 'United States',
      identity:'John Doe',
      status:'Draft',
      actionText: "Sign & Submit",
    }
  ];

  return (
    <>
    <Table
      headers={DocHeaders}
      headerClassName={`bg-color-table-header-${theme}`}
      rows={docRows}
      renderRow={(row) => (
        <>
          <td className="py-4 px-6 font-light uppercase">
            {row.account}
          </td>
          <td className="py-4 px-6 font-light">{row.stage}</td>
          <td className="py-4 px-6 font-light">{row.type}</td>
          <td className="py-4 px-6 font-light">{row.chain}</td>
          <td className="py-4 px-6 font-light">{row.address}</td>
          <td className="py-4 px-6 font-light">{row.identity}</td>
          <td className={`py-4 px-6 font-light text-color-icon-${theme}`}>{row.status}</td>
          <td className={`py-2 px-2 sm:py-4 sm:px-4 text-color-icon-${theme}`}>
            <div className="flex justify-start space-x-4 sm:space-x-6 text-base sm:text-lg">
              <MdDashboardCustomize />
              <MdOutlineFileDownload />
            </div>
          </td>
        </>
      )}
    />
    </>
  )
}

export default Wallet
