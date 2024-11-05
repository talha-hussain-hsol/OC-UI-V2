import React, { useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const TruncatedText = ({ text, maxLength,tooltip }) => {
  const [showFullText, setShowFullText] = useState(false);

  const handleClick = () => {
    setShowFullText(!showFullText);
  };

  const truncatedText = showFullText ? text : text?.slice(0, maxLength) + "...";

  return (
    <OverlayTrigger
placement="top"
overlay={
  <Tooltip className="mytooltip" style={{ padding: "20px" }}>
    {tooltip}
  
  </Tooltip>
}
>
<span onClick={handleClick} style={{ cursor: "pointer"}}>
      {truncatedText}
    </span>
</OverlayTrigger>
   
  );
};

export default TruncatedText;


