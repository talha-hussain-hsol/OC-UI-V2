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
import {
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table";
import { Avatar } from "../../../../components";
import { IndeterminateCheckbox, Select } from "../../../../components/vendor";
import { getStatusColor } from "../../../../helpers";
import { contacts } from "../../../../data";
import TableComponent from "../../../shared-components/table-components";
import { Header } from "../../../../components";
// import {DynamicHeader} from '../../widgets';
export default function OrganizationDashboard({ ...props }) {
  const data = useMemo(() => contacts, []);
  const [index, setIndex] = useState(0);
  const pagesOptions = [
    { value: 5, label: "5 per page" },
    { value: 10, label: "10 per page" },
    { value: -1, label: "All" },
  ];
  const labels = ["Direct", "Organic", "Referral"];
  const datasets = [
    {
      data: [60, 25, 15],
      backgroundColor: ["#2C7BE5", "#A6C5F7", "#D2DDEC"],
    },
    {
      data: [15, 45, 20],
      backgroundColor: ["#2C7BE5", "#A6C5F7", "#D2DDEC"],
    },
  ];
  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          afterLabel: function () {
            return "%";
          },
        },
      },
    },
  };
  const titleOptions = [
    { value: "*", label: "Any" },
    { value: "designer", label: "Designer" },
    { value: "developer", label: "Developer" },
    { value: "owner", label: "Owner" },
    { value: "founder", label: "Founder" },
  ];
  const leadScoreOptions = [
    { value: "-1", label: "Any" },
    { value: "1", label: "1+" },
    { value: "2", label: "2+" },
    { value: "3", label: "3+" },
    { value: "4", label: "4+" },
    { value: "5", label: "5+" },
    { value: "6", label: "6+" },
    { value: "7", label: "7+" },
    { value: "8", label: "8+" },
    { value: "9", label: "9+" },
    { value: "10", label: "10" },
  ];
  function headerButtonCallBack() {}
  function pageNumberChangedCallback() {}
  return (
    <>
      <div className="main-content">
        {/* <AnalyticsHeader /> */}
        <Container fluid>
          <Row>
            <Col xs={12} md={6} xl>
              <AnalyticsValue />
            </Col>
            <Col xs={12} md={6} xl>
              <AnalyticsTotalHours />
            </Col>
            <Col xs={12} md={6} xl>
              <AnalyticsExit />
            </Col>
            <Col xs={12} md={6} xl>
              <AnalyticsAverageTime />
            </Col>
          </Row>
          <Row>
            <Col xs={12} xl={8}>
              <AnalyticsConversions />
            </Col>
            <Col xs={12} xl={4}>
              <AnalyticsTrafficChannels />
            </Col>
          </Row>
          <Row>
            <Col xs={12} xl={4}>
              <AnalyticsProjects />
            </Col>
            <Col xs={12} xl={8}>
              <AnalyticsSales />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <AnalyticsGoals />
            </Col>
          </Row>
          <Row>
            <Col xs={12} xl={5}>
              <AnalyticsRecentActivity className="card-fill" />
            </Col>
            <Col xs={12} xl={7}>
              <AnalyticsScratchpadChecklist />
            </Col>
          </Row>
        </Container>
      </div>{" "}
    </>
  );
}