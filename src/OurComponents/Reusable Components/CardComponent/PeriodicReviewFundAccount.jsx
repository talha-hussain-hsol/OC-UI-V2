import React from 'react';
import { useTheme } from "../../../contexts/themeContext";
import Table from "../Tables/Table"; // Adjust the import path based on your project structure

const PeriodicReviewFundAccount = () => {
    const { theme } = useTheme();
    const Headers = [
        "Name",
        "Risk Score",
        "OVER RIDE RISK RATING",
        "Computed Risk Rating",
        "Approval Status",
        "Created At",
        "Next Review Date",
        "Action"
    ];

    const Rows = [
      
    ];

    return (
        <div className={`bg-color-header-${theme} py-4`}>
            <p className={`text-xs leading-relaxed text-center text-[#6b82a1] py-6 sm:mx-72`}>
                Periodic review section indicates all cases which are due for periodic review cycle within the next 3 months.
                The default periodic review cycle is set for High Risk (every 1 year), Medium Risk (Every 2 years) and Low Risk (Every 3 years).
            </p>
            <div className="w-full">
                <Table
                    headers={Headers}
                    rows={Rows}
                    headerClassName={`bg-color-table-bg-${theme}`}
                    className={`bg-color-header-${theme} rounded-b-lg`}
                    renderRow={(row, index) => (
                        Rows.length > 0 ? (
                            <>
                                <td className="py-4 px-6 font-light text-xs">{row.name}</td>
                                <td className="py-4 px-6 font-light text-xs">{row.score}</td>
                                <td className="py-4 px-6 font-light text-xs">{row.overRideRisk}</td>
                                <td className="py-4 px-6 font-light text-xs">{row.computedRisk}</td>
                                <td className="py-4 px-6 font-light text-xs">{row.status}</td>
                                <td className="py-4 px-6 font-light text-xs">{row.createdAt}</td>
                                <td className="py-4 px-6 font-light text-xs">{row.reviewDate}</td>
                                <td className="py-4 px-6 font-light text-xs">{/* Actions here */}</td>
                            </>
                        ) : (
                            <td colSpan={Headers.length} className="py-4 px-6 text-center text-white">
                                No data available
                            </td>
                        )
                    )}
                />
            </div>
        </div>
    );
}

export default PeriodicReviewFundAccount;
