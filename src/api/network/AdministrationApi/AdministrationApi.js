import { processRequest } from "./../CustomerNetwork";
import axios from "axios";
let baseURLType = window.BaseUrl;
if (localStorage.getItem("x-auth-token")) axios.defaults.headers = { "x-auth-token": localStorage.getItem("x-auth-token") };

let baseURL = localStorage.getItem("base_url");
let entityId = localStorage.getItem("entity_id");
if (baseURL === null && isSubDomain() === true && window.location.host.split(".")[0] != "portal") {
  // location.reload()
}

function isSubDomain() {
  let url = window.location.href;
  if (url.split(".").length == 2) {
    return false;
  } else {
    return true;
  }
}

export function getErrorResponse(error) {

  let customResponse = [];
  try {
    if (error.data?.masssage == "timeout exceeded") {
      customResponse.success = false;
      customResponse.status_code = { key: "failed", value: -1, name: "timeout" };
      customResponse.user_message = "Timeout Exceeded";
    } else if (error && error?.toJSON().message === "Network Error") {
      customResponse.success = false;
      customResponse.status_code = { key: "failed", value: -1, name: "network" };
      customResponse.user_message = "Internet problem";
    } else {
      customResponse = error?.response.data;
      !!error && console.error(`FAILED API = ${error.response.config.url} | Error Code = ${customResponse.status_code?.value} | System Message = ${customResponse.system_message}`);
      !!!error && console.log("FAILED API with undefined error");
    }
  } catch (e) {
    console.log(e, "error catch");
    customResponse.success = false;
    customResponse.status_code = { key: "failed", value: -1, name: "network" };
    customResponse.user_message = "Internet problem";
  }
  return customResponse;
}

export const getFilterFundsAPI = async (name, region, limit, offset, cancelToken) => {
  //http://localhost:8384/7175c8f1-f37b-41b0-8abf-b524bf7e81fc/AAPI/domain/summary?region=singapore&name=dem&offset=0&limit=100
  const url = `/${entityId}/${baseURL}/domain/summary?offset=${offset}&limit=${limit}${region != null ? `&region=${region}` : ""}${name != "" ? `&name=${name}` : ""}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getAccountListAPI = async (fundId, limit, offset, cancelToken) => {
  const url = `/${entityId}/${baseURL}/Account/list?fund_id=${fundId}&offset=${offset}&limit=${limit}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getAccountListSearch = async (name, fundId, limit, offset, cancelToken) => {
  //http://localhost:8384/7175c8f1-f37b-41b0-8abf-b524bf7e81fc/AAPI/Account/list?fund_id=3&offset=1935&limit=5&identityName=Talha
  const url = `/${entityId}/${baseURL}/Account/list?fund_id=${fundId}&offset=${offset}&limit=${limit}&identityName=${name}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getExpiryDocumentAPI = async (fundId, type, cancelToken, offset = 0, limit = 10) => {
  ///:entityId/AAPI/documents-expiring/:fundId
  const url = `/${entityId}/${baseURL}/documents-expiry/${fundId}?offset=${offset}&limit=${limit}&type=${type}`;
  // const url = `/${entityId}/${baseURL}/documents-expiring/${fundId}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getExpiredDocumentAPI = async (fundId, type, cancelToken, offset = 0, limit = 10) => {
  ///:entityId/AAPI/documents-expiring/:fundId
  const url = `/${entityId}/${baseURL}/documents-expiry/${fundId}?offset=${offset}&limit=${limit}&type=${type}`;
  // const url = `/${entityId}/${baseURL}/documents-expiring/${fundId}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getPeriodicReviewAPI = async (fundId, offset, limit, cancelToken) => {
  //?offset=${data?.offset}&limit=${data?.limit}
  const url = `/${entityId}/${baseURL}/${fundId}/fundPeriodicReviews?offset=${offset}&limit=${limit}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getDueDiligenceAPI = async (fundId, data, cancelToken) => {
  console.log(data, "data data data data data data data data data data data data data data");
  let url = "";
  if (data?.type === null) {
    url = `/${entityId}/${baseURL}/${fundId}/on-going-due-diligence/?offset=${data?.offset}&limit=${data?.limit}&filter=${data?.filter}&name=${data?.name}&sDate=${data?.startDate}&eDate=${data?.endDate}`;
  } else {
    url = `/${entityId}/${baseURL}/${fundId}/on-going-due-diligence/?offset=${data?.offset}&limit=${data?.limit}&type=${data?.type}&filter=${data?.filter}&name=${data?.name}&sDate=${data?.startDate}&eDate=${data?.endDate}`;
  }
  // const url = `/${entityId}/${baseURL}/${fundId}/on-going-due-diligence/?offset=${data?.offset}&limit=${data?.limit}&type=${data?.type}&filter=${data?.filter}&name=${data?.name}&sDate=${data?.startDate}&eDate=${data?.endDate}`;
  const request = { type: "GET", urlString: url, params: data };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getQuickScanListAPI = async (fundId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fundId}/getQuickScanList`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getRestrictedListAPI = async (fundId, offset, limit, cancelToken) => {
  // const url = `/${entityId}/${baseURL}/${fundId}/restricted-lists`;
  //https://example.com/api/items?offset=${pageIndex * requestedPageSize}&limit=${requestedPageSize}
  const url = `/${entityId}/${baseURL}/restricted-list?offset=${offset}&limit=${limit}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getParticularFieldsApi = async (account_id = null, cancelToken, fund_id = null) => {
  var url = `/${entityId}/${baseURL}/Identity/fields`;
  if (account_id) {
    url = `/${entityId}/${baseURL}/Identity/fields?accountId=${account_id}`;
  }
  if (fund_id) {
    url = `/${entityId}/${baseURL}/Identity/fields?fundId=${fund_id}`;
  }
  const request = { type: "GET", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getSingleDocument = async (documentId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/document`;
  const request = { type: "POST", urlString: url, params: { identity_document_id: documentId } };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const postIdentityAPI = async (data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/Identity/create`;
  const request = { type: "POST", urlString: url, params: data };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
//http://localhost:8384/7175c8f1-f37b-41b0-8abf-b524bf7e81fc/AAPI/21/fund-transactions-alert-update
export const postTransactionStatus = async (fundId, data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fundId}/fund-transactions-alert-update`;
  const request = { type: "POST", urlString: url, params: data };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getParticularsDetailByIdentityIdAPI = async (identity_id, cancelToken) => {
  const url = `/${entityId}/${baseURL}/Identity/${identity_id}/get`;
  const request = { type: "GET", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
//geet screening report
export const getScreeningSummaryReport = async (fund_id, screening_id, cancelToken) => {
  //http://localhost:8384/AAPI/3/ScreeningSummaryReport?id=350
  const url = `/${baseURL}/${fund_id}/ScreeningSummaryReport?id=${screening_id}`;
  const request = { type: "GET", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getCRPsByIdentityIdAPI = async (identityId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/Identity/${identityId}/Crp/list`;
  const request = { type: "GET", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const postIdentityDocument = async (data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/IdentityDocument/add`;
  const request = { type: "POST", urlString: url, params: data };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const postVerifyUploadDocument = async (identityId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/IdentityDocument/${identityId}/verifyUpload`;
  const request = { type: "POST", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getIdentityDocument = async (identityId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/Identity/${identityId}/documents`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getCrpRoleMetaAPI = async (cancelToken) => {
  const url = `/crp-roles-meta`;
  const request = { type: "GET", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getIdentityList = async (cancelToken) => {
  const url = `/${entityId}/${baseURL}/Identity/list`;
  const request = { type: "GET", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const updateRestrictedList = async (data, id, cancelToken) => {
  const url = `/${entityId}/${baseURL}/restricted-list/${id}`;
  const request = { type: "PUT", urlString: url, params: data };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const updateCustomerToRestrictedList = async (data, restrictedListId, customerId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/restricted-list/${restrictedListId}/customers/${customerId}`;
  const request = { type: "PUT", urlString: url, params: data };
  try {
    console.log("error no", cancelToken);
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    console.log("error", error);
    return getErrorResponse(error);
  }
};
export const postQuickScanAPI = async (fund_id, data, cancelToken) => {
  

  const url = `/${entityId}/${baseURL}/${fund_id}/doQuickScan`;
  const request = { type: "POST", urlString: url, params: data };
  try {
    console.log("error no", cancelToken);
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    console.log("error", error);
    return getErrorResponse(error);
  }
};
export const worldCheckAPI = async (fund_id, data, cancelToken) => {
  // http://localhost:8384/:entityId/AAPI/:fundId/WCdocumentTypes
  const url = `/${entityId}/${baseURL}/${fund_id}/WCdocumentTypes`;
  const request = { type: "GET", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getRequiredDocument = async (accountId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/Account/requiredDocuments/${accountId}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getDocumentListAPI = async (cancelToken) => {
  const url = `organizations/ascent-fs/funds/demo/document-types`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getScreeningAPI = async (fund_id, identity_id, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fund_id}/screening/identity/screening?identityId=${identity_id}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
///:entityId/AAPI/fund/:fundId/identity/:identityId/screening-history

export const getScreeningPreviousHistoryAPI = async (fund_id, identity_id, cancelToken) => {
  const url = `/${entityId}/${baseURL}/fund/${fund_id}/identity/${identity_id}/screening-history`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getCustomerScreeningPullAPI = async (data, cancelToken) => {
  const url = `/getQueueStatusPulling`;
  const request = { type: "POST", urlString: url, params: data };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getAllRescreenCaseAPI = async (fund_id, data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fund_id}/screening/identity/rescreening`;
  const request = { type: "PUT", urlString: url, params: data };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getScreeningDetailAPI = async (fund_id, id, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fund_id}/screening/detail?id=${id}`;
  const request = { type: "GET", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const updateScreeningStatusAPI = async (fund_id, data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fund_id}/screening/document/updateStatus`;
  const request = { type: "PUT", urlString: url, params: data };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const submitScreeningConclusionAPI = async (fund_id, data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fund_id}/screening/customer/conclusion`;
  const request = { type: "PUT", urlString: url, params: data };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getRiskAssessmentAPI = async (fund_id, identity_id, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fund_id}/identityRiskReport?identityId=${identity_id}`;
  const request = { type: "GET", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getRiskAssessmentOverAllAPI = async (fund_id, identity_id, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fund_id}/OverAllRisk?identityId=${identity_id}`;
  const request = { type: "GET", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const handleSubmitRiskAssessmentAPI = async (fund_id, data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fund_id}/addRiskStatus`;
  const request = { type: "PUT", urlString: url, params: data };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getDomainsList = async (cancelToken) => {
  const url = `/${entityId}/${baseURL}/domain/list`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getRestrictedListCustomer = async (listId, offset, limit, cancelToken) => {
  let url = `/${entityId}/${baseURL}/restricted-list/${listId}/customers`;
  if (limit) {
    url = `${url}?offset=${offset}&limit=${limit}`;
  }
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const postRestrictedList = async (data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/restricted-list`;
  const request = { type: "POST", urlString: url, params: data };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const postCustomerToRestrictedList = async (data, listId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/restricted-list/${listId}/customers`;
  const request = { type: "POST", urlString: url, params: data };
  try {
    console.log("error no", cancelToken);
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    console.log("error", error);
    return getErrorResponse(error);
  }
};

export const getPreviousRiskAssessmentAPI = async (fundId, identity_id, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fundId}/previousRiskAssessments?identityId=${identity_id}`;
  const request = { type: "GET", urlString: url };
  try {
    console.log("error no", cancelToken);
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    console.log("error", error);
    return getErrorResponse(error);
  }
};

export const getQuickScanScreeningDetailAPI = async (fund_id, id, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fund_id}/screening/detail?id=${id}`;
  const request = { type: "GET", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getNotificationAPI = async (fund_id, isExtended, cancelToken) => {
  let url = ``;
  if (isExtended) {
    url = `/${entityId}/${baseURL}/get/entity/notifications?extended=true&domainId=${fund_id}`;
  } else {
    url = `/${entityId}/${baseURL}/get/entity/notifications?extended=false`;
  }
  const request = { type: "GET", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getSingleAccountDetailByIdAPI = async (accountId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/Account/detail/${accountId}`;
  const request = { type: "GET", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const postIdentityCreateAPI = async (fund_id, data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fund_id}/create-entity`;
  const request = { type: "POST", urlString: url, params: data };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getFlatCPRListAPI = async (identity_id, accountId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/Identity/${identity_id}/account/${accountId}/Crp/flatlist?extended=true`;
  const request = { type: "GET", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

// export const getFlatCPRListAPI = async (identity_id, cancelToken) => {
//   const url = `/${entityId}/${baseURL}/Identity/${identity_id}/Crp/flatlist?extended=true`
//   const request = { type: "GET", urlString: url }
//   try {
//     const response = await processRequest(request, cancelToken)
//     return response.data
//   } catch (error) {
//     return getErrorResponse(error)
//   }
// }
export const getWalletAddressListAPI = async (fundId, limit, offset, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fundId}/getFundWalletAddress?offset=${offset}&limit=${limit}`;
  const request = { type: "GET", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const uploadTransactionCSVAPI = async (data, fundId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fundId}/addAccountsCSV`;
  const request = { type: "POST", urlString: url, params: data };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const uploadCustomersCSVAPI = async (data, cancelToken) => {
  //http://localhost:8384/:entityId/AAPI/import-customer-From-V1
  const url = `/${entityId}/${baseURL}/import-customer-From-V1`;
  const request = { type: "POST", urlString: url, params: data };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getTransactionListAPI = async (fundId, limit, offset, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fundId}/getFundWalletAddress?offset=${offset}&limit=${limit}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getWalletScreeningAPI = async (fundId, walletID, cancelToken) => {
  const url = `/${entityId}/${baseURL}/Wallet/${walletID}/screening`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getWalletRescreenCaseAPI = async (fundId, walletID, cancelToken) => {
  const url = `/${entityId}/${baseURL}/Wallet/${walletID}/rescreening`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getWalletAddressQuickScanListAPI = async (fund_id, limit, offset, cancelToken) => {
  const url = `/${entityId}/${baseURL}/fund/${fund_id}/quickScanList?offset=${offset}&limit=${limit}`;
  const request = { type: "GET", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const submitWalletAddressQuickScanAPI = async (data, fund_id, cancelToken) => {
  const url = `/${entityId}/${baseURL}/fund/${fund_id}/doQuickScan`;
  const request = { type: "POST", urlString: url, params: data };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getCryptoCurrencyChainListAPI = async (fundId = null, cancelToken) => {
  let url = `/${entityId}/${baseURL}/upsala/getSuppotedNetworks`;
  if (fundId) {
    url = `/${entityId}/${baseURL}/upsala/getSuppotedNetworks?fund_id=${fundId}`;
  }
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getTransactionAccountCount = async (fundId, cancelToken) => {
  ///:entityId/AAPI/:fundId/Account-transactions-count
  const url = `/${entityId}/${baseURL}/${fundId}/Account-transactions-count`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getAllFundTransaction = async (fundId, limit, offset, cancelToken) => {
  ///:entityId/AAPI/:fundId/Account-transactions-count
  const url = `/${entityId}/${baseURL}/${fundId}/fund-transactions?offset=${offset}&limit=${limit}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getAllFundTransactionMonitoringAPI = async (fundId, limit, offset, cancelToken) => {
  ///:entityId/AAPI/:fundId/Account-transactions-count
  const url = `/${entityId}/${baseURL}/${fundId}/fund-transactions?offset=${offset}&limit=${limit}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
//http://localhost:8384/7175c8f1-f37b-41b0-8abf-b524bf7e81fc/AAPI/21/fund-transactions-summary
export const getAllFundTransactionSummaryAPI = async (fundId, cancelToken) => {
  ///:entityId/AAPI/:fundId/Account-transactions-count
  const url = `/${entityId}/${baseURL}/${fundId}/fund-transactions-summary`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getAllFundTransactionAlertsAPI = async (fundId, limit, offset, cancelToken) => {
  ///:entityId/AAPI/:fundId/Account-transactions-count
  const url = `/${entityId}/${baseURL}/${fundId}/fund-transactions-alerts?offset=${offset}&limit=${limit}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const deleteFundCsvAccount = async (fundid, cancelToken) => {
  //http://localhost:8384/1744d155-fe74-4807-a187-517b1530f8fe/AAPI/1/deleteFundCsvAccounts
  const url = `/${entityId}/${baseURL}/${fundid}/deleteFundCsvAccounts`;
  const request = { type: "DELETE", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getFundDetailAPI = async (fundId, cancelToken) => {
  const url = `/fund/get/${fundId}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getWalletScreeningHistoryAPI = async (wallet_id, limit, offset, cancelToken) => {
  const url = `/${entityId}/${baseURL}/Wallet/${wallet_id}/screening/history?offset=${offset}&limit=${limit}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const downloadWalletReportAPI = async (fund_id, wallet_id, cancelToken) => {
  const url = `/${entityId}/${baseURL}/wallet/${wallet_id}/downloadWalletReport`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getFundConfigurationAPI = async (fund_id, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fund_id}/getEntityFundConfig`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const updateFundConfigurationAPI = async (fund_id, data, cancelToken) => {
  delete data["administration"];
  const url = `/${entityId}/${baseURL}/${fund_id}/updateOrganizationFundConfig`;
  const request = { type: "PUT", urlString: url, params: data };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getDownloadCustomerProfileAPI = async (fund_id, identity_id, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fund_id}/getIdentityPdfReport?identityId=${identity_id}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getDownloadAuditReport = async (fund_id, account_id, cancelToken) => {
  ///:entityId/AAPI/fund/:fundId/account/:accountId/application-history

  const url = `/${entityId}/${baseURL}/fund/${fund_id}/account/${account_id}/application-history`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getDownloadCustomerProfilePullAPI = async (fund_id, identity_id, dateTime, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fund_id}/getIdentityPdfReportPolling?id=${identity_id}&dateTime=${dateTime}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

//document configurations
export const getDocumentListForConfiguration = async (fund_id, cancelToken) => {
  ///:entityId/AAPI/:fundId/documents-list
  const url = `/${entityId}/${baseURL}/${fund_id}/documents-list`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getRiskMatrixAPI = async (fund_id, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fund_id}/getRiskFactorsList`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const updateRiskMatrixAPI = async (fund_id, data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fund_id}/updateRiskFactor`;
  const request = { type: "PUT", urlString: url, params: data };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const setDefaultResetMatrixAPI = async (fund_id, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fund_id}/setDefaultRiskMatrix`;
  const request = { type: "PUT", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getSingleDowJonesResultAPI = async (fund_id, id, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fund_id}/DjProfile?Profile_id=${id}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getRiskAssessmentTabStatusAPI = async (fund_id, identity_id, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fund_id}/Identity/RiskTabStatus?identityId=${identity_id}`;
  const request = { type: "GET", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

//delete document from configuration
export const deleteEntityDocumentFromConfiguration = async (fundid, id, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fundid}/document-remove?id=${id}`;
  const request = { type: "DELETE", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
//delete soft account
export const deleteEntityAccount = async (id, cancelToken) => {
  //http://localhost:8384/entityid/CAPI/Account/60b196c9-ee7e-4f1b-9b66-4f2e435f1e88

  const url = `/${entityId}/${baseURL}/Account/${id}`;
  const request = { type: "DELETE", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
//http://localhost:8384/:entityId/AAPI/restricted-lists/6
export const deleteRestrictedList = async (id, cancelToken) => {
  const url = `/${entityId}/${baseURL}/restricted-list/${id}`;
  const request = { type: "DELETE", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getComplianceDataAPI = async (account_id, identity_id, cancelToken) => {
  const url = `/${entityId}/${baseURL}/Account/${account_id}/IdentityId/${identity_id}/getCompilance`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

//get document types
///:entityId/AAPI/:fundId/document-types
export const getDocumentTypes = async (fund_id, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fund_id}/document-types?scope=false`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

//documnet post api config
export const documentAddPostApi = async (fundId, data, cancelToken) => {
  ///:entityId/AAPI/:fundId/document-add
  const url = `/${entityId}/${baseURL}/${fundId}/document-add`;
  const request = { type: "POST", urlString: url, params: data };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const postComplianceAPI = async (account_id, identity_id, data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/Account/${account_id}/IdentityId/${identity_id}/saveCompilance`;
  const request = { type: "POST", urlString: url, params: data };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const handleAddNewFundAPI = async (data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/Account/${account_id}/IdentityId/${identity_id}/saveCompilance`;
  const request = { type: "POST", urlString: url, params: data };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getInvestmentTransactionAPI = async (account_id, cancelToken) => {
  // const url = `/${entityId}/${baseURL}/Account/transactions/${account_id}`;
  const url = `/${entityId}/${baseURL}/getAccountSubscriptionDocs?accountId=${account_id}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getDownloadDocuSignAPI = async (transactionID, dataToSend, cancelToken) => {
  const url = `/${entityId}/${baseURL}/transaction/${transactionID}/download-sign-document`;
  const request = { type: "POST", urlString: url, params: dataToSend };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getCustomerListAPI = async (data, cancelToken) => {
  let url = "";
  if (data?.customerType === null) {
    url = `/${entityId}/${baseURL}/Entity/CustomerList?label=${data?.label}&offset=${data?.offset}&limit=${data?.limit}`;
  } else {
    url = `/${entityId}/${baseURL}/Entity/CustomerList?customerType=${data?.customerType}&label=${data?.label}&offset=${data?.offset}&limit=${data?.limit}`;
  }
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const handleSubmitScreeningApi = async (identityId, accountId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${identityId}/${accountId}/application/submit`;
  const request = { type: "POST", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

//post
// /:entityId/AAPI/:fundId/reference-Document-Upload-SignedURL
// payload
//    content_type: Joi.string().required(),
//             random_key: Joi.string().required()

export const handleRefrenceUploadDoc = async (fundId, data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fundId}/reference-Document-Upload-SignedURL`;
  const request = { type: "POST", urlString: url, params: data };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getRequiredDocumentCRP = async (accountId, identityId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/Account/requiredDocuments/${accountId}?identityId=${identityId}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getEntityTypeAPI = async (cancelToken) => {
  const url = `/${entityId}/${baseURL}/entity-types-list`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getWalletAddressListSpecificIdentityAPI = async (identityId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${identityId}/getIdentityWalletAddress`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getAuthUserDetail = async (cancelToken) => {
  const url = `/auth/userDetails`;
  const request = { type: "GET", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const handleSyncFundsAPI = async (cancelToken) => {
  const url = `/${entityId}/${baseURL}/entity-fund-sync`;
  const request = { type: "POST", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getPermissionAPI = async (fund_id, data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fund_id}/getEntityPermissions`;
  const request = { type: "POST", urlString: url, params: data };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getResultSearchIdentity = async (searchString, fundId, cancelToken) => {
  //http://localhost:8384/7175c8f1-f37b-41b0-8abf-b524bf7e81fc/AAPI/domain/summary?region=singapore&name=dem&offset=0&limit=100
  const url = `/${entityId}/${baseURL}/${fundId}/search/identity?searchString=${searchString}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const postIdentityAttatchWithFund = async (identityId, data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/Identity/${identityId}/attach`;
  const request = { type: "POST", urlString: url, params: data };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
//://localhost:8384/7175c8f1-f37b-41b0-8abf-b524bf7e81fc/AAPI/entity/Identity/list
// export const postIdentityList = async (entityIdData, cancelToken) => {
//   // const url = `/${entityId}/${baseURL}/entity/Identity/list`http://localhost:8385/7175c8f1-f37b-41b0-8abf-b524bf7e81fc/AAPI/3/fundStatus;
//   const url = `/${entityId}/${baseURL}/identityEntity/${entityIdData}/list`;
//   const request = { type: "GET", urlString: url };

//   try {
//     const response = await processRequest(request, cancelToken)
//     return response.data
//   } catch (error) {
//     return getErrorResponse(error)
//   }
// }
export const postIdentityList = async (data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/entity/Identity/list`;
  const request = { type: "POST", urlString: url, params: data };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

//'/:entityId/AAPI/customers/Identity/create
// payload body me customerEntityId lazmi bhejni he

export const postCustomerIdentityCreateAPI = async (data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/customers/Identity/create`;
  const request = { type: "POST", urlString: url, params: data };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getDataSignedUrl = async (data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/getDataSignedUrl`;
  const request = { type: "POST", urlString: url, params: data };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const updateFaceVerificationStatus = async (data, cancelToken, fundId, accountShareHolderId) => {
  //url : PUT | http://localhost:8384/:entityId/AAPI/:fundId/face/AccountShareHolder/:accountShareHolderId/updateStatus
  const url = `/${entityId}/${baseURL}/${fundId}/face/AccountShareHolder/${accountShareHolderId}/updateStatus`;
  const request = { type: "PUT", urlString: url, params: data };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

// export const getDataSignedUrl = async (data, cancelToken) => {
//   const url = `/${entityId}/${baseURL}/getDataSignedUrl`;
//   const request = { type: "POST", urlString: url, params: data };
//   try {
//     const response = await processRequest(request, cancelToken);
//     return response.data;
//   } catch (error) {
//     return getErrorResponse(error);
//   }
// };

//PUT | http://localhost:8384/:entityId/AAPI/:fundId/vcip/AccountShareHolder/:accountShareHolderId/updateStatus
export const updatVcipStatus = async (fundId, accountShareHolderId, data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fundId}/vcip/AccountShareHolder/${accountShareHolderId}/updateStatus`;
  const request = { type: "PUT", urlString: url, params: data };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getAgeingReport = async (currentDate, ageingReportType,cancelToken) => {
  //http://localhost:8384/7175c8f1-f37b-41b0-8abf-b524bf7e81fc/AAPI/ageing-report?entityBase=true&dateTime&key=1c693468-fcb0-4edc-baf8-acc992bc0e31
  //http://localhost:8384/7175c8f1-f37b-41b0-8abf-b524bf7e81fc/AAPI/ageing-report?entityBase=true
  //http://localhost:8384/7175c8f1-f37b-41b0-8abf-b524bf7e81fc/AAPI/ageing-report?mode=csv&entityBase=true&timeZone=Asia/Karachi
  const url = `/${entityId}/${baseURL}/ageing-report?mode=${ageingReportType}&entityBase=true&timeZone=${currentDate}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getAgeingReportWithKey = async (key, currentDate,ageingReportType, cancelToken) => {
  const url = `/${entityId}/${baseURL}/ageing-report?mode=${ageingReportType}&entityBase=true&timeZone=${currentDate}&key=${key}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getSingleWorldCheckResultAPI = async (fundId, id, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fundId}/WCRecord?record_id=${id}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getSanctionListReportDownload = async (fundId, id, identityId, cancelToken) => {
  //http://localhost:8384/7175c8f1-f37b-41b0-8abf-b524bf7e81fc/AAPI/27/e1693cb9-0f45-4031-bf45-075ba07db517/WCReport?record_id=e_tr_wco_1897830
  //http://localhost:8384/7175c8f1-f37b-41b0-8abf-b524bf7e81fc/AAPI/3/525f2f47-ac05-44c3-82ca-b00bafe931a2/WCRecord?record_id=e_tr_wci_7043979

  const url = `/${entityId}/${baseURL}/${fundId}/${identityId}/WCReport?record_id=${id}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

//soft delete crp
export const deleteCrp = async (identityId, cancelToken) => {
  //http://localhost:8384/173dad6c-b543-4d24-812e-3a306f7e4f14/CAPI/Identity/0b873004-c5a8-40d3-bbe2-c5b9d6ab1465/delete
  const url = `/${entityId}/${baseURL}/Identity/${identityId}/delete`;
  const request = { type: "DELETE", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const deleteTransaction = async (accountId, id, cancelToken) => {
  ///:entityId/AAPI/:accountId/deleteAccountTransaction
  //http://localhost:8384/173dad6c-b543-4d24-812e-3a306f7e4f14/CAPI/Identity/0b873004-c5a8-40d3-bbe2-c5b9d6ab1465/delete
  //?id=4f9bcf5b-455e-4189-8302-08352963fd7e
  const url = `/${entityId}/${baseURL}/${accountId}/deleteAccountTransaction?id=${id}`;
  const request = { type: "DELETE", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

//geet country list
export const getCountryListSettings = async (cancelToken) => {
  const url = `/${entityId}/${baseURL}/getCountryList`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const updateCountryListSettings = async (data, cancelToken) => {
  //router.put('/:entityId/AAPI/updateCountryRiskRatingScore',
  const url = `/${entityId}/${baseURL}/updateCountryRiskRatingScore`;
  const request = { type: "PUT", urlString: url, params: data };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getTransactionStockListAPI = async (cancelToken) => {
  const url = `/${entityId}/${baseURL}/getStockTmRulesList`;
  const request = { type: "GET", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
//http://localhost:8385/7175c8f1-f37b-41b0-8abf-b524bf7e81fc/AAPI/3/fundStatus
export const getfundStatusesCount = async (fundId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fundId}/fundStatus`;
  const request = { type: "GET", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const downloadTransactionReportAPI = async (
  mode,
  fundId,
  cancelToken,
) => {
  const url = `/${entityId}/${baseURL}/${fundId}/fund-transactions-alerts-report?mode=${mode}`;
  //http://localhost:8384/7175c8f1-f37b-41b0-8abf-b524bf7e81fc/AAPI/1/fund-transactions-alerts-report?mode=csv
  const request = { type: 'GET', urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getDownloadQuickScanReportAPI = async (fundId, screeningId, referenceId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fundId}/QuickScanRecord?id=${screeningId}&record_id=${referenceId}`;
  const request = { type: "GET", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const DownloadQuickScanAllReportAPI = async (fundId, screeningId, engines, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${fundId}/QuickScanReport?id=${screeningId}&Sanction_List=${engines?.Sanction_List}&Adverse_Media_News=${engines?.Adverse_Media_News}&Internal_List=${engines?.Internal_List}`;
  const request = { type: "GET", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getConsumptionReport = async (startDate, endDate, cancelToken) => {
  //http://localhost:8384/7175c8f1-f37b-41b0-8abf-b524bf7e81fc/AAPI/consumptionDetails?startDate=2020-10-05 16:52:58&endDate=2024-10-05 16:52:58
  const url = `/${entityId}/${baseURL}/consumptionDetails?startDate=${startDate}&endDate=${endDate}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getScreeningSummaryReportPollingAPI = async (fundId, screeningId, key = null, cancelToken) => {
  //http://localhost:8384/7175c8f1-f37b-41b0-8abf-b524bf7e81fc/AAPI/consumptionDetails?startDate=2020-10-05 16:52:58&endDate=2024-10-05 16:52:58
  let url = `/${entityId}/${baseURL}/${fundId}/ScreeningSummaryReport?id=${screeningId}`;
  if (key) {
    url = `/${entityId}/${baseURL}/${fundId}/ScreeningSummaryReport?id=${screeningId}&key=${key}`;
  }

  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getSigatoryDataAPI = async (fundId, cancelToken) => {
  let url = `/${entityId}/${baseURL}/${fundId}/getSignatoryListForFund`;
  const request = { type: "GET", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getTrustyDataAPI = async (fundId, cancelToken) => {
  let url = `/${entityId}/${baseURL}/${fundId}/getTrustyListForFund`;
  const request = { type: "GET", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const doESignComplianceAPI = async (data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/generateAdharSign`;
  const request = { type: "POST", urlString: url, params: data };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const doESignGenerateAPI = async (data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/generateProceedAadharSignUrl`;
  const request = { type: "POST", urlString: url, params: data };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getCustomTransactionAPI = async (accountId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/Account/transactions/${accountId}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const submitCustomTransactionDataAPI = async (accountId, data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${accountId}/addAccountTransaction`;
  const request = { type: "POST", urlString: url, params: data };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const updateCustomTransactionDataAPI = async (accountId, data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${accountId}/updateAccountTransactionStatus`;
  const request = { type: "PUT", urlString: url, params: data };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getTranactionStatusList = async (accountId, transactionId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${accountId}/getAccountTransactionStatusHistory?id=${transactionId}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const fetchExportDataForEntityOrIdentity = async (fundId, cancelToken) => {
  // Construct the URL with fundId as a query parameter if it exists
  const url = `/${entityId}/${baseURL}/data-export${fundId ? `?fund_id=${fundId}` : ""}`;

  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const fetchEntityReport = async (key, cancelToken) => {
  const url = key ? `/${entityId}/${baseURL}/data-export?key=${key}` : `/${entityId}/${baseURL}/data-export`;

  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const fetchDomainReport = async (fundId, key, cancelToken) => {
  //http://localhost:8384/7175c8f1-f37b-41b0-8abf-b524bf7e81fc/AAPI/data-export?fund_id=1&key=a2356a28-9345-4dc0-ae48-a53ac181c1ee
  const url = !key ? `/${entityId}/${baseURL}/data-export?fund_id=${fundId}` : `/${entityId}/${baseURL}/data-export?fund_id=${fundId}&key=${key}`;

  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getCustomerInformationReport = async (identityId, fundId, cancelToken) => {
  //router.get('/:entityId/AAPI/:fundId/identity/:identityId/customer-info-report',

  const url = `/${entityId}/${baseURL}/${fundId}/identity/${identityId}/customer-info-report`;

  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getBankIdentitiesAPI = async (identityId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/${identityId}/getIdentityBankList`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const updateBankStatusAPI = async (data, cancelToken) => {
  // http://localhost:8384/7175c8f1-f37b-41b0-8abf-b524bf7e81fc/AAPI/updateBankIdentityStatus
  const url = `/${entityId}/${baseURL}/updateBankIdentityStatus`;
  const request = { type: "PUT", urlString: url, params: data };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};


export const updateQuestionPerodic= async (data, fund_id, cancelToken) => {
  //put('/:entityId/AAPI/updateRiskReview')

  const url = `/${entityId}/${baseURL}/${fund_id}/updateRiskReview`;
  const request = { type: "PUT", urlString: url, params: data };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
}

export const handleDownloadStampDocumentAPI = async (data, cancelToken) => {
  const url = `/${entityId}/${baseURL}/getDataSignedUrl`;
  const request = { type: "POST", urlString: url, params: data };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};