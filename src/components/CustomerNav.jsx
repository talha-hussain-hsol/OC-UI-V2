import FeatherIcon from "feather-icons-react";
import { useLocation, Link, useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  Collapse,
  Container,
  Dropdown,
  Form,
  InputGroup,
  Nav,
  Navbar,
} from "react-bootstrap";
import Avatar from "../components/Avatar";
import { nav as data } from "../data";
import { logoutAPI } from "../api/network/commonApi";
import { verifyFundExist } from "../api/network/customerApi";
// import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import axios from "axios";
// import SpinnerWithBackDrop from "../widgets/bootstrap-component/SpinnerWithBackDrop";
import Loader from "./ui/loader";
import { useSelector, useDispatch } from "react-redux";
export default function CustomerNav({ ...props }) {
  console.log("entitiesCount", parseInt(props.entitiesCount));

  const customerAccounts = useSelector((state) => state?.customerAccount);
  const [entityProfilePic, setEntityProfilePic] = useState(
    localStorage.getItem("profile_pic")
  );

  const history = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const [isLoader, setIsLoader] = useState(false);
  const [isSCB, setIsSCB] = useState(false);
  const cancelTokenSource = axios.CancelToken.source();
  const [activeItemId, setActiveItemId] = useState(() => {
    return Object.keys(data).filter((itemId) => {
      return data[itemId].url === history.pathname;
    })[0];
  });
  // useEffect(() => {
  //   if (customerAccounts.length != 0) {
  //     // const result = customerAccounts.filter(item => item.account.fundId === 215);
  //     const result = customerAccounts.filter(item => (item.account.fundId === 3 || item.account.fundId === 215 || item.account.fundId === 1));
  //     if (result.length != 0) {
  //       setIsSCB(true)
  //     }
  //   }
  // }, [customerAccounts]);
  useEffect(() => {
    handleGetCustomersAccounts();
  }, []);
  const [modalSearchVisible, setModalSearchVisible] = useState(false);
  const [modalNotificationsVisible, setModalNotificationsVisible] =
    useState(false);

  const handleGetCustomersAccounts = async () => {
    const response = await verifyFundExist(
      { fund_ids: [3, 215, 1] },
      cancelTokenSource.token
    );
    if (response.success == true) {
      console.log("responseresponse", response);

      setIsSCB(response?.data?.count);

      // dispatch(setCustomerAccounts(response?.data?.customer_accounts))
    } else {
      setIsLoader(false);
    }
  };

  function isExpanded(itemId) {
    if (activeItemId === itemId) {
      return true;
    }

    return isParent(itemId);
  }

  function isParent(itemId) {
    const item = data[itemId];

    if (!item?.children) {
      return false;
    }

    if (item?.children.includes(activeItemId)) {
      return true;
    }

    let result = false;

    item?.children.forEach((childId) => {
      if (isParent(childId)) {
        result = true;
      }
    });

    return result;
  }

  function getItems(ids, isStandardCharted) {
    console.log(ids, "ids getItems");
    console.log(isStandardCharted, "isStandardCharted");
    return ids
      .map(function (id, index) {
        console.log(id, "idididididididididididididididid");
        if (
          isStandardCharted === false &&
          (id === "dashboard" || id === "performancedocument")
        ) {
          return null;
        }
        const item = data[id];
        console.log(item, "item getItemsgetItemsgetItems");
        return (
          <div key={id}>
            {index > 0 && <hr className="navbar-divider" />}
            {/* {item?.title && <h6 className="navbar-heading">{item?.title}</h6>} */}
            {window.innerWidth < 768 ? (
              <h6 className="navbar-heading">{item?.title}</h6>
            ) : null}
            {item?.children && (
              <Nav>
                {getSubitems(item?.children, id, ids, isStandardCharted)}
              </Nav>
            )}
          </div>
        );
      })
      .filter(Boolean);
  }

  function getSubitems(ids, parentId, arr, isStandardCharted) {
    return ids
      .map(function (id) {
        const item = data[arr.splice(arr.indexOf(id), 1)];
        if (
          isStandardCharted === false &&
          (id === "dashboard" || id === "performancedocument")
        ) {
          return null;
        }
        return (
          <Nav.Item key={id}>
            {item?.children ? (
              <>
                <Nav.Link
                  onClick={() => handleClick(id, parentId)}
                  role="button"
                >
                  {item?.icon && <FeatherIcon icon={item?.icon} size="17" />}
                  {window.innerWidth < 768 ? <>{item?.title}</> : null}
                  {/* <FeatherIcon
                  icon="chevron-down"
                  size="1em"
                  className={`ms-auto nav-chevron ${
                    isExpanded(id) && "active"
                  }`}
                /> */}
                </Nav.Link>
                <Collapse in={isExpanded(id)}>
                  <div>
                    <div className="nav nav-sm flex-column">
                      {getSubitems(item?.children, id, arr, isStandardCharted)}
                    </div>
                  </div>
                </Collapse>
              </>
            ) : (
              // <OverlayTrigger
              //   placement={"right"}
              //   overlay={
              //     <Tooltip id={`tooltip-${"right"}`}>{item?.title}</Tooltip>
              //   }
              // >>
              <>
                {item?.title == "Switch" ? (
                  <Link to={item?.url}>
                    <Nav.Link
                      href={item?.url}
                      active={history.pathname === item?.url}
                      onClick={(e) => handleClickSwitch(e)}
                    >
                      {item?.icon && (
                        <FeatherIcon icon={item?.icon} size="17" />
                      )}
                      {window.innerWidth < 768 ? <>{item?.title}</> : null}
                    </Nav.Link>
                  </Link>
                ) : item?.title == "WalkThrough" ? (
                  <Link to={item?.url}>
                    <Nav.Link
                      href={"#"}
                      active={history.pathname === item?.url}
                      onClick={() => handleWalkthrough()}
                    >
                      {item?.icon && (
                        <FeatherIcon icon={item?.icon} size="17" />
                      )}
                      {window.innerWidth < 768 ? <>{item?.title}</> : null}
                    </Nav.Link>
                  </Link>
                ) : (
                  <Link to={item?.url}>
                    <Nav.Link
                      href={item?.url}
                      active={history.pathname === item?.url}
                      onClick={() => handleClick(id, parentId, item?.url)}
                    >
                      {item?.icon && (
                        <FeatherIcon icon={item?.icon} size="17" />
                      )}
                      {window.innerWidth < 768 ? <>{item?.title}</> : null}
                    </Nav.Link>
                  </Link>
                )}
                {/* </OverlayTrigger> */}
              </>
            )}
          </Nav.Item>
        );
      })
      .filter(Boolean);
  }

  function handleLogout() {
    logoutApiHandle();
  }

  function deleteAllCookies() {
    const cookies = document.cookie.split(";");
    const url = new URL(window.location.href);
    const domain = url.hostname.split(".").slice(-2).join(".");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie =
        name +
        `=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${domain};`;
    }
  }
  const logoutApiHandle = async () => {
    setIsLoader(true);
    const response = await logoutAPI(cancelTokenSource.token);
    // return;
    if (response.success == true) {
      deleteAllCookies();
      let port = "";
      if (location.port) {
        port = ":" + location.port;
      }

      let url = `${
        process.env.VITE_AUTH_API_URL
      }/logout?user_id=${localStorage.getItem("login_user_id")}&redirect_url=${
        process.env.VITE_LOGOUT_REDIRECT_URL
      }`;
      localStorage.clear();
      window.location.href = url;
    } else {
      deleteAllCookies();

      let port = "";
      if (location.port) {
        port = ":" + location.port;
      }
      let url = `${
        process.env.VITE_AUTH_API_URL
      }/logout?user_id=${localStorage.getItem("login_user_id")}&redirect_url=${
        process.env.VITE_LOGOUT_REDIRECT_URL
      }`;
      localStorage.clear();
      window.location.href = url;
    }
  };
  function handleProfileClick() {
    // navigate('/profile/info')
    window.open(process.env.VITE_AUTH_API_URL + "/profile", "_blank");
    // window.open('http://auth-dev.ascentfs.sg/profile', '_blank');
  }
  function handleIdentityClick() {
    navigate("/profile/identities");
  }

  function handleClick(itemId, parentId, url) {
    setActiveItemId(isExpanded(itemId) ? parentId : itemId);
    console.log(url, "url");
    navigate(url);
  }
  // function handleWalkthrough() {
  //   window.open("/img/OneConstellation.pptx")
  // }
  const handleWalkthrough = () => {
    window.open("/img/OneConstellation.pdf", "_blank");
  };
  function handleClickSwitch(e) {
    localStorage.setItem("base_url", null);
    let port = "";
    if (window.location.port) {
      port = ":" + window.location.port;
    }
    const url = new URL(window.location.href);
    const domain = url.hostname.split(".").slice(-2).join(".");

    if (window.location.host.search("staging") != -1) {
      window.location.href = `${window.location.protocol}//staging-portal.${domain}${port}/splash`;
    } else {
      window.location.href = `${window.location.protocol}//portal.${domain}${port}/splash`;
    }
    // window.location.href = `${window.location.protocol}//portal.${domain}${port}/splash`;
  }
  function handleClick(itemId, parentId, setVisible) {
    setActiveItemId(isExpanded(itemId) ? parentId : itemId);

    // if (setVisible) {
    //     setVisible(false);
    // }
  }

  const toggler = <Navbar.Toggle />;

  const brand = (
    <Link to="#" passHref>
      <Navbar.Brand>
        <img className="navbar-brand-img" src="/img/logo-small.png" alt="..." />
      </Navbar.Brand>
    </Link>
  );

  const user = (
    <Dropdown align="end" className="d-md-none navbar-user-small">
      <Dropdown.Toggle as={Avatar} size="sm" status="online" role="button">
        {entityProfilePic != "undefined" &&
        entityProfilePic != null &&
        entityProfilePic != "null" ? (
          <Avatar.Image
            className="rounded-circle"
            src={entityProfilePic}
            alt="User profile picture"
          />
        ) : (
          <div className="avatar">
            <span className="avatar-title rounded-circle">U</span>
          </div>
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {/* <Link to="/profile-posts" onClick={(e) => { handleProfileClick(e) }} >
                    <Dropdown.Item>Profile</Dropdown.Item>
                </Link> */}
        <Link
          to="/identities"
          onClick={(e) => {
            handleIdentityClick(e);
          }}
        >
          <Dropdown.Item>Identities</Dropdown.Item>
        </Link>
        <Dropdown.Divider />
        <Link
          onClick={() => {
            handleLogout();
          }}
        >
          <Dropdown.Item>Logout</Dropdown.Item>
        </Link>
      </Dropdown.Menu>
    </Dropdown>
  );

  const form = (
    <form className="mt-4 mb-3 d-md-none">
      <InputGroup className="input-group-merge input-group-reverse input-group-rounded">
        <Form.Control type="search" placeholder="Search" aria-label="Search" />
        <InputGroup.Text>
          <FeatherIcon icon="search" size="15" />
        </InputGroup.Text>
      </InputGroup>
    </form>
  );

  const footer = (
    <div
      className="navbar-user d-none d-md-flex navbar-user-small"
      style={{ flexDirection: "column" }}
    >
      {/* <a className="navbar-user-link" role="button" onClick={() => setModalNotificationsVisible(true)}>
                <Icon>
                    <FeatherIcon icon="bell" size="20" />
                </Icon>
            </a> */}
      <Dropdown drop="up">
        <Dropdown.Toggle as={Avatar} size="sm" status="online" role="button">
          {entityProfilePic != "undefined" &&
          entityProfilePic != null &&
          entityProfilePic != "null" ? (
            <Avatar.Image
              className="rounded-circle"
              src={entityProfilePic}
              alt="User profile picture"
            />
          ) : (
            <div className="avatar">
              <span className="avatar-title rounded-circle">U</span>
            </div>
          )}{" "}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Link
            onClick={(e) => {
              handleProfileClick(e);
            }}
          >
            <Dropdown.Item>Profile</Dropdown.Item>
          </Link>
          <Link
            to="/profile/identities"
            onClick={(e) => {
              handleIdentityClick(e);
            }}
          >
            <Dropdown.Item>Identities</Dropdown.Item>
          </Link>
          <Dropdown.Divider />
          <Link
            onClick={() => {
              handleLogout();
            }}
          >
            <Dropdown.Item>Logout</Dropdown.Item>
          </Link>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
  var theme = localStorage.getItem("portal_theme");
  if (theme == null) {
    theme = "dark";
  }
  const handleClickTheme = (e) => {
    if (theme == "light") {
      localStorage.setItem("portal_theme", "dark");
    } else {
      localStorage.setItem("portal_theme", "light");
    }
    location.reload();
    // navigate(`?theme=${theme == 'dark' ? 'light' : 'dark'}`)
  };

  const collapse = (
    <Navbar.Collapse {...props} id="sidebarSmallCollapse">
      {form}

      {parseInt(props?.entitiesCount) === 1 &&
      localStorage.getItem("entity-one-portal-type") !== "management" &&
      localStorage.getItem("entity-one-portal-type") !== "compliance"
        ? delete data.switch
        : null}

      {getItems(Object.keys(data), isSCB)}

      {/* <OverlayTrigger
        placement={"right"}
        overlay={
          <Tooltip id={`tooltip-${"right"}`}>
            {theme == "dark" ? "Change To Light Mode" : "Change To Dark Mode"}
          </Tooltip>
        }
      >
        <Link
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
          }}
          to={``}
        >
          <Nav.Link
            onClick={(e) => {
              handleClickTheme(e)
            }}
          >
            {theme == "dark" ? (
              <FeatherIcon icon={"sun"} size="17" />
            ) : (
              <FeatherIcon icon={"moon"} size="17" />
            )}
            {window.innerWidth < 768 ? (
              <h6 className="navbar-heading">
                {theme == "dark"
                  ? "Change To Light Mode"
                  : "Change To Dark Mode"}
              </h6>
            ) : null}
          </Nav.Link>
        </Link>
      </OverlayTrigger> */}
      <div className="mt-auto mb-md-4" />
      {footer}
    </Navbar.Collapse>
  );

  return (
    <>
      <Navbar
        expand="md"
        className="navbar navbar-vertical navbar-vertical-sm fixed-start navbar-expand-md"
        collapseOnSelect={true}
        {...props}
      >
        <Container fluid>
          {isLoader && (
            // <SpinnerWithBackDrop />
            <Loader />
          )}
          {toggler}
          {brand}
          {user}
          {collapse}
        </Container>
      </Navbar>
      {console.log(isSCB, "isSCB isSCBisSCBisSCBisSCB")}
      {/* <ModalSearch visible={modalSearchVisible} onDismiss={() => setModalSearchVisible(false)} /> */}
      {/* <ModalNotifications visible={modalNotificationsVisible} onDismiss={() => setModalNotificationsVisible(false)} /> */}
    </>
  );
}
