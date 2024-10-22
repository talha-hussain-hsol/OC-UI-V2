import className from 'classnames';
import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom'
import React, { useMemo, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
    Chart,
    ChartLegend,
    Highlight,
} from "../../../../components/vendor";
import {
    AnalyticsAverageTime,
    AnalyticsConversions,
    AnalyticsExit,
    AnalyticsGoals,
    AnalyticsHeader,
    AnalyticsProjects,
    AnalyticsRecentActivity,
    AnalyticsSales,
    AnalyticsScratchpadChecklist,
    AnalyticsTotalHours,
    AnalyticsTrafficChannels,
    AnalyticsValue,
} from "../../../../widgets";
import {
    Alert,
    Badge,
    Button,
    Card,
    CloseButton,
    Col,
    Dropdown,
    Form,
    InputGroup,
    ListGroup,
    Pagination,
    Row,
    Table,
    Container,
    Nav,
} from "react-bootstrap";

import { Flatpickr } from "../../../../components/vendor";
// import {DynamicHeader} from '../../widgets';
import { data } from './data'
export default function OrganizationDashboard({ ...props }) {
    const [searchResultDocument, setSearchResultDocument] = useState(data?.searchResult);
    return (
        <>
            <div className="main-content">
                {/* <AnalyticsHeader /> */}
                <Container fluid>
                    <Card {...props}>
                        <Card.Header>
                            <h4 className="card-header-title">Documents</h4>
                        </Card.Header>
                        <Card.Body>
                            <Row className="align-items-center" style={{ padding: '20px' }}>
                                <div className="col-3 col-md-3">
                                    <div className="form-group">
                                        <label className="form-label">
                                            Document Category
                                        </label>

                                        <select className={"form-control"} >
                                            <option value="">Select Document Category</option>
                                            {searchResultDocument && searchResultDocument.map((item, index) => (
                                                 <option value="">{item?.documentDescription}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-3 col-md-3">
                                    <div className="form-group">
                                        <label className="form-label">
                                            Fund
                                        </label>

                                        <select className={"form-control"} >
                                            <option value="">Standard Chartered Client's Fund</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-3 col-md-3">
                                    <div className="form-group" style={{display: 'flex', flexDirection: 'column'}}>
                                        <label className="form-label">
                                            As Of Date
                                        </label>
                                        <Flatpickr
                                            placeholder={'As Of Date'}
                                            className={"form-control"}
                                            options={{
                                                // dateFormat: formatDateRegionWise(null, null, true),
                                                allowInput: true, // Enable manual input
                                                static: true,
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="col-3 col-md-3">
                                    <button className="btn btn-danger">Clear Filter</button>
                                </div>
                            </Row>
                        </Card.Body>
                    </Card>
                    <Card {...props}>
                        <Card.Header>
                            <h4 className="card-header-title">Search Result</h4>
                            <input style={{width:'20%'}} type="text" className="form-control" placeholder='Filter Document'/>
                        </Card.Header>
                        <Card.Body>
                            <table className="table table-sm table-nowrap card-table">
                                <thead>
                                    <tr>
                                        <th>Document Description</th>
                                        <th>Fund</th>
                                        <th>Valuation Date</th>
                                        <th>Posting Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchResultDocument && searchResultDocument.map((item, index) => (
                                        <tr>
                                            <th><a href={'https://storage.googleapis.com/one-constellation-bucket-public/DocumentRepo/Investor/'+item?.url} target="_blank">{item?.documentDescription}</a></th>
                                            <th><span style={{color:'#2e77e7'}}>{item?.fund}</span></th>
                                            <th><span style={{color:'#2e77e7'}}>{item?.valueDate1}</span></th>
                                            <th><span style={{color:'#2e77e7'}}>{item?.valueDate2}</span></th>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Card.Body>
                    </Card>
                </Container>
            </div>{" "}
        </>
    );
}