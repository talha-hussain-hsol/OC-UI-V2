import { useTheme } from "../../../contexts/themeContext";
const Loader = () => {
  const { theme } = useTheme();
  return (
    <div className={`flex items-center justify-center h-screen`}>
      <div
        className={`w-16 h-16 border-color-loader-${theme} border-t-2 border-b-2 rounded-full animate-spin`}
      ></div>
    </div>
  );
};
export default Loader;
