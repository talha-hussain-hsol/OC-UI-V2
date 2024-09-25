import React, { useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { MdFileDownload, MdFileDownloadDone } from "react-icons/md";
import Header from '../components/header/Header';
import image from '../../assets/react.svg'
import SideBar from "../components/sidebar/Sidebar";
import { useTheme } from "../contexts/themeContext";
import TextField from '../components/ui/input/TextField';
import Dropdown from '../components/ui/dropdown/Dropdown';
import Button from '../components/ui/button/Button';
import CardHeader from "../components/header/CardHeader";
import Table from "../Reusable Components/Tables/Table";


const dataHeader = [
    "DOMAIN ACCOUNTS",
    "REGION",
    "ACCOUNT MANAGER",
    "STATUS",
    "LAUNCH DATE",
    "ACTION"
];
const data = [
    {
      id: 1,
      fundName: 'Demo Fund 1',
      region: 'Singapore',
      manager: 'Demo Manager',
      status: 'Accepted',
      launchDate: '26/08/2024',
      image: {image},
    },
    {
      id: 2,
      fundName: 'Demo Fund 2',
      region: 'Pakistan',
      manager: 'Hussain Syed',
      status: 'Accepted',
      launchDate: '22/12/2022',
      image: {image},
    },
    {
      id: 3,
      fundName: 'Demo Fund 3',
      region: 'United States',
      manager: 'John Doe',
      status: 'Accepted',
      launchDate: '12/09/2024',
      image: {image},
    },{
      id: 4,
      fundName: 'Demo Fund 4',
      region: 'United States',
      manager: 'John Doe',
      status: 'Accepted',
      launchDate: '12/09/2024',
      image: {image},
    },{
      id: 5,
      fundName: 'Demo Fund 5',
      region: 'United States',
      manager: 'John Doe',
      status: 'Accepted',
      launchDate: '12/09/2024',
      image: {image},
    },{
      id: 6,
      fundName: 'Demo Fund 6',
      region: 'United States',
      manager: 'John Doe',
      status: 'Accepted',
      launchDate: '12/09/2024',
      image: {image},
    },{
      id: 7,
      fundName: 'Demo Fund 7',
      region: 'Singapore',
      manager: 'Demo Manager',
      status: 'Accepted',
      launchDate: '26/08/2024',
      image: {image},
    },{
      id: 8,
      fundName: 'Demo Fund 8',
      region: 'United States',
      manager: 'John Doe',
      status: 'Accepted',
      launchDate: '12/09/2024',
      image: {image},
    },{
      id: 9,
      fundName: 'Demo Fund 1',
      region: 'Singapore',
      manager: 'Demo Manager',
      status: 'Accepted',
      launchDate: '26/08/2024',
      image: {image},
    },{
      id: 10,
      fundName: 'Demo Fund 9',
      region: 'Pakistan',
      manager: 'Saud Shakeel',
      status: 'Accepted',
      launchDate: '08/09/2024',
      image: {image},
    },
  ];

  const regions = [
    "Select Region",
    "USA",
    "Canada",
    "UK",
    "Australia",
    "Germany",
    "Singapore",
    "Japan",
    "India",
    "China",
    "Brazil"
  ];

const DomainAccounts = () => {

    const { theme } = useTheme();
    const [region, setRegion] = useState("");

    const handleCreateAccount = () => {
        console.log('Create Account button clicked');
      };


return (
    <>
      <div className={`bg-color-${theme} flex flex-col min-h-screen`}>
  
        <SideBar portalType="Compliance" />
        <div className="flex-1 py-6 sm:ml-9 sm:px-10 px-4">
          <Header
            subheading="COMPLIANCE PORTAL"
            heading="Domain Accounts"
            showButton={false}
            onButtonClick={handleCreateAccount}
            theme={theme}
          />
        </div>
  
        {/* Responsive Search Card */}
        <div className={`bg-color-card-${theme} p-6 rounded-lg shadow-${theme} border border-slate-700 mx-4 sm:mx-8 lg:mx-[120px]`}>
          <div className='flex flex-wrap items-center justify-between'>
            <p className={`text-color-text-${theme} mb-2 text-sm font-light w-full sm:w-[70%]`}>Search Domain Accounts</p>
            <button className={`text-white bg-color-button-${theme} border border-slate-600 px-4 sm:px-6 h-7 mb-4 text-sm rounded-md hover:bg-slate-600 w-full sm:w-[30%] lg:w-[18%] ml-0 sm:ml-4`}>
              Sync Domain Account
            </button>
          </div>

  <hr className="w-full border-t-[1px] border-t-[#6e84a3] opacity-20" />

  {/* Adjust flex to ensure inline layout on large screens */}
  <div className='flex flex-wrap lg:flex-nowrap lg:space-x-5 my-4 items-center justify-between space-y-4 lg:space-y-0'>
    <TextField
      type="text"
      placeholder="Select Domain"
      className="w-full sm:w-[48%] lg:w-[30%]"
    />
    <Dropdown
      options={regions}
      value={region}
      onChange={(e) => setRegion(e.target.value)}
      className={`text-color-h1-${theme} w-full sm:w-[48%] lg:w-[100%]`}
    />
    <Button
      text="Search"
      onClick={handleCreateAccount}
      className={`bg-none border-slate-400 border text-[#6e84a3] font-light rounded-lg py-2 sm:py-4 px-10 sm:px-24 text-sm sm:text-md w-full sm:w-auto lg:w-[20%]`}
      iconPosition="right"
    />
  </div>
</div>

  
        {/* Responsive Domain Funds Section */}
        <div className={`bg-gradient-stepper-card-${theme} rounded-2xl shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] p-6 mt-10 mx-4 sm:mx-8 lg:mx-[120px]`}>
          <div className="flex justify-end items-center mb-4">
            <button className={`flex bg-color-button-${theme} text-white items-center px-4 sm:px-5 h-9 rounded-md text-sm hover:bg-blue-600`}>
              Download Entity Report <MdFileDownload className="ml-2" />
            </button>
          </div>
          
          <div className={`bg-color-card-${theme} shadow-${theme} mb-8 w-full`}>
            <Table
              headers={dataHeader}
              rows={data}
              renderRow={(row) => (
                <>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 uppercase font-light text-xs sm:text-sm">{row.fundName}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 font-light text-xs sm:text-sm">{row.region}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 font-light text-xs sm:text-sm">{row.manager}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 font-light text-xs sm:text-sm text-green-500 flex items-center"><MdFileDownloadDone />{row.status}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 font-light text-xs sm:text-sm">{row.launchDate}</td>
                  <td className="py-2 sm:py-4">
                    <button className="p-2 text-[#609df1] ml-4">
                      <IoSettingsOutline />
                    </button>
                  </td>
                </>
              )}
            />
          </div>
        </div>
  
        {/* Responsive Pagination */}
        <div className='flex mt-5 justify-center'>
          <nav aria-label="Page navigation">
            <ul className="inline-flex -space-x-px text-base h-10">
              <li>
                <a href="#" className="flex items-center justify-center rounded-sm px-4 h-10 leading-tight bg-[#2d66b6] text-white">Prev</a>
              </li>
              <li>
                <a href="#" className="flex items-center justify-center rounded-sm px-4 h-10 leading-tight bg-[#2d66b6] text-white mx-2">1</a>
              </li>
              <li>
                <a href="#" className="flex items-center justify-center rounded-sm px-4 h-10 leading-tight bg-[#2d66b6] text-white">Next</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
  
  

};

export default DomainAccounts;
