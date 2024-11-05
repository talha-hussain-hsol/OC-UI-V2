import { Button, Col, Container, Form, Row, Card, Nav, Spinner, Pagination } from 'react-bootstrap';
import  AdministrationKYWHeader  from '../../../../../widgets/AdministrationKYWHeader';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useParams} from "react-router-dom";
import UPPSalla from './UPPSalla';
import FeatherIcon from 'feather-icons-react';
// import RestrictedList from './../entity/screening/restricted-list';
// import InternetSearch from './../entity/screening/internet-search';
import { getWalletScreeningAPI, getCustomerScreeningPullAPI, getScreeningDetailAPI, getWalletRescreenCaseAPI, getWalletScreeningHistoryAPI } from "../../../../../api/network/AdministrationApi/AdministrationApi";
export default function Screening({ ...props }) {
    const cancelTokenSource = axios.CancelToken.source();
    const params = useParams();
    const [tabIndex, setTabIndex] = useState(0);
    const [customerSummaryListForPulling, setWalletSummaryListForPulling] = useState([]);
    const [isLoaderSummary, setIsLoaderSummary] = useState(false);
    const [isLoaderDetail, setIsLoaderDetail] = useState(false);
    const [pullStatus, setPullStatus] = React.useState([]);
    const [customerSummaryList, setCustomerSummaryList] = useState([]);
    const [refreshData, setRefreshData] = React.useState(false);
    const [screeningWallet, setScreeningWallet] = useState();
    const [screeningWorldCheck, setScreeningWorldCheck] = useState();
    const [screeningDowJones, setScreeningDowJones] = useState();
    const [screeningRestrictedList, setScreeningRestrictedList] = useState();
    const [screeningComments, setScreeningComments] = useState();
    const [screeningWorldCheckDetailData, setScreeningWorldCheckDetailData] = useState();
    const [screeningDowJonesDetailData, setScreeningDowJonesDetailData] = useState();
    const [screeningSummaryTotalCount, setScreeningSummaryTotalCount] = useState(0);
    const [screeningDetail, setScreeningDetail] = useState(null);
    const [checkedPEP, setCheckedPEP] = React.useState('');
    const [checkedSanction, setCheckedSanction] = React.useState('');
    const [checkedAdverse, setCheckedAdverse] = React.useState('');
    const [checkedNoHit, setCheckedNoHit] = React.useState('');
    const [conclusionLoader, setConclusionLoader] = React.useState(false);
    const [screeningError, setScreeningError] = React.useState('');
    const [validationError, setValidationError] = React.useState(false);
    const [selectedScreeningId, setSelectedScreeningId] = React.useState('');
    const [walletScreeningHistory, setWalletScreeningHistory] = React.useState([]);
    const [isLoaderHistory, setIsLoaderHistory] = React.useState(false);
    const [walletScreeningHistoryCount, setWalletScreeningHistoryCount] = useState(0);
    const [pageOptions, setPageOptions] = useState([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    // const [alertProps, setAlertProps] = useState({
    //     variant: "",
    //     message: "",
    //     show: false,
    //     hideAuto: false,
    //   });
    //   const handleAlert = ({ variant, message, hideAuto }) => {
    //     setAlertProps({ variant, message, show: true, hideAuto });
    //   };
    // const handleCloseAlert = () => {
    //     setAlertProps({ ...alertProps, show: false });
    //   };
    useEffect(() => {
        getScreening();
        getScreeningHistory();
    }, []);
    useEffect(() => { checkAndPullData(); }, [customerSummaryListForPulling]);
    useEffect(() => { setStatusAndPullCall() }, [pullStatus])
    useEffect(() => { if (refreshData) { setScreeningWallet(null); setScreeningDowJones(null); setScreeningWorldCheck(null); setScreeningRestrictedList(null) } }, [refreshData])

    useEffect(
        function () {
            if (walletScreeningHistory && walletScreeningHistoryCount != 0) {
                let totalRecords = walletScreeningHistoryCount;
                let numberOfPages = totalRecords / rowsPerPage;
                let roundedUp = Math.ceil(numberOfPages);
                let resultArray = [];
                for (let i = 1; i <= roundedUp; i++) {
                    resultArray.push(i);
                }
                setPageOptions(resultArray);
            }
        },
        [walletScreeningHistory, walletScreeningHistoryCount]
    );

    const getScreening = async () => {
        setIsLoaderSummary(true);
        setCustomerSummaryList(null)
        const response = await getWalletScreeningAPI(params?.fund_id, params?.wallet_id, cancelTokenSource.token);
        if (response.success == true) {
            setIsLoaderSummary(false);
            if(response?.data?.meta?.report?.errorObject){
                props?.handleAlert({
                    variant: "danger",
                    message: response?.data?.meta?.report?.errorObject?.data?.message || 'Something went wrong!',
                    show: true,
                    hideAuto: true,
                  });
            }
            setWalletSummaryListForPulling(response.data);
            setCustomerSummaryList(response?.data)
            

        } else {
          
            setIsLoaderSummary(false);
        }
    }
    const getScreeningHistory = async () => {
        setIsLoaderHistory(true)
        let offset = 0;
        if (pageIndex == 1) {
            offset = 0;
        } else {
            offset = rowsPerPage * (pageIndex - 1);
        }
        const response = await getWalletScreeningHistoryAPI(params?.wallet_id, rowsPerPage, offset, cancelTokenSource.token);
        setIsLoaderHistory(false)
        if (response.success == true) {
            setWalletScreeningHistory(response?.data?.rows)
            setWalletScreeningHistoryCount(response?.data?.count)
        } else {
        }
    }
    function checkAndPullData() {
        if (customerSummaryListForPulling?.queueInfo) {
            let pullId = new Array();
            let storeData = new Array();
            let getCookieData = document.cookie.match(new RegExp("queueId-" + params.fund_id + "-" + params.wallet_id + '=([^;]+)'));
            console.log(getCookieData, 'getCookieData')
            if (getCookieData) {
                if (getCookieData[1]) {
                    let cookieData = JSON.parse(getCookieData[1]);
                    if (cookieData.length > 0) {
                        for (let b = 0; b < cookieData.length; b++) {
                            pullId.push(cookieData[b]?.queue_id)
                        }
                    }
                }
            } else if (!getCookieData && !customerSummaryListForPulling?.queueInfo) {
                // getAllRescreenCase()
            }
            if (customerSummaryListForPulling?.status == "NOT_INITIATED" && customerSummaryListForPulling?.queueInfo === null) {

            } else if (customerSummaryListForPulling?.queueInfo) {

                pullId.push(customerSummaryListForPulling?.queueInfo?.id)
                let dataToStore = {
                    fund_id: params.fund_id,
                    wallet_id: params.wallet_id,
                    queue_id: customerSummaryListForPulling?.queueInfo?.id
                }
                storeData.push(dataToStore);

            }

            if (storeData.length > 0) {
                var date = new Date();
                date.setTime(date.getTime() + (1 * 24 * 60 * 60 * 1000));
                var expires = "; expires=" + date.toUTCString();
                const url = new URL(window.location.href);
                const domain = url.hostname.split(".").slice(-2).join(".");
                document.cookie = `queueId-${params.fund_id}-${params.wallet_id}=${JSON.stringify(storeData) + expires};domain=${domain};path=/`;
            }
            console.log(pullId, 'pullId')

            if (pullId.length > 0) {
                setTimeout(function () {
                    pullScreeningApi(pullId)
                    // setIsLoader(false)
                }, 10000);
                console.log(pullId, 'pullId')
            } else {
                // getScreening()
            }
        }
    }
    const pullScreeningApi = async (id) => {

        const dataToSend = {
            id: id
        }
        console.log(dataToSend, 'dataToSend')
        const response = await getCustomerScreeningPullAPI(dataToSend, cancelTokenSource.token);
        if (response.success == true) {
            // setIsLoader(false)
            setPullStatus(response.data)
        } else {
            // setIsLoader(false)
            console.log('Failed Response', response);
        }
    };
    const setStatusAndPullCall = () => {
        console.log(pullStatus, 'pullStatus')
        console.log(customerSummaryList, 'customerSummaryList customerSummaryList customerSummaryList')
        let pullIdData = new Array();
        pullStatus?.pullStatus?.map((value, index) => {
            if (value.status == "PROCESSED") {
                if (customerSummaryList?.pullStatus?.length > 0) {
                    for (let a = 0; a < customerSummaryList?.pullStatus.length; a++) {
                        if (customerSummaryList?.pullStatus[a].id == value.screening_id) {
                            let statusData = new Array()
                            console.log(value, 'value value value value value')
                            if (value.conclusion.length > 0) {
                                for (let s = 0; s < value.conclusion.length; s++) {
                                    console.log(value?.conclusion[s].status, 'value?.conclusion[s].status')
                                    statusData.push(value?.conclusion[s].status)
                                }
                            }
                            console.log(statusData, 'statusData statusData')
                            console.log(value.id, 'value.id haha')
                            customerSummaryList.pullStatus[a].screenProcessed = true
                            customerSummaryList.pullStatus[a].screenConculion = statusData
                        }
                    }
                }
                // setIsLoader(false)
                var expires = "; expires=Thu, 18 Dec 2013 12:00:00 UTC";
                const url = new URL(window.location.href);
                const domain = url.hostname.split(".").slice(-2).join(".");
                document.cookie = `queueId-${params.fund_id}-${params.identity_id}=${JSON.stringify([]) + expires};domain=${domain};path=/`;
            }
            if (value.status != "PROCESSED" && value.found) {
                pullIdData.push(value.id)
            }
        })
        console.log(pullIdData, 'pullIdData')
        if (pullIdData.length > 0) {
            setTimeout(function () {
                pullScreeningApi(pullIdData)
            }, 10000);
        } else {
            getScreening()
            getScreeningHistory();
            // getCustomerScreeningSummary(0, 5)
        }
    }
    const handleRescreenCase = (e) => {
        getAllRescreenCase()

    }
    const getAllRescreenCase = async () => {

        setIsLoaderSummary(true)
        const response = await getWalletRescreenCaseAPI(params?.fund_id, params.wallet_id, cancelTokenSource.token);
        if (response.success == true) {
            // setIsLoader(false)
            
            setIsLoaderSummary(false)
            setRefreshData(false)
            setWalletSummaryListForPulling(response.data);
            setCustomerSummaryList(response?.data)

            console.log(response, 'response responseresponse')
            // getCustomerScreeningSummary(0, 5)
            console.log('Success Response', response.data);
        } else {
           
            setIsLoaderSummary(false)
            // setIsLoader(false)
            console.log('Failed Response', response);
        }
    };


    const handleGetScreeningDetail = (e, data) => {
        setScreeningDetail(null)
        if(customerSummaryList?.meta?.report?.errorObject){
            props?.handleAlert({
                variant: "danger",
                message: data?.meta?.report?.errorObject?.data?.message,
                show: true,
                hideAuto: true,
              });
        }
        
        setTimeout(function(){
            setScreeningDetail(data?.meta?.report)
        },500)
        
    }
    const getScreeningDetail = async (id) => {
        setIsLoaderDetail(true)
        setScreeningDetail(null)
        const response = await getScreeningDetailAPI(params?.fund_id, id, cancelTokenSource.token);
        if (response.success == true) {
            setIsLoaderDetail(false)
            setScreeningDetail(response?.data)
        } else {

            setIsLoaderDetail(false)
            console.log('Failed Response', response);
        }
    }
    const handleClickPrevious = (e) => {
        setPageIndex(pageIndex - 1);
    };
    const handleClickNext = (e) => {
        setPageIndex(pageIndex + 1);
    };
    const gotoPage = (page) => {
        setPageIndex(page);
    };
    return (
        <div className="main-content">
            
            <Container fluid>
                <Row className="justify-content-center">
                    <Col xs={12} lg={12} xl={12}>
                        <AdministrationKYWHeader smallTitle={"ADMINISTRATION PORTAL [SCHMITT, EFFERTZ AND MARQUARDT]"} type="Glover Group" pageType={"Summary"} entityName="Kailey Cremin PhD" isShowOrganizationLogo={true} organizationLogo="" />

                        <div className="row">
                            <div className="card">
                                <div className="card-header">
                                    <Col>
                                        <h4 className="card-header-title">
                                            Wallet Screening
                                        </h4>
                                    </Col>
                                    <Col xs="auto">
                                        <button className="btn btn-sm btn-primary" onClick={(e) => { handleRescreenCase(e) }}>
                                            Re-Screen
                                        </button>
                                    </Col>
                                </div>
                                <div className="card-body">
                                    {isLoaderSummary ?
                                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            <Spinner animation="grow" />
                                        </div>

                                        :
                                        <div className="list-group list-group-flush my-n3">
                                            {customerSummaryList &&
                                                <div className="list-group-item">
                                                    <div className="row align-items-center">
                                                        <div className="col">

                                                            <h4 className="font-weight-base mb-1">
                                                                {customerSummaryList?.meta?.payload?.screening?.UPPSALA?.case?.address}
                                                            </h4>
                                                            <small className="text-muted">
                                                                {customerSummaryList?.meta?.payload?.screening?.UPPSALA?.case?.chain}
                                                            </small>
                                                        </div>
                                                        <div className="col-auto">
                                                            <button onClick={(e) => { handleGetScreeningDetail(e, customerSummaryList) }}
                                                                className={customerSummaryList?.status != 'PROCESSED' ? "btn btn-sm btn-danger" : customerSummaryList?.meta?.report?.data === null ? "btn btn-sm btn-danger" : "btn btn-sm btn-success"}>
                                                                {customerSummaryList?.status == "PROCESSED" && customerSummaryList?.meta?.report?.data != null ? "Detail" : customerSummaryList?.meta?.report?.data === null && customerSummaryList?.meta?.report?.errorObject ? "Error" : "Calculating..."}
                                                            </button>
                                                            {/* {customerSummaryList?.meta?.report?.data === null && customerSummaryList?.meta?.report?.errorObject ? <p className="error-fields">{customerSummaryList?.meta?.report?.errorObject?.data?.message}</p> : null} */}

                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="card">
                                <div className="card-header">
                                    <Col>
                                        <h4 className="card-header-title">
                                            Wallet Screening History
                                        </h4>
                                    </Col>
                                </div>
                                <div className="card-body">
                                    {isLoaderHistory ?
                                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            <Spinner animation="grow" />
                                        </div>

                                        :
                                        <>
                                            <table className="table table-sm table-nowrap card-table">
                                                <thead>
                                                    <tr>
                                                        <th>CRYPTO ADDRESS</th>
                                                        <th>TYPE</th>
                                                        <th>SUBMISSION DATE</th>
                                                        <th>TOTAL AMT</th>
                                                        <th>TOTAL TX</th>
                                                        <th>RISK</th>
                                                        <th>STATUS</th>
                                                        <th>ACTION</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="list">
                                                    {walletScreeningHistory && walletScreeningHistory.map((item, index) => (
                                                        <tr key={index}>
                                                            <td className="uppercase-text">{item?.meta?.payload?.screening?.UPPSALA?.case?.address}</td>
                                                            <td className="uppercase-text">{item?.meta?.payload?.screening?.UPPSALA?.case?.chain}</td>
                                                            <td>{item?.meta?.report?.data?.response[0]?.analysis_start_time}</td>
                                                            <td>{item?.meta?.report?.data?.response[0]?.total_amt}</td>
                                                            <td>{item?.meta?.report?.data?.response[0]?.total_tx}</td>
                                                            <td>
                                                                {item?.meta?.report?.data?.response[0]?.risk_score >= 0 && item?.meta?.report?.data?.response[0]?.risk_score <= 15 ? (
                                                                    <span style={{ color: "#80c380" }} className="value">LOW RISK</span>
                                                                ) : item?.meta?.report?.data?.response[0]?.risk_score >= 16 && item?.meta?.report?.data?.response[0]?.risk_score <= 30 ? (
                                                                    <span style={{ color: "orange" }} className="value">Medium Risk</span>
                                                                ) : item?.meta?.report?.data?.response[0]?.risk_score >= 31 && item?.meta?.report?.data?.response[0]?.risk_score <= 50 ? (
                                                                    <span style={{ color: "red" }} className="value"> High Risk</span>
                                                                ) : item?.meta?.report?.data?.response[0]?.risk_score >= 51 && item?.meta?.report?.data?.response[0]?.risk_score <= 100 ? (
                                                                    <span style={{ color: "red" }} className="value"> Extremely High Risk</span>
                                                                ) : null}
                                                            </td>
                                                            <td>{item?.meta?.report ? item?.meta?.report?.status.replaceAll('_', ' ') : item?.status ? item?.status.replaceAll('_', ' ') : ''}</td>
                                                            <td>
                                                                {item?.meta?.report?.status == 'COMPLETED' ?
                                                                    <FeatherIcon
                                                                        style={{ cursor: 'pointer' }}
                                                                        onClick={(e) => { handleGetScreeningDetail(e, item) }}
                                                                        icon="eye"
                                                                        size="1em"
                                                                    />
                                                                    : null
                                                                }
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {pageOptions.length > 1 &&
                                                <div style={{ display: "flex", justifyContent: "center", marginTop: '10px' }}>
                                                    <Pagination size="lg">
                                                        <Pagination.Item
                                                            disabled={pageIndex == 1}
                                                            onClick={(e) => {
                                                                handleClickPrevious(e);
                                                            }}
                                                        >
                                                            Previous
                                                        </Pagination.Item>
                                                        {pageOptions.map((option, index) => (
                                                            <Pagination.Item
                                                                key={index}
                                                                active={option === pageIndex}
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    gotoPage(option);
                                                                }}
                                                            >
                                                                {option}
                                                            </Pagination.Item>
                                                        ))}
                                                        <Pagination.Item
                                                            onClick={(e) => {
                                                                handleClickNext(e);
                                                            }}
                                                        >
                                                            Next
                                                        </Pagination.Item>
                                                    </Pagination>
                                                </div>
                                            }
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                        {isLoaderDetail ?
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Spinner animation="grow" />
                            </div>
                            : null
                        }
                        {screeningDetail && customerSummaryList?.meta?.report?.data != null &&
                            <UPPSalla screeningDetail={screeningDetail} />
                        }

                        <br />
                        <br />
                        {/* {alertProps.show && (
        <CustomAlert top={true} handleCloseAlert={handleCloseAlert} message={alertProps.message} variant={alertProps.variant} show={alertProps.show} hideAuto={alertProps.hideAuto} onClose={() => setAlertProps({ ...alertProps, show: false })}>
          {alertProps.message}
        </CustomAlert>
      )} */}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
