import React from "react";
import SideBar from "../Reusable Components/SideBar";
import Header from "../Reusable Components/Header";
import AUMCard from "../Reusable Components/CardComponent/AUMCards";
import CardHeader from "../Reusable Components/CardComponent/CardHeader";
import FinancialChart from "../Reusable Components/FinancialChart";
import NotificationCard from "../Reusable Components/NotificationCard";
import { FaArrowRight, FaEye } from "react-icons/fa";
import { useTheme } from "../../contexts/themeContext";

function Dashboard() {
  const { theme } = useTheme();
  console.log("theme", theme);

  const backgroundClass = {
    theme1: "bg-color-card-theme1",
    theme2: "bg-color-theme2",
    theme3: "bg-color-theme3",
    theme4: "bg-color-theme4",
  };

  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    values: [5, 10, 20, 25, 18, 7, 12, 22, 15, 19, 25, 37],
  };

  return (
    <div className={`bg-color-${theme} from-[#0c1f37] from-10% to-[#103649] to-90% flex flex-col md:flex-row min-h-screen`}>
      <SideBar portalType="Customer" />
      <div className="w-full flex flex-col">
        <div className="flex-1 py-6 sm:ml-9 sm:px-10 px-4">
          <Header
            heading="Dashboard"
            subheading="INVESTOR PORTAL"
            showButton={false}
          />
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-10">
            <AUMCard
              date=" As at 03/09/2024"
              amount="38,000,000.00"
              text="Current Total AUM"
            />
            <AUMCard amount="40,000,000.00" text="Total Subscription" />
            <AUMCard amount="1,000,000.00" text="Total Redemption" />
          </div>

          <div className="flex flex-wrap justify-between mt-7 ml-6 space-y-6 md:space-y-0 md:space-x-6">
            <div className={`w-full md:w-[48%] lg:w-[48%] xl:w-[48%] rounded-lg shadow-lg`}>
              <div className="w-full">
                <CardHeader
                  FundName="NAV HISTORY"
                  fundClassName="text-white"
                  showButton={false}
                  showLogo={false}
                  showField={false}
                />
              </div>
              <FinancialChart data={data} year="2024" chartType="bar" />
            </div>
            <div className="w-full md:w-[48%] lg:w-[48%] xl:w-[48%] rounded-lg shadow-lg">
              <div className="w-full">
                <CardHeader
                  FundName="PRICE CHART"
                  fundClassName="text-white"
                  showButton={false}
                  showLogo={false}
                  showField={false}
                />
              </div>
              <FinancialChart data={data} year="2024" chartType="line" />
            </div>
          </div>
          <div className="flex flex-wrap justify-between mt-7 ml-6 space-y-6 md:space-y-0 md:space-x-6">
            <div className="w-full md:w-[33%] lg:w-[33%] xl:w-[33%] rounded-lg shadow-lg">
              <div className="w-full">
                <CardHeader
                  FundName="PERFORMANCE HISTORY"
                  fundClassName="text-white"
                  showButton={false}
                  showLogo={false}
                  showField={false}
                />
              </div>
              <FinancialChart data={data} year="2024" chartType="bar" />
            </div>
            <div className="w-full md:w-[65%] lg:w-[65%] xl:w-[65%] rounded-lg shadow-lg">
              <div className="w-full">
                <CardHeader
                  FundName="LATEST ACTIVITY"
                  fundClassName="text-white"
                  showButton={true}
                  showLogo={false}
                  BtnText="View All"
                  className="text-blue-400"
                  showField={false}
                />
              </div>
              <div className={`${backgroundClass[theme]}`}>
                <NotificationCard
                  iconLeft={<FaArrowRight />}
                  message="New Performance Document Received"
                  dateTime="13/06/2024 12:00PM"
                  iconRight={<FaEye />}
                />
                <NotificationCard
                  iconLeft={<FaArrowRight />}
                  message="New Performance Document Received"
                  dateTime="13/06/2024 12:00PM"
                  iconRight={<FaEye />}
                />
                <NotificationCard
                  iconLeft={<FaArrowRight />}
                  message="New Performance Document Received"
                  dateTime="13/06/2024 12:00PM"
                  iconRight={<FaEye />}
                />
                <NotificationCard
                  iconLeft={<FaArrowRight />}
                  message="New Performance Document Received"
                  dateTime="13/06/2024 12:00PM"
                  iconRight={<FaEye />}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
