import React, { useState } from 'react';
import { Card, Nav } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart } from '../components/vendor';

export default function AnalyticsSales() {
  const [index, setIndex] = useState(0);

  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const datasets = [
    {
      data: [245, 230, 340, 262, 177, 103, 128, 266, 248, 256, 270, 382],
    },
    {
      data: [7, 40, 12, 27, 34, 17, 19, 30, 28, 32, 24],
    },
    {
      data: [2, 12, 35, 25, 36, 25, 34, 16, 4, 14, 15],
    },
  ];

  const options = {
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            return `$${Math.floor(value / 10) + 1}`;
          },
        },
      },
    },
  };

  return (
    <Card>
      <Card.Header>
        <h4 className="card-header-title">Price Chart</h4>
      </Card.Header>
      <Card.Body>
        <Chart>
          <Line
            data={{ labels: labels, datasets: [{ ...datasets[index] }] }}
            options={options}
          />
        </Chart>
        <div style={{ display: 'flex', justifyContent: 'center' }}>2023</div>
      </Card.Body>
    </Card>
  );
}
