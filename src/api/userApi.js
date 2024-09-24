import { investorClientId } from ".";
import ResponseModel, {
  processError,
  processRequest,
  RequestType,
} from "./config";
import useEntityStore from '../store/useEntityStore'; // Zustand store import

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
}

export const getIdentityCount = async (entityId, cancelToken) => {
  const customResponse = new ResponseModel();
  const url = `/${entityId}/CAPI/identityCount`;
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
}


export const getIdentityList = async (cancelToken, fundId) => {
  const { entityId } = useEntityStore.getState();
  console.log("Entity ID:", entityId);
  
  let url;
  fundId
    ? (url = `/${entityId}/CAPI/Identity/list?fundId=${fundId}`)
    : (url = `/${entityId}/CAPI/Identity/list`);

  const request = { type: "GET", urlString: url};

  try {
    const response = await processRequest(request, cancelToken);
    return response.data;
  } catch (error) {
    // console.error("Error fetching identity list", error);
    // Handle error as needed (e.g., return error response)
  }
};
