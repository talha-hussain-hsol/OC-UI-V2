import React, { useState } from 'react';
import { Card, Form } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart } from '../components/vendor';

import {data as performanceHistory} from '../pages/investor-portal/dashboard/components/data';

export default function AnalyticsConversions({ ...props }) {
  const [hidden, setHidden] = useState(true);
  const [data, setData] = useState(performanceHistory?.performance_history);
  const labels = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
  ];


  const datasets = [
    {
      label: '2021',
      data: [45, 23, 60, 30, 17, 80],
    },
    {
      label: '2022',
      data: [45, 23, 60, 30, 17, 80],
    },
    {
      label: '2023',
      data: [45, 23, 60, 30, 17, 80],
    },
    {
      label: '2024',
      data: [45, 23, 60, 30, 17, 80],
    },
  ];
  const options = {
    scales: {
      y: {
        ticks: {
          beginAtZero: true,
          callback: function (val) {
            if (val === 0) {
              return '0%';
            } else {
              return `${val}%`;
            }
          },
        },
      },
      xAxes: [{ barPercentage: 0.5 }],
    },
  };

  // <Bar data={{ labels: labels, datasets: datasets }} options={options} />

  return (
    <Card {...props}>
      <Card.Header>
        <h4 className="card-header-title text-uppercase">
          Performance History
        </h4>
      </Card.Header>
      <Card.Body>
        <Chart>
          <Bar
            data={{ labels: data?.labels, datasets: data?.datasets }}
            options={options}
          />
        </Chart>
      </Card.Body>
    </Card>
  );
}
