import React, { useState } from "react";
import Table from "../Tables/Table";
import Header from "../Header";
import Button from "../Button";
import SideBar from "../SideBar";
import { AiFillEdit } from "react-icons/ai";
import TabBar from "../TabBar";

const Identities = () => {
  const Headers = ["Name", "Type", "Status", "Actions"];
  const Rows = [
    {
      name: "Hamilton sosa sn",
      type: "Individual",
      status: "Active",
      //   actionText: "Sign & Submit",
    },
    {
      name: "Testa dasa ax",
      type: "Individual",
      status: "Active",
      //   actionText: "Sign & Submit",
    },
    {
      name: "Dsdsad adsd af",
      type: "Individual",
      status: "Active",
      //   actionText: "Sign & Submit",
    },
    {
      name: "Wqwd aasd ax",
      type: "Individual",
      status: "Active",
      //   actionText: "Sign & Submit",
    },
    {
      name: "Egdfg ewer al",
      type: "Individual",
      status: "Active",
      //   actionText: "Sign & Submit",
    },
  ];
  const [status, setStatus] = useState(
    Rows.map((row) => row.status === "Active")
  );
  const handleToggle = (index) => {
    setStatus((prevStatus) =>
      prevStatus.map((stat, i) => (i === index ? !stat : stat))
    );
  };
  return (
    <div className="bg-gradient-to-r from-[#0c1f37] from-10% to-[#103649] to-90% h-screen">
      <SideBar portalType="Customer" />
      <div className="py-6 sm:ml-12 mx-4 sm:px-10 ">
        <div className=" w-full">
          <Header
            heading="My Identities"
            subheading="Overview"
            showButton={false}
            //   onButtonClick={handleClick}
          />
          <div className="flex justify-between mb-">
            <TabBar tabs={["My Identities"]} />
            <Button
              className="bg-[#2c7be5] text-white font-light rounded-lg py-6 px-8 text-sm sm:text-md"
              text="Create New Identity"
            />
          </div>
          <hr className="  border-t-[1px] border-t-[#6e84a3] opacity-20 mb-6 ml-6" />
        </div>
        <div className="flex flex-col w-full items-center justify-center sm:ml-6">
          <div className="bg-gradient-to-b from-[#0e325a] from-10% to-[#141c3a] to-100% rounded-t-md border-[#1b3050] border-b-[1px] shadow-[0px_6px_20px_rgba(0,0,0,0.9)]  flex flex-col items-center justify-center h-full w-full">
            <p className="py-2 text-[#ee9d0b] sm:text-xs text-[8px] w-full px-4">
              Please note that you can set your identities to "Inactive" or
              "Active" by using the toggle button. Your submitted account
              applications will not be impacted if you set your identities as
              "Inactive" <br />
              To delete/withdraw an account application, please proceed to the
              Account Details page to perform this action. <br />
              Please note that you can only delete/withdraw an application which
              are in "Draft" or "Pending" statues. Applications that has been
              already processed for KYC screening cannot be deleted/withdrawn.
              <br />
              You may contact your Account Manager to assist you in this case.
            </p>
          </div>
          <div className="bg-gradient-to-b from-[#0e325a] from-2% to-[#141c3a] to-100% shadow-[0px_6px_20px_rgba(0,0,0,0.9)] rounded-b-md border-[#1b3050] border-[1px] w-full">
            <Table
              headers={Headers}
              rows={Rows}
              renderRow={(row, index) => (
                <>
                  <td className="py-4 px-6 font-light">{row.name}</td>
                  <td className="py-4 px-6 font-light">{row.type}</td>
                  <td className="py-4 px-6 text-[#01cc7a] font-light">
                    {status[index] ? "Active" : "Inactive"}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-4">
                      <AiFillEdit className="text-white cursor-pointer hover:text-[#ee9d0b] transition-colors duration-200" />

                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={status[index]}
                          onChange={() => handleToggle(index)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2c7be5]"></div>
                      </label>
                      <p className="font-light">Active</p>
                    </div>
                  </td>
                </>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Identities;
