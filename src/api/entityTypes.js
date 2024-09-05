import ResponseModel, {
  RequestType,
  processError,
  processRequest,
} from "./config";

let baseURL = "AAPI";

export const getEntityTypeAPI = async (entityId, cancelToken) => {
  const url = `/${entityId}/${baseURL}/entity-types-list`;
  const request = { type: RequestType.GET, urlString: url };
  const customResponse = new ResponseModel();

  try {
    const response = await processRequest(request, cancelToken);
    customResponse.response = response.data;
  } catch (error) {
    customResponse.error = processError(error);
  }
  return customResponse;
};
