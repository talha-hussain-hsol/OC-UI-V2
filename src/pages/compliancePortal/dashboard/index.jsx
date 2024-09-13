import { useLayoutEffect } from "react";
import { removeQueryParams } from "../../../utils/helperFunctions";

const ComplianceDashboard = () => {
    useLayoutEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const data = params.get('data');
        if (data) {
          const parsedData = JSON.parse(decodeURIComponent(data));
          for (const key in parsedData) {
            localStorage.setItem(key, parsedData[key]);
          }
        }
        removeQueryParams()
    }, [])
  return <div style={{color: 'black'}}>Compliance</div>;
};

export default ComplianceDashboard;
