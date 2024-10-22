import FeatherIcon from "feather-icons-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import {
  Collapse,
  Container,
  Dropdown,
  Form,
  InputGroup,
  Nav,
  Navbar,
  Spinner,
} from "react-bootstrap";
import { Avatar, Icon } from ".";
import { nav as data } from "../data";
import { ModalNotification, ModalSearch } from "../modals";
import { logoutAPI } from "../api/network/commonApi";
import axios from "axios";
// import SpinnerWithBackDrop from "../widgets/bootstrap-component/SpinnerWithBackDrop";
import Loader from "./ui/loader";

export default function Sidenav({ ...props }) {
  const history = useLocation();
  const navigate = useNavigate();
  const cancelTokenSource = axios.CancelToken.source();
  const [isLoader, setIsLoader] = useState(false);
  const [activeItemId, setActiveItemId] = useState(() => {
    return Object.keys(data).filter((itemId) => {
      return data[itemId].url === history.pathname;
    })[0];
  });

  const [modalSearchVisible, setModalSearchVisible] = useState(false);
  const [modalNotificationsVisible, setModalNotificationsVisible] =
    useState(false);

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
      setIsLoader(false);
    } else {
      deleteAllCookies();
      setIsLoader(false);

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

      return (
        <div key={id}>
          {index > 0 && <hr className="navbar-divider" />}
          {item.title && <h6 className="navbar-heading">{item.title}</h6>}
          {item.children && <Nav>{getSubitems(item.children, id, ids)}</Nav>}
        </div>
      );
    });
  }
  function handleProfileClick() {
    navigate("/profile/info");
  }
  function handleIdentityClick() {
    navigate("/profile/identities");
  }
  function getSubitems(ids, parentId, arr) {
    return ids.map(function (id) {
      const item = data[arr.splice(arr.indexOf(id), 1)];

      return (
        <Nav.Item key={id}>
          {item.children ? (
            <>
              <Nav.Link onClick={() => handleClick(id, parentId)} role="button">
                {item.icon && <FeatherIcon icon={item.icon} size="17" />}
                {item.title}
                <FeatherIcon
                  icon="chevron-down"
                  size="1em"
                  className={`ms-auto nav-chevron ${
                    isExpanded(id) && "active"
                  }`}
                />
              </Nav.Link>
              <Collapse in={isExpanded(id)}>
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
                href={item.url}
                active={history.pathname === item.url}
                onClick={() => handleClick(id, parentId, item.url)}
              >
                {item.icon && <FeatherIcon icon={item.icon} size="17" />}
                {item.title}
              </Nav.Link>
            </Link>
          )}
        </Nav.Item>
      );
    });
  }

  function handleClick(itemId, parentId, url) {
    setActiveItemId(isExpanded(itemId) ? parentId : itemId);
    console.log(url, "url");
    navigate(url);
  }

  const toggler = <Navbar.Toggle />;

  const brand = (
    <Link to="#">
      <Navbar.Brand>
        <img className="navbar-brand-img" src="/img/logo.png" alt="..." />
      </Navbar.Brand>
    </Link>
  );

  const user = (
    <Dropdown align="end" className="d-md-none">
      <Dropdown.Toggle as={Avatar} size="sm" status="online" role="button">
        <Avatar.Image
          className="rounded-circle"
          src="/img/avatars/profiles/avatar-1.jpg"
          alt="..."
        />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Link
          to="/profile-posts"
          onClick={(e) => {
            handleProfileClick(e);
          }}
        >
          <Dropdown.Item>Profile</Dropdown.Item>
        </Link>
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
    <div className="navbar-user d-none d-md-flex">
      {/* <a className="navbar-user-link" role="button" onClick={() => setModalNotificationsVisible(true)}>
        <Icon>
          <FeatherIcon icon="bell" size="17" />
        </Icon>
      </a> */}
      <Dropdown drop="up">
        <Dropdown.Toggle as={Avatar} size="sm" status="online" role="button">
          <Avatar.Image
            className="rounded-circle"
            src="/img/avatars/profiles/avatar-1.jpg"
            alt="..."
          />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Link
            to="/profile/info"
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
      {/* <a className="navbar-user-link" role="button" onClick={() => setModalSearchVisible(true)}>
        <Icon>
          <FeatherIcon icon="search" size="17" />
        </Icon>
      </a> */}
    </div>
  );

  const collapse = (
    <Navbar.Collapse {...props}>
      {form}
      {getItems(Object.keys(data))}
      <div className="mt-auto mb-md-4" />
      {footer}
    </Navbar.Collapse>
  );

  return (
    <>
      <Navbar
        expand="md"
        className="navbar-horizontal fixed-start"
        collapseOnSelect={true}
        {...props}
      >
        {isLoader && <Loader />}
        <Container fluid>
          {toggler}
          {brand}
          {user}
          {collapse}
        </Container>
      </Navbar>
      <ModalSearch
        visible={modalSearchVisible}
        onDismiss={() => setModalSearchVisible(false)}
      />
      <ModalNotification
        visible={modalNotificationsVisible}
        onDismiss={() => setModalNotificationsVisible(false)}
      />

      {/* <nav class="navbar navbar-expand-lg " id="topnav">
        <div class="container">


          <button class="navbar-toggler me-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbar"
            aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>


          <a class="navbar-brand me-auto" href="./index.html">
            <img src="{{ asset('themes/dashkit/assets/img/logo.svg') }}" alt="..." class="navbar-brand-img" />
          </a>


          <div class="navbar-user">

            <div class="dropdown">


              <a href="#" class="avatar avatar-sm avatar-online dropdown-toggle" role="button" data-bs-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false">
                <img src="{{ asset('themes/dashkit/assets/img/avatars/profiles/avatar-1.jpg') }}" alt="..." class="avatar-img rounded-circle" />
              </a>


              <div class="dropdown-menu dropdown-menu-end">
                <a href="./profile-posts.html" class="dropdown-item">Profile</a>
                <a href="./account-general.html" class="dropdown-item">Settings</a>
                <hr class="dropdown-divider" />
                <a href="./sign-in.html" class="dropdown-item">Logout</a>
              </div>

            </div>

          </div>


          <div class="collapse navbar-collapse me-lg-auto order-lg-first" id="navbar">


            <form class="mt-4 mb-3 d-md-none">
              <input type="search" class="form-control form-control-rounded" placeholder="Search" aria-label="Search" />
            </form>


            <ul class="navbar-nav me-lg-auto">
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle active" href="#" id="topnavDashboards" role="button"
                  data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                  Dashboards
                </a>
                <ul class="dropdown-menu" aria-labelledby="topnavDashboards">
                  <li>
                    <a class="dropdown-item active" href="./index.html">
                      Default
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item " href="./dashboard-project-management.html">
                      Project Management
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item " href="./dashboard-ecommerce.html">
                      E-Commerce
                    </a>
                  </li>
                </ul>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle " href="#" id="topnavPages" role="button" data-bs-toggle="dropdown"
                  data-bs-auto-close="outside" aria-haspopup="true" aria-expanded="false">
                  Pages
                </a>
                <ul class="dropdown-menu" aria-labelledby="topnavPages">
                  <li class="dropend">
                    <a class="dropdown-item dropdown-toggle " href="#" id="topnavAccount" role="button"
                      data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Account
                    </a>
                    <div class="dropdown-menu" aria-labelledby="topnavAccount">
                      <a class="dropdown-item " href="./account-general.html">
                        General
                      </a>
                      <a class="dropdown-item " href="./account-billing.html">
                        Billing
                      </a>
                      <a class="dropdown-item " href="./account-members.html">
                        Members
                      </a>
                      <a class="dropdown-item " href="./account-security.html">
                        Security
                      </a>
                      <a class="dropdown-item " href="./account-notifications.html">
                        Notifications
                      </a>
                    </div>
                  </li>
                  <li class="dropend">
                    <a class="dropdown-item dropdown-toggle " href="#" id="topnavCrm" role="button"
                      data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      CRM
                    </a>
                    <div class="dropdown-menu" aria-labelledby="topnavCrm">
                      <a class="dropdown-item " href="./crm-contacts.html">
                        Contacts
                      </a>
                      <a class="dropdown-item " href="./crm-companies.html">
                        Companies
                      </a>
                      <a class="dropdown-item " href="./crm-deals.html">
                        Deals
                      </a>
                    </div>
                  </li>
                  <li class="dropend">
                    <a class="dropdown-item dropdown-toggle " href="#" id="topnavProfile" role="button"
                      data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Profile
                    </a>
                    <div class="dropdown-menu" aria-labelledby="topnavProfile">
                      <a class="dropdown-item " href="./profile-posts.html">
                        Posts
                      </a>
                      <a class="dropdown-item " href="./profile-groups.html">
                        Groups
                      </a>
                      <a class="dropdown-item " href="./profile-projects.html">
                        Projects
                      </a>
                      <a class="dropdown-item " href="./profile-files.html">
                        Files
                      </a>
                      <a class="dropdown-item " href="./profile-subscribers.html">
                        Subscribers
                      </a>
                    </div>
                  </li>
                  <li class="dropend">
                    <a class="dropdown-item dropdown-toggle " href="#" id="topnavProject" role="button"
                      data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Project
                    </a>
                    <div class="dropdown-menu" aria-labelledby="topnavProject">
                      <a class="dropdown-item " href="./project-overview.html">
                        Overview
                      </a>
                      <a class="dropdown-item " href="./project-files.html">
                        Files
                      </a>
                      <a class="dropdown-item " href="./project-reports.html">
                        Reports
                      </a>
                      <a class="dropdown-item " href="./project-new.html">
                        New project
                      </a>
                    </div>
                  </li>
                  <li class="dropend">
                    <a class="dropdown-item dropdown-toggle " href="#" id="topnavTeam" role="button"
                      data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Team
                    </a>
                    <div class="dropdown-menu" aria-labelledby="topnavTeam">
                      <a class="dropdown-item " href="./team-overview.html">
                        Overview
                      </a>
                      <a class="dropdown-item " href="./team-projects.html">
                        Projects
                      </a>
                      <a class="dropdown-item " href="./team-members.html">
                        Members
                      </a>
                      <a class="dropdown-item " href="team-new.html">
                        New team
                      </a>
                    </div>
                  </li>
                  <li class="dropend">
                    <a class="dropdown-item dropdown-toggle " href="#" id="topnavFeed" role="button"
                      data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Feed
                    </a>
                    <div class="dropdown-menu" aria-labelledby="topnavFeed">
                      <a class="dropdown-item " href="./feed.html">
                        Platform
                      </a>
                      <a class="dropdown-item " href="./social-feed.html">
                        Social
                      </a>
                    </div>
                  </li>
                  <li>
                    <a class="dropdown-item " href="./wizard.html">
                      Wizard
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item " href="./kanban.html">
                      Kanban
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item " href="./orders.html">
                      Orders
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item " href="./invoice.html">
                      Invoice
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item " href="./pricing.html">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item " href="./widgets.html">
                      Widgets
                    </a>
                  </li>
                </ul>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="topnavAuth" role="button" data-bs-toggle="dropdown"
                  data-bs-auto-close="outside" aria-haspopup="true" aria-expanded="false">
                  Auth
                </a>
                <ul class="dropdown-menu" aria-labelledby="topnavAuth">
                  <li class="dropend">
                    <a class="dropdown-item dropdown-toggle" href="#" id="topnavSignIn" role="button"
                      data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Sign in
                    </a>
                    <div class="dropdown-menu" aria-labelledby="topnavSignIn">
                      <a class="dropdown-item" href="./sign-in-cover.html">
                        Cover
                      </a>
                      <a class="dropdown-item" href="./sign-in-illustration.html">
                        Illustration
                      </a>
                      <a class="dropdown-item" href="./sign-in-basics.html">
                        Basic
                      </a>
                    </div>
                  </li>
                  <li class="dropend">
                    <a class="dropdown-item dropdown-toggle" href="#" id="topnavSignUp" role="button"
                      data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Sign up
                    </a>
                    <div class="dropdown-menu" aria-labelledby="topnavSignUp">
                      <a class="dropdown-item" href="./sign-up-cover.html">
                        Cover
                      </a>
                      <a class="dropdown-item" href="./sign-up-illustration.html">
                        Illustration
                      </a>
                      <a class="dropdown-item" href="./sign-up.html">
                        Basic
                      </a>
                    </div>
                  </li>
                  <li class="dropend">
                    <a class="dropdown-item dropdown-toggle" href="#" id="topnavPassword" role="button"
                      data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Password reset
                    </a>
                    <div class="dropdown-menu" aria-labelledby="topnavPassword">
                      <a class="dropdown-item" href="./password-reset-cover.html">
                        Cover
                      </a>
                      <a class="dropdown-item" href="./password-reset-illustration.html">
                        Illustration
                      </a>
                      <a class="dropdown-item" href="./password-reset.html">
                        Basic
                      </a>
                    </div>
                  </li>
                  <li class="dropend">
                    <a class="dropdown-item dropdown-toggle" href="#" id="topnavError" role="button"
                      data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Error
                    </a>
                    <div class="dropdown-menu" aria-labelledby="topnavError">
                      <a class="dropdown-item" href="./error-illustration.html">
                        Illustration
                      </a>
                      <a class="dropdown-item" href="./error.html">
                        Basic
                      </a>
                    </div>
                  </li>
                </ul>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle " href="#" id="topnavDocumentation" role="button"
                  data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-haspopup="true" aria-expanded="false">
                  Docs
                </a>
                <ul class="dropdown-menu" aria-labelledby="topnavDocumentation">
                  <li class="dropend">
                    <a class="dropdown-item dropdown-toggle " href="#" id="topnavBasics" role="button"
                      data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Basics
                    </a>
                    <div class="dropdown-menu" aria-labelledby="topnavBasics">
                      <a class="dropdown-item " href="./docs/getting-started.html">
                        Getting Started
                      </a>
                      <a class="dropdown-item " href="./docs/design-file.html">
                        Design File
                      </a>
                    </div>
                  </li>
                  <li>
                    <a class="dropdown-item " href="./docs/components.html">
                      Components
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item " href="./docs/changelog.html">
                      Changelog
                    </a>
                  </li>
                </ul>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-bs-toggle="offcanvas" href="#offcanvasDemo" aria-controls="offcanvasDemo">
                  Customize
                </a>
              </li>
            </ul>

          </div>
        </div>
      </nav> */}
    </>
  );
}
