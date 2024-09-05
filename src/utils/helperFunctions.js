export const formatKey = (key) => {
    // Split the key by underscore, capitalize each word, and join with spaces
    const requiredKey =  key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      // .join(" ");
      return key.includes('transaction_monitoring') ? 'Transaction Monitoring' : requiredKey[0]
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
  
  export const capitalizeFirstLetter = (string = '') => {
    if (!string) return string; // Handle empty or undefined string
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  