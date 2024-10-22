import { Link, useLocation, useParams } from "react-router-dom"
import React from "react"
import FeatherIcon from "feather-icons-react"
export default function KycDynamicHeader({ ...props }) {
  const history = useLocation()
  const params = useParams()
  // let identity_id_value = '';
  // if (params.identity_id) {
  //     identity_id_value = '/' + params.identity_id
  // }
  // if (params.account_id) {
  //     identity_id_value = identity_id_value + '/' + params.account_id
  // }
  return (
    <div className="card-header">
      <h4 className="card-header-title">{props?.title}</h4>
      {/* <div className="card-header-icon">{props?.icon}</div> */}

      <ul className="nav nav-tabs nav-tabs-sm card-header-tabs me-2">
        <li className="nav-item">
          <Link
            to={`/${params?.fund_id}/kyc/account/list`}
            className={
              history.pathname.indexOf("account/list") > -1
                ? "nav-link active"
                : "nav-link"
            }
          >
            Accounts
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to={`/${params?.fund_id}/kyc/expiring-document/list`}
            className={
              history.pathname.indexOf("expiring-document/list") > -1
                ? "nav-link active"
                : "nav-link"
            }
          >
            Expiring Documents
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to={`/${params?.fund_id}/kyc/periodic-review/list`}
            className={
              history.pathname.indexOf("periodic-review/list") > -1
                ? "nav-link active"
                : "nav-link"
            }
          >
            Periodic Review
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to={`/${params?.fund_id}/kyc/due-diligence/list`}
            className={
              history.pathname.indexOf("due-diligence") > -1
                ? "nav-link active"
                : "nav-link"
            }
          >
            Due Diligence
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to={`/${params?.fund_id}/kyc/quick-scan/list`}
            className={
              history.pathname.indexOf("quick-scan") > -1
                ? "nav-link active"
                : "nav-link"
            }
          >
            Quick Scan
          </Link>
        </li>
      </ul>
      {history.pathname.indexOf("account/list") > -1 ? (
        <Link
          to={`/${params?.fund_id}/kyc/create/identity`}
          className="btn btn-sm btn-white"
        >
          <FeatherIcon icon="plus" color="green" size="14"></FeatherIcon>
          Create Customer
        </Link>
      ) : null}
    </div>
  )
}
