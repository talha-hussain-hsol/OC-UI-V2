import { Col, Container, Row, Nav } from 'react-bootstrap';
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Header } from '../../../../../components';
import { Chart } from '../../../../../components/vendor';
export default function SubscriptionCapitalizationOverView({ ...props }) {

    return (
        <div className="main-content">
            <div className="card card-fill">
                <div className="card-body">
                    <small>Fully Diluted Shares</small><br />
                    23,234,234<br />
                    <small>Amount Raised</small><br />
                    $ 423,234,234.00

                </div>
            </div>
        </div>
    );
}
