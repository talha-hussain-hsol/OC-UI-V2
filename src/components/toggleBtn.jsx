import React from "react";
import { ButtonGroup, ToggleButton } from "react-bootstrap";

const ToggleButtonExample = ({ activeTab, setActiveTab }) => {

  return (
    <ButtonGroup toggle className="d-flex">
      <ToggleButton
        type="radio"
        name="radio"
        value="expiring_docs"
        checked={activeTab === "expiring_docs"}
        onClick={(e) => setActiveTab('expiring_docs')}
        className={`flex-fill left-rounded-50 ${activeTab === "expiring_docs" ? 'active-btn' : 'inactive-btn'}`}
      >
        Expiring Documents
      </ToggleButton>
      <ToggleButton
        type="radio"
        name="radio"
        value="expired_docs"
        checked={activeTab === "expired_docs"}
        onClick={(e) => setActiveTab('expired_docs')}
        className={`flex-fill right-rounded-50 ${activeTab === "expired_docs" ? 'active-btn' : 'inactive-btn'}`}
      >
        Expired Documents
      </ToggleButton>
    </ButtonGroup>
  );
};

export default ToggleButtonExample;
