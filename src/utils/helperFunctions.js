export const formatKey = (key) => {
  // Split the key by underscore, capitalize each word, and join with spaces
  const requiredKey = key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  // .join(" ");
  return key.includes("transaction_monitoring")
    ? "Transaction Monitoring"
    : requiredKey[0];
};
export const groupByKey = (data = []) => {
  return data.reduce((acc, item) => {
    const formattedKey = formatKey(item.key);
    if (!acc[formattedKey]) {
      acc[formattedKey] = [];
    }
    acc[formattedKey].push(item);
    return acc;
  }, {});
};

export const groupByKeyAlongMerging = (data = [], mergedData = []) => {
  return data.reduce((acc, item) => {
    const formattedKey = formatKey(item.key);
    if (!acc[formattedKey]) {
      acc[formattedKey] = [];
    }
    const getRequiredObj = mergedData
      ? mergedData.find((obj) => obj.module_id === item.id)
      : {};
    acc[formattedKey].push({
      ...item,
      ...getRequiredObj,
    });
    return acc;
  }, {});
};

export const generateRandomString = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const capitalizeFirstLetter = (string = "") => {
  if (!string) return string; // Handle empty or undefined string
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const replaceUrlPath = (url) => {
  // Parse the URL
  const urlObj = new URL(url);

  // Extract the last part of the pathname (the path after the last '/')
  const pathParts = urlObj.pathname.split('/');
  const lastPart = pathParts[pathParts.length - 1]; // "compliance" or "other"

  // Extract domain parts
  const domainParts = urlObj.hostname.split('.');

  // Find and replace 'portal' in the subdomain
  domainParts[0] = domainParts[0].replace('portal', lastPart); // Replace 'portal' or '-portal' with the last part of the path

  // Rebuild the hostname with the updated subdomain
  urlObj.hostname = domainParts.join('.');

  // Remove the last part from the pathname (we no longer need the "compliance" or "other" in the path)
  pathParts.pop();
  urlObj.pathname = pathParts.join('/');

  // Return the modified URL as a string
  return urlObj.toString();
};


export const removeQueryParams = () => {
  const url = new URL(window.location);
  url.search = ''; // Clear query parameters
  window.history.replaceState({}, '', url.toString());
}