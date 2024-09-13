import React from 'react'
import Table from './Tables/Table'
import { MdOutlineFileDownload } from "react-icons/md";
import { MdDashboardCustomize } from "react-icons/md";
import { useTheme } from '../../contexts/themeContext';

function PeriodicReview() {
    const { theme } = useTheme();
    console.log("theme", theme);

  const DocHeaders = ["Crypto Address", "Type", "Submission Date", "Total AMT", "Total TX","Risk","Last Review Date","Status","Action"];

  const docRows = [
    {
      crpaddress: 'Distinctio Velit as',
      type:  'BNB',
      submission: '',
      amt: '',
      tx: '',
      risk: '',
      status:'Failed',
      lastdate:'Invalid Date'
    },
    {
      crpaddress: 'Ut cillum optio ill',
      type:  'BNB',
      submission: '',
      amt: '',
      tx: '',
      risk:'',
      status:'Failed',
      lastdate:'Invalid Date'
    },
    {
      crpaddress: 'Voluptatibus quisqua',
      type:  'BNB',
      submission: '',
      amt: '',
      tx: '',
      risk:'',
      status:'Failed',
      lastdate:'Invalid Date'
    },{
      crpaddress: 'Et veniam dicta vel',
      type:  'BNB',
      submission: '',
      amt: '',
      tx: '',
      risk:'',
      status:'Failed',
      lastdate:'Invalid Date'
    },{
      crpaddress: 'yuiyui',
      type: 'BNB',
      submission: '',
      amt: '',
      tx: '',
      risk:'',
      status:'Failed',
      lastdate:'Invalid Date'
    },{
      crpaddress: '67564562',
      type:  'BNB',
      submission: '',
      amt: '',
      tx:'' ,
      risk:'',
      status:'Failed',
      lastdate:'Invalid Date'
    },{
      crpaddress: '67564562',
      type: 'BNB',
      submission: '',
      amt: '',
      tx: '',
      risk:'',
      status:'Failed',
      lastdate:'Invalid Date'
    },{
      crpaddress: '67564562',
      type: 'BNB',
      submission: '',
      amt: '',
      tx:'',
      risk:'',
      status:'Failed',
      lastdate:'Invalid Date'
    },{
      crpaddress: 'Distinctio Velit as',
      type: 'BNB',
      submission: '',
      amt: '',
      tx: '',
      risk:'',
      status:'Failed',
      lastdate:'Invalid Date'
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
          <td className="py-4 px-6 font-light  uppercase">
            {row.crpaddress}
          </td>
          <td className="py-4 px-6 font-light ">{row.type}</td>
          <td className="py-4 px-6 font-light ">{row.submission}</td>
          <td className="py-4 px-6 font-light ">{row.amt}</td>
          <td className="py-4 px-6 font-light ">{row.tx}</td>
          <td className="py-4 px-6 font-light ">{row.risk}</td>
          <td className="py-4 px-6 font-light ">{row.lastdate}</td>
          <td className={`py-4 px-6 font-light text-color-icon-${theme}`}>{row.status}</td>
          <td className={`py-2 px-2 sm:py-4 sm:px-4 text-color-icon-${theme}`}>
            <div className="flex justify-start space-x-4 sm:space-x-6 text-base sm:text-lg">
              {/* <MdDashboardCustomize />
              <MdOutlineFileDownload /> */}
            </div>
          </td>
        </>
      )}
    />
    </>
  )
}

export default PeriodicReview
