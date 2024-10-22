import React, { useEffect, useState } from "react";
import FeatherIcon from "feather-icons-react";
import { useLocation, Link, useNavigate, useParams } from "react-router-dom";
import {
  Collapse,
  Container,
  Dropdown,
  Form,
  InputGroup,
  Nav,
  Navbar,
  Col,
  Row,
  OverlayTrigger,
  Tooltip,
  Modal,
  Button,
} from "react-bootstrap";

import Avatar from "../components/Avatar";
import Icon from "../components/Icon";
import { administrationNav as data } from "../data";
import { ModalNotification, ModalSearch } from "../modals";
import { logoutAPI } from "../api/network/commonApi";
import {
  getAgeingReport,
  getAgeingReportWithKey,
  getConsumptionReport,
} from "../api/network/administrationApi/administrationAPI";
import axios from "axios";
import Loader from "./ui/loader";
import { checkPermissions } from "../helpers";
import SettingsModal from "./settings/settingsModal";
// import CustomAlert from "../widgets/bootstrap-component/Alert";
// import LoadingSpinner from "../widgets/bootstrap-component/Spinner";

export default function Sidenav({ ...props }) {
  const [userTimezone, setUserTimezone] = useState("");
  const [ageingReportType, setAgeingReportType] = useState("");
  const [openSettings, setOpenSettings] = useState(false);
  const [modalShowConsumption, setModalShowConsumption] = useState(false);
  const [modalShowAgeing, setModalShowAgeing] = useState(false);
  const [entityProfilePic, setEntityProfilePic] = useState(
    localStorage.getItem("profile_pic")
  );
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoaderConsumptioin, setIsLoaderConsumption] = useState(false);

  const [alertProps, setAlertProps] = useState({
    variant: "",
    message: "",
    show: false,
    hideAuto: false,
  });

  const history = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [isLoader, setIsLoader] = useState(false);
  const [isLoaderAgeing, setIsLoaderAgeing] = useState(false);

  const cancelTokenSource = axios.CancelToken.source();
  const [activeItemId, setActiveItemId] = useState(() => {
    return Object.keys(data).filter((itemId) => {
      return data[itemId].url === history.pathname;
    })[0];
  });

  const [modalSearchVisible, setModalSearchVisible] = useState(false);
  const [modalNotificationsVisible, setModalNotificationsVisible] =
    useState(false);

  useEffect(() => {
    // Get the user's timezone using Intl.DateTimeFormat
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    console.log("sdasdasdasdada", userTimeZone);
    setUserTimezone(userTimeZone);
  }, []);

  const handleCloseSettings = () => {
    setOpenSettings(false);
  };

  const handleOpenSettings = () => {
    setOpenSettings(true);
  };

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

      return (
        <div key={id}>
          {index > 0 && <hr className="navbar-divider" />}
          {/* {item.title && <h6 className="navbar-heading">{item.title}</h6>} */}
          {item.children && <Nav>{getSubitems(item.children, id, ids)}</Nav>}
        </div>
      );
    });
  }

  function getSubitems(ids, parentId, arr) {
    return ids.map(function (id) {
      const item = data[arr.splice(arr.indexOf(id), 1)];
      console.log(item, "item getSubitems");
      if (item?.title == "Settings" && props?.portal == "management") {
        return <div></div>;
      } else {
        return (
          <Nav.Item key={id}>
            {item.children ? (
              <>
                <Nav.Link
                  onClick={() => handleClick(id, parentId)}
                  role="button"
                >
                  {item.icon && <FeatherIcon icon={item.icon} size="17" />}
                  {/* {item.title} */}
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
              <OverlayTrigger
                placement={"right"}
                overlay={
                  <Tooltip id={`tooltip-${"right"}`}>{item?.title}</Tooltip>
                }
              >
                {item?.title == "Switch" &&
                (props?.entitiesCount ? props?.entitiesCount > 1 : true) ? (
                  <Link to={item.url}>
                    <Nav.Link
                      href={item.url}
                      active={history.pathname === item.url}
                      onClick={(e) => handleClickSwitch(e)}
                    >
                      {item.icon && <FeatherIcon icon={item.icon} size="17" />}
                    </Nav.Link>
                  </Link>
                ) : (
                  <Link to={item.url}>
                    {item.title === "Ageing Report"
                      ? checkPermissions("ALL_AGEING_REPORT_VIEW") && (
                          <Link to={item.url}>
                            <Nav.Link
                              href={item.url}
                              active={history.pathname === item.url}
                              onClick={() =>
                                handleClick(id, parentId, item.url)
                              }
                            >
                              {item.icon && (
                                <FeatherIcon icon={item.icon} size="17" />
                              )}
                            </Nav.Link>
                          </Link>
                        )
                      : item.title === "Customers"
                      ? checkPermissions("CUSTOMER_READ") && (
                          <Link to={item.url}>
                            <Nav.Link
                              href={item.url}
                              active={history.pathname === item.url}
                              onClick={() => {
                                handleClick(id, parentId, item.url);
                              }}
                            >
                              {item.icon && (
                                <FeatherIcon icon={item.icon} size="17" />
                              )}
                            </Nav.Link>
                          </Link>
                        )
                      : item.title === "Consumption Report"
                      ? checkPermissions("CONSUMPTION_REPORT") && (
                          <Link to={item.url}>
                            <Nav.Link
                              href={item.url}
                              active={history.pathname === item.url}
                              onClick={() =>
                                handleClick(id, parentId, item.url)
                              }
                            >
                              {item.icon && (
                                <FeatherIcon icon={item.icon} size="17" />
                              )}
                            </Nav.Link>
                          </Link>
                        )
                      : item?.title !== "Switch" && (
                          <Link to={item.url}>
                            <Nav.Link
                              href={item.url}
                              active={history.pathname === item.url}
                              onClick={() =>
                                handleClick(id, parentId, item.url)
                              }
                            >
                              {item.icon && (
                                <FeatherIcon icon={item.icon} size="17" />
                              )}
                            </Nav.Link>
                          </Link>
                        )}
                  </Link>
                )}
              </OverlayTrigger>
            )}
          </Nav.Item>
        );
      }
    });
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
      setIsLoader(false);
      let url = `${
        process.env.AUTH_API_URL
      }/logout?user_id=${localStorage.getItem("login_user_id")}&redirect_url=${
        process.env.LOGOUT_REDIRECT_URL
      }`;
      localStorage.clear();
      window.location.href = url;
    } else {
      deleteAllCookies();
      setIsLoader(false);

      let port = "";
      if (location.port) {
        port = ":" + location.port;
      }
      let url = `${
        process.env.AUTH_API_URL
      }/logout?user_id=${localStorage.getItem("login_user_id")}&redirect_url=${
        process.env.LOGOUT_REDIRECT_URL
      }`;
      localStorage.clear();
      window.location.href = url;
    }
  };
  function handleProfileClick() {
    window.open(process.env.AUTH_API_URL + "/profile", "_blank");

    // navigate("/profile/info");
  }
  function handleClickInviteUser() {
    window.open(
      process.env.AUTH_API_URL +
        "/entity-users-management/" +
        localStorage.getItem("entity_id") +
        "?invite_user=true",
      "_blank"
    );

    // navigate("/profile/info");
  }
  function handleIdentityClick() {
    navigate("/profile/identities");
  }

  function handleClick(itemId, parentId, url) {
    setActiveItemId(isExpanded(itemId) ? parentId : itemId);
    console.log(url, "url");
    navigate(url);
  }
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
    } else if (window.location.host.search("dev") != -1) {
      window.location.href = `${window.location.protocol}//dev-portal.${domain}${port}/splash`;
    } else {
      window.location.href = `${window.location.protocol}//portal.${domain}${port}/splash`;
    }
  }
  function handleClick(itemId, parentId, setVisible) {
    if (itemId == "ageing_report") {
      handleAgeingReportModal();
      // handleAgingReport();
    }
    if (itemId == "settings") {
      handleCountrySettings();
    }
    if (itemId == "consumption_report") {
      handleConsumptionReport();
    }

    setActiveItemId(isExpanded(itemId) ? parentId : itemId);

    // if (setVisible) {
    //   setVisible(false);
    // }
  }

  const handleCountrySettings = () => {
    console.log("i am here is the ");
    handleOpenSettings();
  };
  const handleCloseModal = () => {
    setModalShowConsumption(false);
  };
  const handleCloseModalAgeing = () => {
    setModalShowAgeing(false);
  };
  const handleTimePeriodChange = (value) => {
    setSelectedTimePeriod(value);

    switch (value) {
      case "1":
      case "2":
      case "12":
        setStartDate(calculateDate(-parseInt(value), "months"));
        setEndDate(currentDate());
        break;
      case "custom":
        setStartDate(currentDate());
        setEndDate(currentDate());
        break;
      default:
        break;
    }
  };
  const calculateDate = (duration, unit) => {
    const currentDate = new Date();
    const calculatedDate = new Date(currentDate);

    if (unit === "months") {
      calculatedDate.setMonth(currentDate.getMonth() + duration);
    } else if (unit === "years") {
      calculatedDate.setFullYear(currentDate.getFullYear() + duration);
    }

    const formattedDate = calculatedDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    return formattedDate;
  };

  const currentDate = () => {
    const currentDateTime = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    return currentDateTime;
  };

  const handleAlert = ({ variant, message, hideAuto }) => {
    setAlertProps({ variant, message, show: true, hideAuto });
  };
  const consumptionModal = (
    <Modal
      size="md"
      show={modalShowConsumption}
      onHide={handleCloseModal}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <div>
            <h3>Consumption Report</h3>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          {isLoaderConsumptioin ? (
            // <LoadingSpinner animation="grow" custom={true} height="20vh" />
            <Loader />
          ) : (
            <Row>
              <Col xs={12} md={12}>
                <Form>
                  <Form.Group controlId="formTimePeriod">
                    <Form.Label>
                      To download the report, please select the time period.
                    </Form.Label>
                    <Form.Control
                      as="select"
                      value={selectedTimePeriod}
                      onChange={(e) => handleTimePeriodChange(e.target.value)}
                    >
                      <option value="">Please Select</option>
                      <option value="1">1 Month</option>
                      <option value="2">2 Months</option>
                      <option value="12">1 Year</option>
                      <option value="custom">Custom Date</option>
                    </Form.Control>
                  </Form.Group>
                  <div
                    style={{ marginTop: "1rem", marginBottom: "1rem" }}
                  ></div>
                  {selectedTimePeriod === "custom" && (
                    <>
                      <Form.Group controlId="formStartDate">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </Form.Group>
                      <div style={{ marginTop: "1rem" }}></div>
                      <Form.Group controlId="formEndDate">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </Form.Group>
                    </>
                  )}
                  <div className="d-flex justify-content-around mt-4">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={async () => {
                        await handleDownloadClickConsumption();
                      }}
                    >
                      Download
                    </Button>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              </Col>
            </Row>
          )}
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
  const ageingModal = (
    <Modal
      size="md"
      show={modalShowAgeing}
      onHide={handleCloseModalAgeing}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <div>
            <h3>Ageing Report</h3>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          {isLoaderConsumptioin ? (
            <LoadingSpinner animation="grow" custom={true} height="20vh" />
          ) : (
            <Row>
              <Col xs={12} md={12}>
                <Form>
                  <Form.Group controlId="formTimePeriod">
                    <Form.Label>
                      To download the report, please select type.
                    </Form.Label>
                    <Form.Control
                      as="select"
                      value={ageingReportType}
                      onChange={(e) => setAgeingReportType(e.target.value)}
                    >
                      <option value="">Please Select</option>
                      <option value="csv">Csv</option>
                      <option value="pdf">Pdf</option>
                    </Form.Control>
                  </Form.Group>
                  <div
                    style={{ marginTop: "1rem", marginBottom: "1rem" }}
                  ></div>

                  <div className="d-flex justify-content-around mt-4">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={async () => {
                        await handleAgingReport();
                      }}
                    >
                      Download
                    </Button>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleCloseModalAgeing}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              </Col>
            </Row>
          )}
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const handleConsumptionReport = () => {
    setModalShowConsumption(true);
  };
  const handleAgeingReportModal = () => {
    setModalShowAgeing(true);
  };
  const handleDownloadClickConsumption = async () => {
    setIsLoaderConsumption(true);
    console.log("this is start", startDate);
    console.log("this is start end", endDate);

    try {
      const response = await getConsumptionReport(
        startDate,
        endDate,
        cancelTokenSource.token
      );
      if (response?.success) {
        window.open(response?.data?.getSignedUrl, "_blank");
        setModalShowConsumption(false);
        setIsLoaderConsumption(false);

        //getSignedUrl
      } else {
        setIsLoaderConsumption(false);
      }
    } catch (error) {
      setIsLoaderConsumption(false);
      console.log("error", error);

      handleAlert({
        variant: "danger",
        message: "Some thing went Wrong!",
        show: true,
        hideAuto: true,
      });
      // Handle request error
    }
  };
  const handleAgingReport = async () => {
    setIsLoaderConsumption(true);

    try {
      const currentDateTime = new Date().toISOString();

      // Initial request to start the process
      const initialResponse = await getAgeingReport(
        userTimezone,
        ageingReportType,
        cancelTokenSource.token
      );

      if (initialResponse.success) {
        let key = initialResponse.data.uuid;
        let status = initialResponse.data.status;

        // Polling loop

        while (status !== "COMPLETED") {
          setIsLoaderConsumption(true);

          // Make a polling request with the key
          const pollingResponse = await getAgeingReportWithKey(
            key,
            userTimezone,
            ageingReportType,
            cancelTokenSource.token
          );
          if (pollingResponse.success) {
            status = pollingResponse.data.status;
          }

          if (status === "COMPLETED") {
            // Process is completed, and the response likely contains the URL to download the CSV.
            const downloadUrl = pollingResponse.data.data?.SIGNED_URL;
            window.open(downloadUrl, "_blank");
            setIsLoaderConsumption(false);
            setModalShowAgeing(false);
          } else {
            // Update the key for the next polling request

            // Use setTimeout for the delay (e.g., 2 seconds)
            await new Promise((resolve) => setTimeout(resolve, 3000));
          }
        }
      } else {
        handleAlert({
          variant: "danger",
          message: pollingResponse?.system_message,
          show: true,
          hideAuto: true,
        });
        // Handle initial request error
      }
    } catch (error) {
      handleAlert({
        variant: "danger",
        message: "Some thing went Wrong!",
        show: true,
        hideAuto: true,
      });
      // Handle request error
    }
  };

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
        )}{" "}
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
          onClick={(e) => {
            handleClickInviteUser(e);
          }}
        >
          <Dropdown.Item>Invite User</Dropdown.Item>
        </Link>
        {/* <Dropdown.Divider /> */}
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
      <a
        className="navbar-user-link"
        role="button"
        onClick={() => setModalNotificationsVisible(true)}
      >
        <Icon>
          <FeatherIcon icon="bell" size="20" />
        </Icon>
      </a>
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
          )}
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
            onClick={(e) => {
              handleClickInviteUser(e);
            }}
          >
            <Dropdown.Item>Invite User</Dropdown.Item>
          </Link>
          {/* <Dropdown.Divider /> */}
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
      {getItems(Object.keys(data))}
      {/* <OverlayTrigger placement={"right"} overlay={<Tooltip id={`tooltip-${"right"}`}>{theme == "dark" ? "Change To Light Mode" : "Change To Dark Mode"}</Tooltip>}>
        <Link style={{ display: "flex", justifyContent: "center", marginTop: "10px" }} to={``}>
          <Nav.Link
            onClick={(e) => {
              handleClickTheme(e);
            }}
          >
            {theme == "dark" ? <FeatherIcon icon={"sun"} size="17" /> : <FeatherIcon icon={"moon"} size="17" />}
          </Nav.Link>
        </Link>
      </OverlayTrigger> */}
      <div className="mt-auto mb-md-4" />
      {footer}
    </Navbar.Collapse>
  );
  const handleCloseAlert = () => {
    setAlertProps({ ...alertProps, show: false });
  };

  return (
    <>
      <Navbar
        expand="md"
        className="navbar navbar-vertical navbar-vertical-sm fixed-start navbar-expand-md"
        collapseOnSelect={true}
        {...props}
      >
        <Container fluid>
          {(isLoader || isLoaderAgeing) && <Loader />}
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
      {openSettings && (
        <SettingsModal
          closeModal={handleCloseSettings}
          openSettings={openSettings}
        />
      )}
      {modalShowConsumption && consumptionModal}
      {modalShowAgeing && ageingModal}
      {alertProps.show && (
        <></>
        // <CustomAlert
        //   handleCloseAlert={handleCloseAlert}
        //   message={alertProps.message}
        //   variant={alertProps.variant}
        //   show={alertProps.show}
        //   hideAuto={alertProps.hideAuto}
        //   onClose={() => setAlertProps({ ...alertProps, show: false })}
        // >
        //   {alertProps.message}
        // </CustomAlert>
      )}
    </>
  );
}
