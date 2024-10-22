import FeatherIcon from 'feather-icons-react';
import { useLocation, Link, useNavigate, useParams } from 'react-router-dom';
import React, { useState } from 'react';
import { Collapse, Container, Nav, Navbar } from 'react-bootstrap';
import { fundConfigurationNav as data } from '../data';
import { checkPermissions } from '../helpers';

export default function SidenavFundConfiguration({ ...props }) {
  console.log(props?.fundConfigurationData?.config?.modules?.kyc?.Periodic_Review,"8432")
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [activeItemId, setActiveItemId] = useState(() => {
    return Object.keys(data).filter((itemId) => {
      return data[itemId].url === location.pathname;
    })[0];
  });
  const theme = localStorage.getItem("portal_theme");

  function isExpanded(itemId) {
    if (activeItemId === itemId) {
      return true;
    }

    return isParent(itemId);
  }

  function isParent(itemId) {
    const item = data[itemId];

    if (!item.children) {
      return false;
    }

    if (item.children.includes(activeItemId)) {
      return true;
    }

    let result = false;

    item.children.forEach((childId) => {
      if (isParent(childId)) {
        result = true;
      }
    });

    return result;
  }

  function getItems(ids) {
    return ids.map(function (id, index) {
      const item = data[id];
      console.log("DSAdasdas", item);

      return (
        <div key={id} className="collapse show">
          {index > 0 && <hr className="navbar-divider" />}
          {item.title && <h6 className="navbar-heading">{item.title}</h6>}
          {item.children && (
            <Nav className="collapse show">
              {getSubitems(item.children, id, ids)}
            </Nav>
          )}
        </div>
      );
    });
  }

  function getSubitems(ids, parentId, arr) {
    return ids.map(function (id) {
      const item = data[arr.splice(arr.indexOf(id), 1)];
      console.log(item, "test props");

     
      if (parentId === "modules" && (item.title === "Transfer" || item.title === "Switch")) {
        return null;
      }
      // {props?.fundConfigurationData?.config?.modules?.kyc?.Periodic_Review === true && (
       if (!props?.fundConfigurationData?.config?.modules?.kyc?.Periodic_Review && parentId === "kycConfiguration" && (item.title === "Periodic Review")) {
          return null; 
        }
      // )}

      return (
        <Nav.Item
          key={id}
          style={{ marginLeft: item.title === "Update" ? "0px" : "10px" }}
          className="collapse show"
        >
          {item.title === "Update" ? (
            <>
              {checkPermissions("DOMAIN_UPDATE") && (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button
                    style={{ width: "75%", padding: "4px" }}
                    className="btn btn-primary"
                    onClick={(e) => {
                      props.handleUpdate();
                    }}
                  >
                    Update Settings
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {item.children ? (
                <>
                  <Nav.Link
                    style={{
                      color:
                        activeItemId === item.id
                          ? "#2c7be5"
                          : theme === "light"
                            ? "black"
                            : "white",
                    }}
                    onClick={() => handleClick(id, parentId, item.title)}
                    role="button"
                  >
                    {item.icon && (
                      <FeatherIcon
                        icon={item.icon}
                        size="17"
                        style={{
                          pointerEvents:
                            item.title === "Configuration" ? "none" : "auto",
                        }}
                      />
                    )}
                    <span>{item.title}</span>
                  </Nav.Link>
                  <Collapse in={true}>
                    <div>
                      <div className="nav nav-sm flex-column">
                        {getSubitems(item.children, id, arr)}
                      </div>
                    </div>
                  </Collapse>
                </>
              ) : (
                <Link to={item.url}>
                  <Nav.Link
                    style={{
                      color:
                        activeItemId === item.id
                          ? "#2c7be5"
                          : !activeItemId && item.id === "domainSetting"
                            ? "#2c7be5"
                            : theme === "light"
                              ? "black"
                              : "white",
                    }}
                    active={location.pathname === item.url}
                    onClick={() => handleClick(id, parentId, item.title)}
                  >
                    {item.icon && <FeatherIcon icon={item.icon} size="17" />}
                    {item.title}
                  </Nav.Link>
                </Link>
              )}
            </>
          )}
        </Nav.Item>
      );
    });
  }

  function handleClick(itemId, parentId, title, setVisible) {
    if (
      itemId === "general" ||
      itemId === "configuration" ||
      itemId === "kycConfiguration" ||
      itemId === "thirdPartyApi" ||
      itemId === "modules"
    ) {
      return;
    }
    setActiveItemId(isExpanded(itemId) ? parentId : itemId);

    let data = {
      title: title,
      itemId: itemId,
      parentId: parentId,
    };
    props.setSelected(data);

    if (setVisible) {
      setVisible(false);
    }
  }

  const collapse = (
    <Navbar.Collapse {...props} in={true} className="collapse show">
      {getItems(Object.keys(data))}
    </Navbar.Collapse>
  );

  return (
    <>
      <Navbar
        expand="md"
        className="navbar-vertical navbar-fund-configuration"
        collapseOnSelect={true}
        {...props}
      >
        <Container fluid>{collapse}</Container>
      </Navbar>
    </>
  );
}
