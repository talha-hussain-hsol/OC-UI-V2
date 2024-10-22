import { Col, Container, Row, Nav } from 'react-bootstrap';
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Header } from '../../../../../components';
import { Chart } from '../../../../../components/vendor';
export default function SubscriptionCapitalizationLegend({ ...props }) {

    return (
        <div className="main-content">
           <div className="card card-fill">
                        <div className="card-header">
                            Legend
                        </div>
                        <div className="card-body text-center">
                            <div id="trafficChartLegend" className="chart-legend">
                                <div><span className="chart-legend-item">
                                    <span className="chart-legend-indicator"></span>Common Shares</span>
                                    <span className="chart-legend-item"><span className="chart-legend-indicator" style={{backgroundColor: '#A6C5F7'}}></span>Preferred Shares</span>
                                    <span className="chart-legend-item"><span className="chart-legend-indicator" style={{backgroundColor: '#D2DDEC'}}></span>Warrents</span>
                                    <span className="chart-legend-item"><span className="chart-legend-indicator" style={{backgroundColor: '#2C7CD5'}}></span>Outstanding</span>
                                    <span className="chart-legend-item"><span className="chart-legend-indicator" style={{backgroundColor: '#A69FF7'}}></span>Available</span>
                                    <span className="chart-legend-item"><span className="chart-legend-indicator" style={{backgroundColor: '#D288EC'}}></span>Convertibles</span></div>
                            </div>
                           
                        
                        </div>
                    </div>
        </div>
    );
}
