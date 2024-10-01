import { investorClientId } from ".";
import ResponseModel, {
  processError,
  processRequest,
  RequestType,
} from "./config";
import useEntityStore from "../store/useEntityStore";
const { entityId } = useEntityStore.getState();

const { baseURL } = "CAPI"; 


export function getErrorResponse(error) {
  console.log(error, "error error    error ")
  let customResponse = []
  try {
    if (error.data?.masssage == "timeout exceeded") {
      customResponse.success = false
      customResponse.status_code = { key: "failed", value: -1, name: "timeout" }
      customResponse.user_message = "Timeout Exceeded"
    } else if (error && error?.toJSON().message === "Network Error") {
      customResponse.success = false
      customResponse.status_code = { key: "failed", value: -1, name: "network" }
      customResponse.user_message = "Internet problem"
    } else {
      customResponse = error?.response.data
      !!error &&
        console.error(
          `FAILED API = ${error.response.config.url} | Error Code = ${customResponse.status_code?.value} | System Message = ${customResponse.system_message}`
        )
      !!!error && console.log("FAILED API with undefined error")
    }
  } catch (e) {
    console.log(e, "error catch")
    customResponse.success = false
    customResponse.status_code = { key: "failed", value: -1, name: "network" }
    customResponse.user_message = "Internet problem"
  }
  return customResponse
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
  // console.log("in get api");
  const url = `/${entityId}/CAPI/Account/list?offset=${offset}&limit=${limit}`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    console.log("loginCustomer Response Headers", response);
    return response.data;
  } catch (error) {
    // return getErrorResponse(error);
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


//documents api
export const postIdentityAttatchWithFund = async (
  identityId,
  data,
  cancelToken
) => {
  const url = `/${entityId}/${baseURL}/Identity/${identityId}/attach`
  const request = { type: "POST", urlString: url, params: data }

  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}



export const getIdentityDocument = async (identityId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/Identity/${identityId}/documents`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {}
};


export const getRequiredDocumentCRP = async (
  accountId,
  identityId,
  cancelToken
) => {
  const url = `/${entityId}/${baseURL}/Account/requiredDocuments/${accountId}?identityId=${identityId}`
  const request = { type: "GET", urlString: url }

  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}



//faceverification
export const getSingleAccountDetailByIdAPI = async (accountId, cancelToken) => {
  const url = `/${entityId}/CAPI/Account/detail/c6ac4369-c4b1-4682-a661-4c4d1987c9cc`
  const request = { type: "GET", urlString: url }
  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}
export const FaceVerificationApi = async (
  data,
  cancelToken,
  identityId,
  accountShareHolderId
) => {
  // http://localhost:8384/:entityId/CAPI/Identity/:identityId/AccountShareHolder/:accountShareHolderId/FaceVerification
  const url = `/${entityId}/CAPI/Identity/2fcd9229-6206-428c-9a81-fa70c4b3b147/AccountShareHolder/cd761a4e-aae3-4854-b298-a4186dc26e23/FaceVerification`
  const request = { type: "POST", urlString: url, params: data }
  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
};

export const getDataSignedUrl = async (data, cancelToken) => {
  const url = `/${entityId}/CAPI/getDataSignedUrl`;
  const request = { type: "POST", urlString: url, params: data };
  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    return getErrorResponse(error);
  }
};