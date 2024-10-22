import className from 'classnames';
import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom'
import React, { useMemo } from 'react';
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
  Nav
} from 'react-bootstrap';
import { useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';
import { Avatar } from '../../../../components';
import { IndeterminateCheckbox, Select } from '../../../../components/vendor';
import { getStatusColor } from '../../../../helpers';
import { contacts } from '../../../../data';
import TableComponent from '../../../shared-components/table-components';
import { Header } from '../../../../components';

export default function OrganizationInvestors({ ...props }) {
  const data = useMemo(() => contacts, []);

  const pagesOptions = [
    { value: 5, label: '5 per page' },
    { value: 10, label: '10 per page' },
    { value: -1, label: 'All' },
  ];

  const titleOptions = [
    { value: '*', label: 'Any' },
    { value: 'designer', label: 'Designer' },
    { value: 'developer', label: 'Developer' },
    { value: 'owner', label: 'Owner' },
    { value: 'founder', label: 'Founder' },
  ];

  const leadScoreOptions = [
    { value: '-1', label: 'Any' },
    { value: '1', label: '1+' },
    { value: '2', label: '2+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' },
    { value: '5', label: '5+' },
    { value: '6', label: '6+' },
    { value: '7', label: '7+' },
    { value: '8', label: '8+' },
    { value: '9', label: '9+' },
    { value: '10', label: '10' },
  ];

  const columns = useMemo(
    () => [
      {
        id: 'selection',
        Header: ({ getToggleAllRowsSelectedProps }) => (
          <div>
            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
          </div>
        ),
        Cell: ({ row }) => (
          <div>
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          </div>
        ),
      },
      {
        Header: 'Name',
        accessor: 'title',
        Cell: (props) => (
          <>
            <Avatar size="xs" className="me-2">
              <Avatar.Image src={props.cell.row.original.imgSrc} alt={props.value} className="rounded-circle" />
            </Avatar>
            <Link to="/profile-posts">
              <a className="text-reset">{props.value}</a>
            </Link>
          </>
        ),
      },
      {
        Header: 'Job title',
        accessor: 'position',
      },
      {
        Header: 'Email',
        accessor: 'email',
        Cell: ({ value }) => (
          <a className="text-reset" href={`mailto:${value}`}>
            {value}
          </a>
        ),
      },
      {
        Header: 'Phone',
        accessor: 'phone',
        Cell: ({ value }) => (
          <a className="text-reset" href={`tel:${value}`}>
            {value}
          </a>
        ),
      },
      {
        Header: 'Lead score',
        accessor: 'score',
        Cell: ({ value }) => <Badge bg={`soft-${getStatusColor(value)}`}>{`${value}/10`}</Badge>,
      },
      {
        Header: 'Company',
        accessor: 'company',
      },
      {
        id: 'actions',
        disableSortBy: true,
        Cell: () => (
          <Dropdown align="end">
            <Dropdown.Toggle as="span" className="dropdown-ellipses" role="button">
              <FeatherIcon icon="more-vertical" size="17" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#!">Action</Dropdown.Item>
              <Dropdown.Item href="#!">Another action</Dropdown.Item>
              <Dropdown.Item href="#!">Something else here</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ),
      },
    ],
    []
  );


  function headerButtonCallBack() {

  }
  function pageNumberChangedCallback() {

  }
  return (
    <>
      <div className="main-content">
       
          <Header {...props}>
            <Header.Body>
              <Row className="align-items-center">
                <Col>
                  <Header.Tabs className="nav-overflow">
                    <Nav.Item>
                      <Nav.Link className="text-nowrap" role="button" active>
                        All contacts{' '}
                        <Badge bg="secondary-soft" className="rounded-pill">
                          823
                        </Badge>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link className="text-nowrap" role="button">
                        Your contacts{' '}
                        <Badge bg="secondary-soft" className="rounded-pill">
                          231
                        </Badge>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link className="text-nowrap" role="button">
                        Deleted{' '}
                        <Badge bg="secondary-soft" className="rounded-pill">
                          22
                        </Badge>
                      </Nav.Link>
                    </Nav.Item>
                  </Header.Tabs>
                </Col>
              </Row>
            </Header.Body>
          </Header>
          <Row className="justify-content-center">
            <Col xs={12}>
              {contacts?.length > 0 ?
                <TableComponent pagination={true} columns={columns} allData={contacts} pageNumberChangedCallback={pageNumberChangedCallback} />
                : null
              }
            </Col>
          </Row>
        
      </div>


    </>
  );
}
