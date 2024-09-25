import React from "react";
import SideBar from "../Reusable Components/SideBar";
import { useTheme } from "../../../contexts/themeContext";
import Header from "../Reusable Components/Header";
import DonutChart from "../Reusable Components/DonutChart";
import CardHeader from "../Reusable Components/CardComponent/CardHeader";
import FinancialChart from "../Reusable Components/FinancialChart";

function ComplianceDashboard() {
  const { theme } = useTheme();

  const data = {
    labels: ["Total", "Accepted", "Rejected", "Under Review", "Pending"],
    values: [350, 140, 70, 70, 200],
  };

  const labels = ["Prohibited", "High", "Medium", "Low"];
  const dataValues = [25.84, 21.35, 28.09, 24.72];
  const colors = ["#f57c6c", "#f5d95e", "#7bbcff", "#90e090"];

  return (
    <>
      <div
        className={`bg-color-${theme} from-[#0c1f37] from-10% to-[#103649] to-90% flex flex-col md:flex-row `}
      >
        <SideBar portalType="Compliance" />
        <div className="w-full flex flex-col">
          <div className="flex-1 py-6 sm:ml-6 sm:px-8 px-4">
            <Header
              heading="Demo Fund"
              subheading="COMPLIANCE PORTAL"
              showButton={false}
              theme={theme}
            />
            <div className="flex flex-wrap justify-between mt-7 ml-4 sm:ml-6 space-y-6 md:space-y-0 md:space-x-6">
              <div
                className={`w-full xs:w-[100%] sm:w-[100%] md:w-[48%] lg:w-[48%] xl:w-[48%] 2xl:w-[48%] rounded-lg shadow-lg`}
              >
                <div className="w-full">
                  <CardHeader
                    FundName="ACCOUNTS"
                    fundClassName={`text-color-text-${theme}`}
                    showButton={false}
                    showLogo={false}
                    showField={false}
                  />
                </div>
                <FinancialChart data={data} year="2024" chartType="bar" />
              </div>
              <div
                className={`bg-color-card-${theme} w-full xs:w-[100%] sm:w-[100%] md:w-[48%] lg:w-[48%] xl:w-[48%] 2xl:w-[48%] rounded-lg shadow-lg`}
              >
                <div className="w-full">
                  <CardHeader
                    FundName="RISK ASSESSMENT"
                    fundClassName={`text-color-text-${theme}`}
                    showButton={false}
                    showLogo={false}
                    showField={false}
                  />
                </div>
                    <DonutChart
                      labels={labels}
                      dataValues={dataValues}
                      colors={colors}
                    />
              </div>
            </div>

            <div className="flex flex-wrap justify-between mt-7 ml-4 sm:ml-6 space-y-6 md:space-y-0 md:space-x-6">
              <div
                className={`w-full xs:w-[100%] sm:w-[100%] md:w-[48%] lg:w-[48%] xl:w-[48%] 2xl:w-[48%] rounded-lg shadow-lg`}
              >
                <div className="w-full">
                  <CardHeader
                    FundName="EXPIRY DOCUMENTS"
                    fundClassName={`text-color-text-${theme}`}
                    showButton={false}
                    showLogo={false}
                    showField={false}
                  />
                </div>
                <DonutChart
                  labels={labels}
                  dataValues={dataValues}
                  colors={colors}
                />
              </div>
              <div
                className={`w-full xs:w-[100%] sm:w-[100%] md:w-[48%] lg:w-[48%] xl:w-[48%] 2xl:w-[48%] rounded-lg shadow-lg`}
              >
                <div className="w-full">
                  <CardHeader
                    FundName="PENDING PERIODIC REVIEW"
                    fundClassName={`text-color-text-${theme}`}
                    showButton={false}
                    showLogo={false}
                    showField={false}
                  />
                </div>
                <DonutChart
                  labels={labels}
                  dataValues={dataValues}
                  colors={colors}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ComplianceDashboard;
