import { investorClientId } from ".";
import ResponseModel, {
  processError,
  processRequest,
  RequestType,
} from "./config";
import useEntityStore from "../store/useEntityStore";
// import {getErrorResponse }from "../api/network/CommonAPI";
const { entityId } = useEntityStore.getState();

const { baseURL } = "CAPI";

export function getErrorResponse(error) {
  console.log(error, "error error    error ");
  let customResponse = [];
  try {
    if (error.data?.masssage === "timeout exceeded") {
      customResponse.success = false;
      customResponse.status_code = {
        key: "failed",
        value: -1,
        name: "timeout",
      };
      customResponse.user_message = "Timeout Exceeded";
    } else if (error && error?.toJSON().message === "Network Error") {
      customResponse.success = false;
      customResponse.status_code = {
        key: "failed",
        value: -1,
        name: "network",
      };
      customResponse.user_message = "Internet problem";
    } else {
      customResponse = error?.response.data;
      !!error &&
        console.error(
          `FAILED API = ${error.response.config.url} | Error Code = ${customResponse.status_code?.value} | System Message = ${customResponse.system_message}`
        );
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

export const getToken = async (code, code_verifier, cancelToken) => {
  const customResponse = new ResponseModel();
  const url = `/auth/getToken?code=${code}&client_id=${investorClientId}&code_verifier=${code_verifier}`;
  const request = {
    type: RequestType.POST,
    urlString: url,
  };
  try {
    // setAxiosHeader({});
    const response = await processRequest(request, cancelToken);
    customResponse.response = response;
  } catch (error) {
    customResponse.error = processError(error);
  }
  return customResponse;
};

export const getEntities = async () => {
  const customResponse = new ResponseModel();
  const url = `/user/entities`;
  const request = {
    type: RequestType.GET,
    urlString: url,
  };
  try {
    const response = await processRequest(request);
    customResponse.response = response.data;
  } catch (error) {
    customResponse.error = processError(error);
  }
  return customResponse;
};

export const getEntityPermission = async (entityId, cancelToken) => {
  const customResponse = new ResponseModel();
  const url = `/user/entity/${entityId}/permissions`;
  const request = {
    type: RequestType.GET,
    urlString: url,
  };
  try {
    // setAxiosHeader({});
    const response = await processRequest(request, cancelToken);
    customResponse.response = response.data;
  } catch (error) {
    customResponse.error = processError(error);
  }
  return customResponse;
};

export const getIdentityCount = async (
  entityId,
  baseURL = "CAPI",
  cancelToken
) => {
  const customResponse = new ResponseModel();
  const url = `/${entityId}/${baseURL}/identityCount`;
  const request = {
    type: RequestType.GET,
    urlString: url,
  };
  try {
    // setAxiosHeader({});
    const response = await processRequest(request, cancelToken);
    customResponse.response = response.data;
  } catch (error) {
    customResponse.error = processError(error);
  }
  return customResponse;
};

export const getCustomerAccounts = async (offset, limit, cancelToken) => {
  if (!limit) {
    return;
  }
  const url = `/${entityId}/CAPI/Account/list?offset=${offset}&limit=${limit}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    // return getErrorResponse(error);
  }
};

export const getEntityTypeAPI = async (cancelToken) => {
  const url = `/${entityId}/CAPI/entity-types-list`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getFundForJoin = async (fundCode, cancelToken) => {
  const url = `/fund/get/${fundCode}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getRequiredDocument = async (accountId, cancelToken) => {
  const { entityId } = useEntityStore.getState();
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

export const getIdentityList = async (cancelToken, fundId) => {
  let url;
  fundId
    ? (url = `/${entityId}/CAPI/Identity/list?fundId=${fundId}`)
    : (url = `/${entityId}/CAPI/Identity/list`);

  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    // return getErrorResponse(error)
  }
};

export const verifyFundExist = async (data, cancelToken) => {
  //post url:CAPI/Account/list/verify
  const url = `/${entityId}/CAPI/Account/list/verify`;
  const request = { type: "POST", urlString: url, params: data };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getParticularFieldsFromFundIdApi = async (
  fund_id = null,
  cancelToken
) => {
  var url = `/${entityId}/CAPI/Identity/fields?fundId=${fund_id}`;
  const request = { type: "GET", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    // return getErrorResponse(error)
  }
};

export const getParticularsDetailByIdentityIdAPI = async (cancelToken) => {
  const url = `/${entityId}/CAPI/Identity/f7e650e3-21c2-43da-87bc-98ed9e3bd8c8/get`;
  const request = { type: "GET", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    // return getErrorResponse(error)
  }
};

export const postIdentityAPI = async (data, cancelToken) => {
  const url = `/${entityId}/CAPI/Identity/create`;
  const request = { type: "POST", urlString: url, params: data };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    // return getErrorResponse(error)
  }
};

export const logoutAPI = async (cancelToken) => {
  const url = `/auth/user/logout`;
  const request = { type: "POST", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const postIdentityAttatchWithFund = async (
  identityId,
  data,
  cancelToken
) => {
  const url = `/${entityId}/CAPI/Identity/${identityId}/attach`;
  const request = { type: "POST", urlString: url, params: data };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getRequiredDocumentCRP = async (cancelToken) => {
  const url = `/${entityId}/CAPI/Account/requiredDocuments/751550b6-e031-439c-bc7e-e2343ce52baf?identityId=f7e650e3-21c2-43da-87bc-98ed9e3bd8c8`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getRequiredDocumentAPI = async (accountId, cancelToken) => {
  const url = `/${entityId}/CAPI/Account/requiredDocuments/${accountId}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getCustomTransactionAPI = async (accountId, cancelToken) => {
  const url = `/${entityId}/CAPI/Account/transactions/${accountId}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getTransactionHistoryAPI = async (accountId, cancelToken) => {
  const url = `/${entityId}/CAPI/getAccountSubscriptionDocs?accountId=${accountId}`;
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
export const transactionDocAddApi = async (data, cancelToken) => {
  const url = `/${entityId}/CAPI/transaction-document`;
  const request = { type: "POST", urlString: url, params: data };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
//faceverification //application
export const getSingleAccountDetailByIdAPI = async (accountId, cancelToken) => {
  const url = `/${entityId}/CAPI/Account/detail/${accountId}`;
  const request = { type: "GET", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getParticularFieldsApi = async (account_id, cancelToken) => {
  var url = `/${entityId}/CAPI/Identity/fields`;
  if (account_id) {
    url = `/${entityId}/CAPI/Identity/fields?accountId=${account_id}`;
  }
  const request = { type: "GET", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getFlatCPRListAPI = async (cancelToken) => {
  //http://localhost:8386/8eadea60-a665-41ea-9428-4e46802c5faa/CAPI/Identity/9fd19b44-1e16-4606-9012-7e760e94f426/account/737cbfcf-ae57-46ed-b815-c8f792b8ff7e/Crp/flatlist?extended=true
  const url = `/${entityId}/CAPI/Identity/f7e650e3-21c2-43da-87bc-98ed9e3bd8c8/account/751550b6-e031-439c-bc7e-e2343ce52baf/Crp/flatlist?extended=true`;
  const request = { type: "GET", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const FaceVerificationApi = async (
  data,
  cancelToken,
  identityId,
  accountShareHolderId
) => {
  // http://localhost:8384/:entityId/CAPI/Identity/:identityId/AccountShareHolder/:accountShareHolderId/FaceVerification
  const url = `/${entityId}/CAPI/Identity/2fcd9229-6206-428c-9a81-fa70c4b3b147/AccountShareHolder/cd761a4e-aae3-4854-b298-a4186dc26e23/FaceVerification`;
  const request = { type: "POST", urlString: url, params: data };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getDataSignedUrl = async (data, cancelToken) => {
  const url = `/e00edd10-4270-4073-8c69-e0d718012999/CAPI/getDataSignedUrl`;
  const request = { type: "POST", urlString: url, params: data };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

//vcip

export const getVcipSignedUrl = async (
  data,
  identityId,
  accountShareHolderId,
  cancelToken
) => {
  const url = `/e00edd10-4270-4073-8c69-e0d718012999/CAPI/Identity/53c8a88a-cc42-4da4-958b-71e79df5ad5f/AccountShareHolder/${accountShareHolderId}/Vcip`;
  const request = { type: "POST", urlString: url, params: { location: data } };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const postVerifyUploadVideo = async (
  identityId,
  accountShareHolderId,
  data,
  cancelToken
) => {
  //VERIFY UPLOAD | PUT http://localhost:8384/:entityId/CAPI/Identity/:identityId/AccountShareHolder/:accountShareHolderId/Vcip/verifyUpload
  const url = `/e00edd10-4270-4073-8c69-e0d718012999/CAPI/Identity/53c8a88a-cc42-4da4-958b-71e79df5ad5f/AccountShareHolder/${accountShareHolderId}/Vcip/verifyUpload`;
  const request = { type: "PUT", urlString: url, params: data };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getWalletAddressListAPI = async (identityId, cancelToken) => {
  const url = `/${entityId}/CAPI/${identityId}/getIdentityWalletAddress`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const addWalletAddressAPI = async (data, identityId, cancelToken) => {
  const url = `/${entityId}/CAPI/${identityId}/addWalletAddress`;
  const request = { type: "POST", urlString: url, params: data };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const getBankIdentitiesAPI = async (identityId, cancelToken) => {
  const url = `/${entityId}/CAPI/${identityId}/getIdentityBankList`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
export const deleteBankWalletAPI = async (identityId, cancelToken) => {
  const url = `/${entityId}/CAPI/BankWalletIdentityDelete/${identityId}`;
  const request = { type: "DELETE", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const submitBankIdentityAPI = async (identityId, data, cancelToken) => {
  const url = `/${entityId}/CAPI/${identityId}/addBankAddress`;
  const request = { type: "POST", urlString: url, params: data };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getIdentityDocument = async (cancelToken) => {
  const url = `/${entityId}/CAPI/Identity/f7e650e3-21c2-43da-87bc-98ed9e3bd8c8/documents`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const getSingleDocument = async (documentId, cancelToken) => {
  const url = `/${entityId}/CAPI/document`;
  const request = {
    type: "POST",
    urlString: url,
    params: { identity_document_id: documentId },
  };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const postIdentityDocument = async (data, cancelToken) => {
  const url = `/${entityId}/CAPI/IdentityDocument/add`;
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

export const getCRPsByIdentityIdAPI = async (cancelToken) => {
  const url = `/${entityId}/CAPI/Identity/f7e650e3-21c2-43da-87bc-98ed9e3bd8c8/Crp/list`;
  const request = { type: "GET", urlString: url };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};

export const deleteDocument = async (documentId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/document/${documentId}/delete`;
  const request = {
    type: "DELETE",
    urlString: url,
    params: { identity_document_id: documentId },
  };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};
