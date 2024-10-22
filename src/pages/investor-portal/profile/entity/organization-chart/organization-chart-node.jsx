import { Button, Col, Container, Form, Row, Nav, Tooltip, Dropdown } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';

import DirectorIcon from './../../../../../icons/director-icon-small.svg';
import EntityIcon from './../../../../../icons/entity-icon-small.svg';
import IndividualIcon from './../../../../../icons/individual-icon-small.svg';
import SignatoryIcon from './../../../../../icons/signatory-icon-small.svg';
import FeatherIcon from 'feather-icons-react';
import '../organization-chart.scss';

var theme = localStorage.getItem('portal_theme')
export default function organizationChartNode({ ...props }) {
    useEffect(() => {
        console.log("organizationChartNode props", props);

    }, [props])

    function isLastNode() {
        if (props?.node?.type === "SHAREHOLDER" ||
            props?.node?.type === "AUTHORISED_PERSONNEL" ||
            props?.node?.type === "DIRECTOR" ||
            props?.node?.attributes?.entityType === 'trust') {
            return true;
        }
        return false;
    }
    function _renderOrgEntity() {
        if (props?.node?.type === "entity" || props?.node?.type === "SHAREHOLDER") {
            return (<div>
                <div className="row">
                    <h6>{props?.node?.entityType}</h6>
                    <h5>{props?.node?.name}</h5>
                </div>
                <div className="row">
                    <h6>OwnerShip</h6>
                    <h5>{`${props?.node?.ownership}%`}</h5>
                </div>

            </div>);
        }
    }
    function _renderOrgIndividual() {
        if (props?.node?.type === "individual") {
            return (<div>
                <div className="row">
                    <h6>Individual</h6>
                    <h5>{props?.node?.name}</h5>
                </div>
                <div className="row">
                    <h6>OwnerShip</h6>
                    <h5>{`${props?.node?.ownership}%`}</h5>
                </div>
            </div>);
        }
    }

    function _nodeIcon() {
        // return (<div className="nodeIcon">{props?.node?.type}</div>);
        if (props.node.type === "individual") {
            return (<IndividualIcon className={"nodeIcon"} fontSize={'large'} color={'action'} style={{ fill: (theme == "dark" || theme == undefined) ? "white" : "black" }} />);
        } else if (props.node.type === "director") {
            return (<DirectorIcon className={"nodeIcon"} fontSize={'large'} color={'action'} style={{ fill: (theme == "dark" || theme == undefined) ? "white" : "black" }} />);
        } else if (props.node.type === "AUTHORISED_PERSONNEL") {
            return (<SignatoryIcon className={"nodeIcon"} fontSize={'large'} color={'action'} style={{ fill: (theme == "dark" || theme == undefined) ? "white" : "black" }} />);
        } else {
            return (<EntityIcon className={"nodeIcon"} fontSize={'large'} color={'action'} style={{ fill: (theme == "dark" || theme == undefined) ? "white" : "black" }} />);
        }

    }

    function _renderOrgDirector() {
        if (props?.node?.type === "director" || props?.node?.type === "AUTHORISED_PERSONNEL") {
            return (<div>
                <div style={{ marginTop: '25px' }} className="row" >
                    <h6>{props?.node?.type === "director" ? 'Director' : props?.node?.type === "AUTHORISED_PERSONNEL" ? 'AUTHORISED PERSONNEL' : ''}</h6>
                    <h5 >{props?.node?.name}</h5>
                </div>

            </div>);
        }
    }

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        console.log('handleClick called');
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        console.log(props?.node)
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        console.log(props?.node?.attributes)
        setAnchorEl(null);
        props.onEditClicked && props.onEditClicked()
    };

    const handleDelete = () => {
        setAnchorEl(null);
        props.onCrossClicked && props.onCrossClicked()
    };

    function tooltipMessage() {
        return (props?.node?.attributes?.ownershipError) ?
            `Childs ownership must be sum up to 100. Currently it's ${props?.node?.attributes?.childOwnershipSum}` : ''
    }

    return (
        <div className={"container containerHover"}
            style={{ border: props.node.attributes.ownershipError && props.node.attributes?.entityType == "Corporate" ? '1px solid red' : '1px solid #009dff' }}
            onClick={() => { props.onNodeClicked && props.onNodeClicked() }}
        >

            {props?.node?.entityType == "Corporate" &&
                <div className="individualPlus">
                    <span className="plusSeparator" />
                    <Col xs="auto">
                        <Dropdown align="end">
                            <Dropdown.Toggle as="span" className="dropdown-ellipses" role="button">
                                <Button className="lift"><FeatherIcon
                                    icon="plus"
                                    size="1em"
                                /></Button>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href="javascript:void(0);" onClick={(event) => {
                                    event.stopPropagation();
                                    props.onPlusClicked && props.onPlusClicked(props?.node, "Individual")
                                }}>Individual</Dropdown.Item>
                                <Dropdown.Item href="javascript:void(0);" onClick={(event) => {
                                    event.stopPropagation();
                                    props.onPlusClicked && props.onPlusClicked(props?.node, "corporate")
                                }}>Corporate</Dropdown.Item>
                            </Dropdown.Menu>

                        </Dropdown>
                    </Col>

                </div>}


            {
                // <Tooltip title={tooltipMessage()} enterDelay={300} placement={'left'} arrow={true}>
                <div className="newChild">
                    <div className="nodeIconContainer">
                        {_nodeIcon()}
                    </div>

                    <span className="nodeSeparator"> </span>
                    <div className="nodeContent">


                        {true && <div className="panel" >
                            {_renderOrgEntity()}
                            {_renderOrgIndividual()}
                            {_renderOrgDirector()}

                            {!!props?.node?.attributes?.errorMessage && <div className="row">
                                <div className="errorMessage">{props?.node?.attributes?.errorMessage}</div>
                            </div>}

                        </div>}

                        <div>
                            {true && !props.node.attributes?.rootNode && <div className={"nodeClose"}>
                                <Dropdown align="end">
                                    <Dropdown.Toggle as="span" className="dropdown-ellipses" role="button">
                                        <Button className="lift"
                                            style={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
                                        ><FeatherIcon
                                                icon="more-vertical"
                                                size="1em"
                                                color="#2c7be5"
                                            /></Button>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item href="javascript:void(0);" onClick={handleEdit}>Edit</Dropdown.Item>
                                        {/* <Dropdown.Item href="javascript:void(0);" onClick={handleDelete}>Delete</Dropdown.Item> */}
                                    </Dropdown.Menu>

                                </Dropdown>

                            </div>}
                            {true && !props.node.attributes?.rootNode && <div className={"nodeInfo"}>
                                <Dropdown align="end">
                                    <Dropdown.Toggle as="span" className="dropdown-ellipses" role="button">
                                        <Button className="lift"
                                            style={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
                                        ><FeatherIcon
                                                icon="info"
                                                size="1em"
                                                color="#2c7be5"
                                            /></Button>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {props.node?.roles && props.node?.roles.map((item, index) => (
                                            <Dropdown.Item href="javascript:void(0);" >{item?.roleName}</Dropdown.Item>
                                        ))}

                                    </Dropdown.Menu>

                                </Dropdown>

                            </div>}
                        </div>


                    </div>
                </div>
                // </Tooltip>
            }







        </div >
    );
}
