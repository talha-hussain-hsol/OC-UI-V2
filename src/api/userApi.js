import { investorClientId } from ".";
import ResponseModel, {
  processError,
  processRequest,
  RequestType,
} from "./config";
import useEntityStore from "../store/useEntityStore";
const { entityId } = useEntityStore.getState();

const { baseURL } = "CAPI"; // Zustand store se entityId le lo

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

export const getIdentityDocument = async (identityId, cancelToken) => {
  const url = `/${entityId}/CAPI/Identity/${identityId}/documents`;
  const request = { type: "GET", urlString: url };

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {}
};

export const getParticularFieldsFromFundIdApi = async (
  fund_id = null,
  cancelToken
) => {
  var url = `/${entityId}/CAPI/Identity/fields?fundId=${fund_id}`
  const request = { type: "GET", urlString: url }
  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    // return getErrorResponse(error)
  }
}

export const getParticularsDetailByIdentityIdAPI = async (
  identity_id,
  cancelToken
) => {
  const url = `/${entityId}/CAPI/Identity/${identity_id}/get`
  const request = { type: "GET", urlString: url }
  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    // return getErrorResponse(error)
  }
}

export const postIdentityAPI = async (data, cancelToken) => {
  const url = `/${entityId}/CAPI/Identity/create`
  const request = { type: "POST", urlString: url, params: data }
  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    // return getErrorResponse(error)
  }
}

export const postIdentityAttatchWithFund = async (
  identityId,
  data,
  cancelToken
) => {
  const url = `/${entityId}/CAPI/Identity/${identityId}/attach`
  const request = { type: "POST", urlString: url, params: data }

  try {
    const response = await processRequest(request, cancelToken)
    return response.data
  } catch (error) {
    return getErrorResponse(error)
  }
}

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
