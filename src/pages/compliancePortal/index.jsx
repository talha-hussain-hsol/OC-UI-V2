import { useLayoutEffect } from "react";
import Loader from "../../components/ui/loader";
import { replaceUrlPath } from "../../utils/helperFunctions";

const Compliance = () => {
  useLayoutEffect(() => {
    const finalUrl = replaceUrlPath(window.location.href);
    const localStorageData = JSON.stringify(localStorage);
    window.location.href = `${finalUrl}?data=${encodeURIComponent(
      localStorageData
    )}`;
  }, []);
  return <Loader theme={theme}/>;
};
export default Compliance;
