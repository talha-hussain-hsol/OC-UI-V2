import { Col, Container, Row, Nav } from 'react-bootstrap';
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Header } from '../../../../../components';
import { Chart } from '../../../../../components/vendor';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  
export default function SubscriptionOverViewGraphNav({ ...props }) {
    const [index, setIndex] = useState(0);

    const labels = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
    ];

    const datasets = [
        {
            data: [18, 10, 5, 15, 10, 20, 15, 25, 20, 26, 25, 29, 18, 10, 5, 15, 10, 20],
            yAxisID: 'yAxisOne',
        },
        {
            data: [50, 75, 35, 25, 55, 87, 67, 53, 25, 80, 87, 45, 50, 75, 35, 25, 55, 19],
            yAxisID: 'yAxisTwo',
        },
        {
            data: [40, 57, 25, 50, 57, 32, 46, 28, 59, 34, 52, 48, 40, 57, 25, 50, 57, 29],
            yAxisID: 'yAxisThree',
        },
    ];
    const options = {
        scales: {
            yAxisOne: {
                display: 'auto',
                grid: {
                    color: '#283E59',
                },
                ticks: {
                    callback: function (value) {
                        return value + 'k';
                    },
                },
            },
            yAxisTwo: {
                display: 'auto',
                grid: {
                    color: '#283E59',
                },
                ticks: {
                    callback: function (value) {
                        return value + '%';
                    },
                },
            },
        },
    };

    return (
        <div className="main-content">
            
                <Header {...props}>
                    <Header.Body>
                        <Row className="align-items-end">
                            <Col>
                                <Header.Pretitle as="h6">Overview</Header.Pretitle>
                                <Header.Title as="h1">My NAV</Header.Title>
                            </Col>
                            <Col xs="auto">
                                <Header.Tabs>
                                    <Nav.Item>
                                        <Nav.Link className="text-center" active={index === 0} onClick={() => setIndex(0)} role="button">
                                            <Header.Pretitle className="text-secondary">Class A</Header.Pretitle>
                                            <h3 className="mb-0">$19.2k</h3>
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link className="text-center" active={index === 1} onClick={() => setIndex(1)} role="button">
                                            <Header.Pretitle className="text-secondary">Class B</Header.Pretitle>
                                            <h3 className="mb-0">92.1k</h3>
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link className="text-center" active={index === 2} onClick={() => setIndex(2)} role="button">
                                            <Header.Pretitle className="text-secondary">Class C</Header.Pretitle>
                                            <h3 className="mb-0">50.2%</h3>
                                        </Nav.Link>
                                    </Nav.Item>
                                </Header.Tabs>
                            </Col>
                        </Row>
                    </Header.Body>
                    <Header.Footer>
                        <Chart>
                            <Bar data={{ labels: labels, datasets: [{ ...datasets[index] }] }} options={options} />
                        </Chart>
                    </Header.Footer>
                </Header>
            
        </div>
    );
}
