import { useLayoutEffect } from "react";
import Loader from "../../components/ui/loader";
import { replaceUrlPath } from "../../utils/helperFunctions";

const Customer = () => {
    debugger;
  useLayoutEffect(() => {
    const finalUrl = replaceUrlPath(window.location.href);
    const localStorageData = JSON.stringify(localStorage);
    window.location.href = `${finalUrl}?data=${encodeURIComponent(
      localStorageData
    )}`;
  }, []);
  return <Loader />;
};
export default Customer;
