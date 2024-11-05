import { Link, useLocation, useParams } from "react-router-dom";
import React from "react";
import { checkPermissions } from "../helpers";
import { useSelector } from "react-redux";
import { isUpsalaEnable } from "../helpers/getFundConfiguration";

export default function KywDynamicHeader({ ...props }) {
    const fundConfig = useSelector((state) => state?.fundConfig) ;
    const history = useLocation();
    const params = useParams();
    const isUpsalaEnabled = isUpsalaEnable(fundConfig?.config)
    // let identity_id_value = '';
    // if (params.identity_id) {
    //     identity_id_value = '/' + params.identity_id
    // }
    // if (params.account_id) {
    //     identity_id_value = identity_id_value + '/' + params.account_id
    // }
    return (
        <div className="card-header">
           
                <h4 className="card-header-title">
                    {props?.title}
                </h4>
            
            <ul className="nav nav-tabs nav-tabs-sm card-header-tabs me-2">
                <li className="nav-item">
                    <Link to={`/${params?.fund_id}/kyw/wallets/list`} className={history.pathname.indexOf("wallets/list") > -1 ?"nav-link active":"nav-link"}>Wallets</Link>
                </li>
             {checkPermissions("PERIODIC_REVIEW_LIST") &&   <li className="nav-item">
                    <Link to={`/${params?.fund_id}/kyw/periodic-review/list`} className={history.pathname.indexOf("periodic-review/list") > -1 ?"nav-link active":"nav-link"}>Periodic Review</Link>
                </li>}
               {isUpsalaEnabled &&( <li className="nav-item">
                    <Link to={`/${params?.fund_id}/kyw/quick-scan/list`} className={history.pathname.indexOf("quick-scan/list") > -1 ?"nav-link active":"nav-link"}>Quick Scan</Link>
                </li>)}
            </ul>
            {history.pathname.indexOf("account/list") > -1 ? (
                <a href="#!" className="btn btn-sm btn-white">Download</a>
            ) : null
            }

        </div>
    );
}
