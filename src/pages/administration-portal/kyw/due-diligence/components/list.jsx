import React, { useMemo, useState, useEffect } from 'react';
import {
    Col,
    Row,
    Container,
} from 'react-bootstrap';
import axios from "axios";
import { getDueDiligenceAPI } from "../../../../../api/network/AdministrationApi/AdministrationApi";
import { Link, useParams } from 'react-router-dom'
import KywDynamicHeader from '../../../../../widgets/KywDynamicHeader'
export default function DueDiligenceList({ ...props }) {
   
    const params = useParams();
    const cancelTokenSource = axios.CancelToken.source();
    const [dueDiligence, setDueDiligence] = useState([]);


    useEffect(function () {
        if (params?.fund_id) {
            getDueDiligence()
        }
    }, []);
    const getDueDiligence = async () => {
        const response = await getDueDiligenceAPI(params?.fund_id, cancelTokenSource.token);
        if (response.success == true) {
            // setDueDiligence(response?.data?.account_list?.rows)
        } else {
        }
    }
    const pageNumberChangedCallback = (e)=>{
        console.log(e,'pageNumberChangedCallback')
    }
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
    return (
        <>
            <div className="main-content">
                <Container fluid>
                    <Row className="justify-content-center">
                        <Col xs={12}>
                            <div class="card">
                                <KywDynamicHeader title={"Due Diligence"}/>
                                <Row className="justify-content-center">
                                    <Col xs={12}>
                                        {dueDiligence?.length > 0 ?
                                            <TableComponent pagination={true} columns={columns} allData={dueDiligence} pageNumberChangedCallback={pageNumberChangedCallback} />
                                            : null
                                        }
                                    </Col>
                                </Row>

                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>


        </>
    );
}
