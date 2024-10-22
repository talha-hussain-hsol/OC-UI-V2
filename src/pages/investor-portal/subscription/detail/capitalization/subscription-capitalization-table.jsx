import { Col, Container, Row, Nav } from 'react-bootstrap';
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Header } from '../../../../../components';
import { Chart } from '../../../../../components/vendor';
import FeatherIcon from 'feather-icons-react';
export default function SubscriptionCapitalizationLegend({ ...props }) {

    return (
        <div className="main-content">
            <div className="card">
                <div className="card-header">
                    <h1 className="header-title">
                        Portfolio
                    </h1>

                    <p className="header-subtitle">
                        <a className="btn btn-white btn-sm">Update</a>
                    </p>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="table-responsive">
                            <table className="table table-sm table-nowrap card-table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Authorized Shares</th>
                                        <th>Outstanding</th>
                                        <th>Ownership</th>
                                        <th>Fully Diluted</th>
                                        <th>Ownership</th>
                                        <th>Amount</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody className="list">
                                    <tr>
                                        <td>Company A Series A</td>
                                        <td>80,000,000,000</td>
                                        <td>5,200,000</td>
                                        <td>34.343%</td>
                                        <td>5,200,000</td>
                                        <td>9.228%</td>
                                        <td>$35,000,000.00</td>
                                        <td><span class="text-success">
                                            <FeatherIcon
                                                icon="check-circle"
                                                size="15"
                                            />
                                        </span> View</td>
                                    </tr>
                                    <tr>
                                        <td>Company B Series D Prefered</td>
                                        <td>1,000,000</td>
                                        <td>1,000,000</td>
                                        <td>6.066%</td>
                                        <td>1,000,000</td>
                                        <td>1.630%</td>
                                        <td>$5,360,000.00</td>
                                        <td><span class="text-success">
                                            <FeatherIcon
                                                icon="check-circle"
                                                size="15"
                                            />
                                        </span> View</td>
                                    </tr>
                                    <tr>
                                        <td>Company C Series B</td>
                                        <td>--</td>
                                        <td>0</td>
                                        <td>0.000%</td>
                                        <td>0</td>
                                        <td>0.00%</td>
                                        <td>$0.00</td>
                                        <td><span class="text-success">
                                            <FeatherIcon
                                                icon="check-circle"
                                                size="15"
                                            />
                                        </span> View</td>
                                    </tr>
                                    <tr>
                                        <td>Company D Series B</td>
                                        <td>2,000,000</td>
                                        <td>1,254,325</td>
                                        <td>7.626%</td>
                                        <td>1,254,325</td>
                                        <td>2.049%</td>
                                        <td>$383,376.57</td>
                                        <td><span class="text-success">
                                            <FeatherIcon
                                                icon="check-circle"
                                                size="15"
                                            />
                                        </span> View</td>
                                    </tr>
                                    <tr>
                                        <td>Company E Series B</td>
                                        <td>--</td>
                                        <td>0</td>
                                        <td>0.000%</td>
                                        <td>0</td>
                                        <td>0.00%</td>
                                        <td>$0.00</td>
                                        <td><span class="text-success">
                                            <FeatherIcon
                                                icon="check-circle"
                                                size="15"
                                            />
                                        </span> View</td>
                                    </tr>
                                    <tr>
                                        <td>Comapny F Series A Preferred</td>
                                        <td>--</td>
                                        <td>3,029,341</td>
                                        <td>18.375%</td>
                                        <td>3,029,341</td>
                                        <td>4.937%</td>
                                        <td>$3,695,799.25</td>
                                        <td><span class="text-success">
                                            <FeatherIcon
                                                icon="check-circle"
                                                size="15"
                                            />
                                        </span> View</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
