import React, { useState } from 'react';
import { Card, Form } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart } from '../components/vendor';

import {data as navData} from '../pages/investor-portal/dashboard/components/data';
export default function AnalyticsConversions({ ...props }) {
  const [hidden, setHidden] = useState(true);
  const [data, setData] = useState(navData?.nav_history);

  const options = {
    scales: {
      y: {
        ticks: {
          beginAtZero: true,
          callback: function (val) {
            if (val === 0) {
              return '1M';
            } else {
              return `$${Math.floor(val / 10) + 1}M`;
            }
          },
        },
      },
    },
    barThickness: 20,
  };

  // <Bar data={{ labels: data?.labels, datasets: data?.datasets }} options={options} />

  return (
    <Card {...props}>
      <Card.Header>
        <h4 className="card-header-title text-uppercase">Nav History</h4>
      </Card.Header>
      <Card.Body>
        <Chart>
          <Bar
            data={{ labels: data?.labels, datasets: data?.datasets }}
            options={options}
          />
        </Chart>
        <div style={{ display: 'flex', justifyContent: 'center' }}>2023</div>
      </Card.Body>
    </Card>
  );
}
