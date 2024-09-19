import React from "react";
import Button from "../../Reusable Components/Button";
import { useTheme } from "../../../contexts/themeContext";

function SummaryDetails() {
  const { theme } = useTheme();
  console.log("theme", theme);

  return (
    <>
      <div className={`bg-color-${theme} `}>
        <h2 className={`text-color-text-${theme}`}>Summary</h2>
        <hr />
        <div className="bg-custom-green text-white w-[95%] ml-5 mt-4 rounded-lg p-2">
          <h2>Submitted For Review</h2>
        </div>
        <div className="flex justify-between mt-4 mb-2">
          <div className={``}>
            <h3 className={`text-color-text-${theme} ml-5`}>Particulars</h3>
            <p className={`text-color-text-${theme} ml-5`}>
              Make sure data you entered is correct
            </p>
          </div>
          <div className={`mr-5`}>
            <Button
              text="Completed"
              className={`bg-color-button1-${theme} text-white py-4 lg:py-[20px] px-4 rounded-lg mx-auto block`}
            />
          </div>
        </div>
        <div className="flex justify-between  mt-4 mb-2">
          <div>
            <h3 className={`text-color-text-${theme} ml-5`}>Documents</h3>
            <p className={`text-color-text-${theme} ml-5`}>
              We need some documents to be uploaded to complete this
              application.
            </p>
          </div>
          <div className={`mr-5`}>
            <Button
              text="In Completed"
              className={`bg-color-button2-SC text-white py-4 lg:py-[20px] px-4 rounded-lg mx-auto block`}
            />
          </div>
        </div>
        <div className="flex justify-between  mt-4 mb-2">
          <div>
            <h3 className={`text-color-text-${theme} ml-5`}>Screening</h3>
          </div>
          <div className={`mr-5`}>
            <Button
              text="In Completed"
              className={`bg-color-button2-SC text-white py-4 lg:py-[20px] px-4 rounded-lg mx-auto block`}
            />
          </div>
        </div>
        <div className="flex justify-between  mt-4 ">
          <div>
            <h3 className={`text-color-text-${theme} ml-5`}>Risk Assessment</h3>
          </div>
          <div className={`mr-5`}>
            <Button
              text="Pending"
              className={`bg-color-button3-SC text-white py-4 lg:py-[20px] px-4 rounded-lg mx-auto block`}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default SummaryDetails;
