import {
  Col,
  Container,
  Row,
  Nav,
  Spinner,
  Form,
  Button,
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { getMissingDataOfIdentity } from "../../../../helpers";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import {
  getWalletAddressListAPI,
  addWalletAddressAPI,
  getCryptoCurrencyChainListAPI,
} from "../../../../api/network/customerApi";

// import LoadingSpinner from "../../../../widgets/bootstrap-component/Spinner";
// import CustomAlert from "../../../../widgets/bootstrap-component/Alert";
import Loader from "../../../../components/ui/loader";
import { BsChevronRight } from "react-icons/bs";

export default function wallets({ isShowInvestmentTab }) {
  const navigate = useNavigate();
  const params = useParams();
  const cancelTokenSource = axios.CancelToken.source();
  const [isLoader, setIsLoader] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [cryptoCurrency, setCryptoCurrency] = useState("");
  const [walletAddressData, setWalletAddressData] = useState([]);
  const [walletAddressError, setWalletAddressError] = useState(false);
  const [cryptoCurrencyError, setCryptoCurrencyError] = useState(false);
  const [chainList, setChainList] = useState([]);
  const [alertProps, setAlertProps] = useState({
    variant: "",
    message: "",
    show: false,
    hideAuto: false,
  });
  const handleAlert = ({ variant, message, hideAuto }) => {
    setAlertProps({ variant, message, show: true, hideAuto });
  };

  useEffect(() => {
    getWalletAddressList(params?.identity_id);
    getCryptoCurrencyChainList();
  }, []);

  const getWalletAddressList = async (identityId) => {
    setIsLoader(true);
    const response = await getWalletAddressListAPI(
      identityId,
      cancelTokenSource.token
    );
    setIsLoader(false);
    if (response.success == true) {
      setWalletAddressData(response?.data);
    } else {
    }
  };
  const getCryptoCurrencyChainList = async () => {
    setIsLoader(true);
    let account_id = null;
    if (params?.account_id) {
      account_id = params?.account_id;
    }
    const response = await getCryptoCurrencyChainListAPI(
      account_id,
      cancelTokenSource.token
    );
    setIsLoader(false);
    if (response.success == true) {
      setChainList(response?.data?.response?.data);
    } else {
    }
  };
  const handleSubmit = (e) => {
    if (walletAddress == "" || cryptoCurrency == "") {
      if (walletAddress == "") {
        setWalletAddressError(true);
      } else {
        setWalletAddressError(false);
      }
      if (cryptoCurrency == "") {
        setCryptoCurrencyError(true);
      } else {
        setCryptoCurrencyError(false);
      }
      return;
    } else {
      setWalletAddressError(false);
      setCryptoCurrencyError(false);

      let dataToSend = {
        chain: cryptoCurrency,
        address: walletAddress,
      };
      submitWalletAddress(dataToSend);
    }
  };
  const submitWalletAddress = async (dataToSend) => {
    setIsLoader(true);
    const response = await addWalletAddressAPI(
      dataToSend,
      params?.identity_id,
      cancelTokenSource.token
    );
    setIsLoader(false);
    if (response.success == true) {
      setWalletAddressData([]);
      getWalletAddressList(params?.identity_id);
      setIsLoader(false);
      handleAlert({
        variant: "success",
        message: "Wallet Address Added Successfully",
        show: true,
        hideAuto: true,
      });
      setCryptoCurrency("");
      setWalletAddress("");
    } else {
      handleAlert({
        variant: "danger",
        message: response.user_message
          ? response.user_message
          : response.system_message,
        show: true,
        hideAuto: true,
      });
    }
  };

  const handleCloseAlert = () => {
    setAlertProps({ ...alertProps, show: false });
  };
  const handleNextStep = () => {
    let nextStepRoute;
    if (isShowInvestmentTab) {
      nextStepRoute = `/profile/identity/${params?.type}/investments/${params?.identity_id}/${params?.account_id}`;
    } else {
      nextStepRoute = `/profile/identity/${params?.type}/overview/${params?.identity_id}/${params?.account_id}`;
    }
    navigate(nextStepRoute);
  };
  return (
    <div className="main-content">
      {/* {alertProps.show && (
        <CustomAlert handleCloseAlert={handleCloseAlert} message={alertProps.message} variant={alertProps.variant} show={alertProps.show} hideAuto={alertProps.hideAuto} onClose={() => setAlertProps({ ...alertProps, show: false })}>
          {alertProps.message}
        </CustomAlert>
      )} */}
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12} lg={10} xl={10}>
            {isLoader ? (
              // <LoadingSpinner animation="grow" custom={true} height="70vh" />
              <Loader />
            ) : (
              <div className="row">
                <div className="card">
                  <div className="card-header">
                    <h4 className="card-header-title">Add Wallets</h4>
                  </div>
                  <div className="card-body">
                    <Form className="identity-form">
                      <div className="row">
                        <div className="col-3 col-md-3">
                          <div className="form-group">
                            <label className="form-label">Chains</label>
                            <select
                              type="text"
                              className={"form-control"}
                              defaultValue={cryptoCurrency}
                              onChange={(e) => {
                                setCryptoCurrency(e.target.value);
                              }}
                            >
                              <option value="">Select Chains</option>
                              {chainList.length > 0 &&
                                chainList.map((item, index) => (
                                  <option key={index} value={item.chain}>
                                    {item.chain == "ETH"
                                      ? "ETH / ERC- 20"
                                      : item.chain}
                                  </option>
                                ))}
                            </select>
                            {cryptoCurrencyError ? (
                              <span className="error-fields">
                                Select Chains to Continue
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <div className="col-9 col-md-9">
                          <div className="form-group">
                            <label className="form-label">Wallet Address</label>
                            <input
                              type="text"
                              className={"form-control"}
                              placeholder="Wallet Address"
                              defaultValue={walletAddress}
                              onChange={(e) => {
                                setWalletAddress(e.target.value);
                              }}
                            />
                            {walletAddressError ? (
                              <span className="error-fields">
                                Enter Wallet Address To Continue
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <div className="col-sm-2">
                          <Button
                            className="btn btn-primary"
                            onClick={(e) => {
                              handleSubmit(e);
                            }}
                          >
                            Submit
                          </Button>
                        </div>
                      </div>
                    </Form>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header">
                    <h4 className="card-header-title">Wallets List</h4>
                  </div>
                  <div className="card-body">
                    <table className="table table-sm table-nowrap card-table">
                      <thead>
                        <tr>
                          <th>Chain</th>
                          <th>Address</th>
                        </tr>
                      </thead>
                      <tbody className="list">
                        {walletAddressData &&
                          walletAddressData.map((item, index) => (
                            <tr key={index}>
                              <td className="uppercase-text">
                                {item?.meta?.data?.chain}
                              </td>
                              <td className="uppercase-text">
                                {item?.meta?.data?.address}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            <br />
            <br />
          </Col>
          {params?.identity_id && params?.account_id && (
            <Col
              style={{
                display: "flex",
                justifyContent: "end",
                paddingBottom: "2em",
              }}
              xs={12}
              lg={10}
              xl={10}
            >
              <Button onClick={handleNextStep}>
                Next <BsChevronRight />
              </Button>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}
