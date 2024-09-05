import React from "react";
import SideBar from "../SideBar";
import Header from "../Header";
import Card from "../CardComponent/AccountCard";
import { useNavigate } from "react-router-dom";

const Accounts = () => {
  const navigate=useNavigate();
  function handleClick() {
    navigate("/stepper")
  }

  return (
    <div className="bg-gradient-to-r from-[#0c1f37] from-10% to-[#103649] to-90% flex flex-col md:flex-row">
      <SideBar portalType="Customer" />
      <div className="flex-1 py-6 sm:ml-9 sm:px-10 px-4">
        <Header
          heading="My Accounts"
          subheading="Overview"
          showButton={true}
          onButtonClick={handleClick}
        />

        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
};

export default Accounts;
