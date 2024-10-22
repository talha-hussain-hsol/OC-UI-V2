import React from 'react';
import { Card, Col, ListGroup, Row, Table } from 'react-bootstrap';
import FeatherIcon from 'feather-icons-react';

export default function ProfileInfo({ ...props }) {
    return (
        <Card {...props}>
            <Card.Header>
                <h4 className="card-header-title">AGGREGATE CAPITAL ACTIVITY</h4>
            </Card.Header>
            <Card.Body style={{ maxHeight: '350px', overflow: 'auto' }}>
                <Table size="md" responsive>
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Subscription</th>
                            <th>Redemption</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Jan</td>
                            <td>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <FeatherIcon icon={'arrow-up-circle'} color={'green'} size="20" />
                                    <span>5,000,000</span>
                                </div>
                            </td>
                            <td>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <FeatherIcon icon={'arrow-up-circle'} color={'red'} size="20" />
                                    <span>500,000</span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Feb</td>
                            <td>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <FeatherIcon icon={'arrow-up-circle'} color={'green'} size="20" />
                                    <span>8,000,000</span>
                                </div>
                            </td>
                            <td>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <FeatherIcon icon={'arrow-up-circle'} color={'red'} size="20" />
                                    <span>1,000,000</span>
                                </div>
                            </td>

                        </tr>
                        <tr>
                            <td>Mar</td>
                            <td>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <FeatherIcon icon={'arrow-down-circle'} color={'red'} size="20" />
                                    <span>4,000,000</span>
                                </div>
                            </td>
                            <td>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <FeatherIcon icon={'arrow-down-circle'} color={'green'} size="20" />
                                    <span>8,00,000</span>
                                </div>
                            </td>

                        </tr>
                        <tr>
                            <td>Apr</td>
                            <td>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <FeatherIcon icon={'arrow-down-circle'} color={'red'} size="20" />
                                    <span>4,000,000</span>
                                </div>
                            </td>
                            <td>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <FeatherIcon icon={'arrow-down-circle'} color={'green'} size="20" />
                                    <span>800,000</span>
                                </div>
                            </td>

                        </tr>
                        <tr>
                            <td>May</td>
                            <td>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <FeatherIcon icon={'arrow-down-circle'} color={'red'} size="20" />
                                    <span>4,000,000</span>
                                </div>
                            </td>
                            <td>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <FeatherIcon icon={'arrow-down-circle'} color={'green'} size="20" />
                                    <span>800,000</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Card.Body>
        </Card >
    );
}
