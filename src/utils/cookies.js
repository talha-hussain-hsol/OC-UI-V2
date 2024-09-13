export const setCookie = (name, value, days) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Convert days to milliseconds
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie =
    name + "=" + (encodeURIComponent(value) || "") + expires + "; path=/";
};

export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

export const clearAllCookies = () => {
  const cookies = document.cookie.split(";");

  cookies.forEach((cookie) => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  });

  console.log("All cookies have been cleared.");
};

export const setLocalStorage = (key, value) => {
  const valueCheck = typeof value === "string" ? value : JSON.stringify(value);
  localStorage.setItem(key, valueCheck);
};

export const getLocalStorage = (key) => {
  localStorage.getItem(key);
};

export const removeLocalStorage = () => {
  localStorage.clear();
};
