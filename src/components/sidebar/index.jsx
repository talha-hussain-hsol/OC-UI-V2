import FeatherIcon from "feather-icons-react";
import { useState, useCallback } from "react";
import { Container } from "react-bootstrap";
import PropTypes from "prop-types";
import { listOfConfigs } from "../../utils/constants";

const SidenavFundConfiguration = ({
  setSelected,
  handleUpdateStorage,
  handleUpdate,
  setSelectedRegions,
  selectedTab
}) => {
  const theme = localStorage.getItem("portal_theme");
  const [activeItemId, setActiveItemId] = useState(selectedTab.itemId  );

  const isParent = useCallback((itemId) => {
    const item = listOfConfigs[itemId];
    if (!item.children) return false;
    if (item.children.includes(activeItemId)) return true;
    return item.children.some((childId) => isParent(childId));
  }, [activeItemId]);

  const isExpanded = useCallback((itemId) => {
    return activeItemId === itemId || isParent(itemId);
  }, [activeItemId, isParent]);

  const handleClick = (itemId, parentId, title, setVisible) => {
    if (["general", "configuration", "kycConfiguration", "thirdPartyApi", "modules"].includes(itemId)) return;
    setActiveItemId(isExpanded(itemId) ? parentId : itemId);
    setSelected({ title, itemId, parentId });
    if (setVisible) setVisible(false);
  };

  const renderSubitems = (ids, parentId, arr) => {
    return ids.map((id) => {
      const item = listOfConfigs[arr.splice(arr.indexOf(id), 1)];
      const isActive = activeItemId === item.id;
      const itemColor = isActive
        ? "#2c7be5"
        : !activeItemId && item.id === "domainSetting"
        ? "#2c7be5"
        : theme === "light"
        ? "black"
        : "white";

      return (
        <div key={id} className={`mt-5 ${item.title === "Update" ? "0" : "2.5"}`}>
          {item.title === "Update" ? (
            <div className="flex justify-center">
              <button
                className="btn btn-primary w-3/4 py-1"
                onClick={() => (activeItemId === "storage" ? handleUpdateStorage() : handleUpdate())}
              >
                Update Settings
              </button>
            </div>
          ) : (
            <>
              {item.children ? (
                <>
                  <div
                    className="flex items-center gap-2.5 cursor-pointer"
                    style={{ color: itemColor }}
                    onClick={() => handleClick(id, parentId, item.title)}
                  >
                    {item.icon && <FeatherIcon icon={item.icon} size="17" />}
                    <span>{item.title}</span>
                  </div>
                  <div className="nav nav-sm flex-column ml-2.5">
                    {renderSubitems(item.children, id, arr)}
                  </div>
                </>
              ) : (
                // <Link className="no-underline" to={item.url}>
                  <div
                    className="flex items-center gap-2.5 cursor-pointer"
                    style={{ color: itemColor }}
                    onClick={() => handleClick(id, parentId, item.title)}
                  >
                    {item.icon && <FeatherIcon icon={item.icon} size="17" />}
                    {item.title}
                  </div>
                // </Link>
              )}
            </>
          )}
        </div>
      );
    });
  };

  const renderItems = (ids) => {
    return ids.map((id, index) => {
      const item = listOfConfigs[id];
      return (
        <div key={id}>
          {index > 0 && <hr className="navbar-divider" />}
          {item.title && <h6 className="navbar-heading">{item.title}</h6>}
          {item.children && renderSubitems(item.children, id, ids)}
        </div>
      );
    });
  };

  return (
    <div className="bg-darkprimary flex flex-col p-[20px]">
      <div className="row">
        <div className="col-12">
          <div className="form-group">
            <label className="form-label">Region</label>
            <select
              className="block w-full px-3 py-2 text-sm font-normal leading-6 text-white appearance-none bg-[#1E3A5C] border border-[#1E3A5C] rounded transition duration-150 ease-in-out"
              defaultValue="Singapore"
              onChange={(e) => setSelectedRegions(e.target.value)}
            >
              <option value="Singapore">Singapore</option>
              <option value="India-Gift-City">India Gift City</option>
              <option value="india">India</option>
              <option value="Australia">Australia</option>
              <option value="Cayman Islands">Cayman Islands</option>
              <option value="BVI">BVI</option>
              <option value="Hong-Kong">Hong Kong</option>
              <option value="UAE">UAE</option>
              <option value="China">China</option>
              <option value="India-AIF">India AIF</option>
              <option value="united-states-of-america-(USA)">
                United States of America (USA)
              </option>
            </select>
          </div>
        </div>
      </div>
      <Container fluid>{renderItems(Object.keys(listOfConfigs))}</Container>
    </div>
  );
};

SidenavFundConfiguration.propTypes = {
  setSelected: PropTypes.func.isRequired,
  selectedTab: PropTypes.object,
  handleUpdateStorage: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func,
  setSelectedRegions: PropTypes.func,
};

export default SidenavFundConfiguration;
