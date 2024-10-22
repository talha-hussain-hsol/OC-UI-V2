import { Button, Col, Container, Form, Row, Nav } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { BsArrowLeft, BsFillXCircleFill, BsRecord } from "react-icons/bs";

import DirectorIcon from './../../../../../icons/director-icon-small.svg';
import EntityIcon from './../../../../../icons/entity-icon-small.svg';
import IndividualIcon from './../../../../../icons/individual-icon-small.svg';
import SignatoryIcon from './../../../../../icons/signatory-icon-small.svg';

import './../organization-chart.scss';

export default function OrganizationChartAddNodePopup(props) {
    const [companyName, setCompanyName] = useState(props.name ?? '');
    const [ownership, setOwnership] = useState(`${props.ownership ?? ''}`);
    const [companyNameErr, setCompanyNameErr] = useState(false);
    const [ownershipErr, setOwnershipErr] = useState(false);
    const [organizationType, setOrganizationType] = useState(props.type ?? undefined);
    const [entityType, setEntityType] = useState(props.attributes?.entityType ?? '');
    const [entityTypeErr, setEntityTypeErr] = useState(false);
    const [regulatedType, setRegulatedType] = useState('regulated');

    const ownerShipErrorMessage = "Ownership must be less than or equal to 100 %"

    useEffect(() => {

    }, []);

    function onCompanyNameChange(e) {
        setCompanyName(e.target.value);
        setCompanyNameErr(false);
    }
    function onOwnershipChange(e) {
        const regx = /^[0-9\b]+$/;
        if (e.target.value === '' || regx.test(e.target.value)) {
            setOwnership(e.target.value);
            //setOwnershipErr(false);

            var value = parseInt(e.target.value)
            setOwnershipErr(value < 0 || value > 100)

        }
    }
    const handleOrganizationTypeChange = (event) => {
        console.log('handleOrganizationTypeChange ', event.target.value);
        setOrganizationType(event.target.value);
    }
    const handleRegulatedTypeChange = (event) => {
        console.log('handleRegulatedTypeChange ', event.target.value);
        setRegulatedType(event.target.value);
    }
    const handleEntityTypeChange = (event) => {
        console.log('handleEntityTypeChange ', event.target.value);
        setEntityType(event.target.value);
        setEntityTypeErr(event.target.value && event.target.value.length == 0);
    }
    const onBackButtonClicked = () => {
        setOrganizationType(undefined);
        setOwnershipErr(false);
        setCompanyNameErr(false);
    }

    const addOrginization = async () => {
        console.log('addOrginization called', organizationType);
        if (organizationType === "individual") {

            if (!companyName || companyName == '' || companyName.length < 3) {
                setCompanyNameErr(true)
                return
            }

            var value = parseInt(ownership)
            if (!value || value < 0 || value > 100) {
                setOwnershipErr(true)
                return
            }

            console.log('addOrginization called for INDIVIDUAL', props.popupType);
            props.onAddUpdateOrganization(props.popupType, props.id, {
                name: companyName,
                ownership: parseInt(ownership),
                type: "individual",
                attributes: {}
            });
        } else if (organizationType === "entity") {
            console.log('addOrginization called for entity');

            if (!companyName || companyName == '' || companyName.length < 3) {
                setCompanyNameErr(true)
                return
            }

            var value = parseInt(ownership)
            if (!value || value < 0 || value > 100) {
                setOwnershipErr(true)
                return
            }

            if (!entityType || entityType == '' || entityType.length == 0) {
                setEntityTypeErr(true)
                return
            }

            props.onAddUpdateOrganization(props.popupType, props.id, {
                name: companyName,
                ownership: parseInt(ownership),
                type: "entity",
                attributes: { entityType: entityType, isRegulated: regulatedType === 'regulated' ? true : false }
            });
        }
        else if ((organizationType === "director" || organizationType === "AUTHORISED_PERSONNEL")) {

            if (!companyName || companyName == '' || companyName.length < 3) {
                setCompanyNameErr(true)
                return
            }

            props.onAddUpdateOrganization(props.popupType, props.id, {
                name: companyName,
                ownership: 0,
                type: organizationType,
                attributes: {}
            });
        }
        // else {
        //     if (companyName.length === 0) {
        //         setCompanyNameErr(true);
        //     }
        //     if (ownership.length === 0) {
        //         setOwnershipErr(true);
        //     }
        // }
    }

    function _nodeIcon() {
        if (props.node.type === 'individual') {
            return (<IndividualIcon className="nodeIcon" fontSize={'large'} color={'action'} />);
        } else if (props.node.type === 'director') {
            return (<DirectorIcon className="nodeIcon" fontSize={'large'} color={'action'} />);
        } else if (props.node.type === 'authorized-signatory') {
            return (<SignatoryIcon className="nodeIcon" fontSize={'large'} color={'action'} />);
        } else {
            return (<EntityIcon className="nodeIcon" fontSize={'large'} color={'action'} />);
        }
    }

    function _renderOrganizationOptions() {
        return (
            !organizationType && <div className={"options"}>
                <Button
                    className={"optionItem"}
                    variant="text"
                    onClick={() => setOrganizationType("entity")}
                // startIcon={
                //     <span>
                //         <BsRecord fontSize={'small'} />
                //         <EntityIcon className={"optionItemIcon"} />
                //     </span>
                // }
                >
                    Entity
                </Button>
                <Button
                    className={"optionItem"}
                    variant="text"
                    onClick={() => setOrganizationType("individual")}
                // startIcon={
                //     <span>
                //         <BsRecord fontSize={'small'} />
                //         <IndividualIcon className={"optionItemIcon"} />
                //     </span>
                // }
                >
                    Individual
                </Button>
                <Button
                    className={"optionItem"}
                    variant="text"
                    onClick={() => setOrganizationType("director")}
                // startIcon={
                //     <span>
                //         <BsRecord fontSize={'small'} />
                //         <DirectorIcon className={"optionItemIcon"} />
                //     </span>
                // }
                >
                    Director
                </Button>
                <Button
                    className={"optionItem"}
                    variant="text"
                    onClick={() => setOrganizationType("AUTHORISED_PERSONNEL")}
                // startIcon={
                //     <span>
                //         <BsRecord fontSize={'small'} />
                //         <SignatoryIcon className={"optionItemIcon"} />
                //     </span>
                // }
                >
                    Authorized Signatory
                </Button>
            </div>
        )
    }
    function _renderOrgEntity() {
        if (organizationType === "entity") {
            return (
              <div>
                <div className={'row'}>
                  <input
                    value={companyName}
                    className={'input'}
                    //style={{ marginRight: '0px' }}
                    label="Name"
                    variant="outlined"
                    required={true}
                    onChange={onCompanyNameChange}
                    error={companyNameErr}
                    helperText={companyNameErr ? 'Required' : undefined}
                    color={'secondary'}
                  />
                </div>
                <div className={'row'}>
                  <input
                    value={ownership}
                    className={'input'}
                    style={{ marginRight: '0px' }}
                    label="Ownership %"
                    placeholder="100"
                    required={true}
                    variant="outlined"
                    error={ownershipErr}
                    onChange={onOwnershipChange}
                    helperText={
                      ownershipErr ? ownerShipErrorMessage : undefined
                    }
                    color={'secondary'}
                  />

                  {/* <FormControl variant="outlined" className={"textField2} color={'secondary'} required error={residenceErr}>
                                            <InputLabel id="title-label">Country Of Residence</InputLabel>
                                            <Select
                                                required
                                                labelId="residence-label"
                                                id="residence"
                                                value={residenceInput}
                                                onChange={handleResidenceInput}
                                                label="Country Of Residence">

                                                <MenuItem disabled value={0} selected> -- select an option -- </MenuItem>


                                                {countriesMenuItems}

                                            </Select>

                                            <FormHelperText>{residenceErr ? errMsgRequired : hlpMsgAsPerGovId}</FormHelperText>
                                        </FormControl> */}
                </div>

                <div className={'row'}>
                  <Form>
                    <Form.Group
                      variant="outlined"
                      required
                      className={'entityTypeContainer'}
                    >
                      <Form.Label
                        className={'entityTypeLabel'}
                        required={true}
                        error={entityTypeErr}
                      >
                        Entity Type
                      </Form.Label>
                      {console.log(entityType, 'entityTypeabc')}
                      <select
                        required
                        labelId="title-label"
                        id="title"
                        value={entityType}
                        error={entityTypeErr}
                        onChange={handleEntityTypeChange}
                        label="Entity Type"
                      >
                        {Object.keys(entityType).map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      {/* <FormHelperText>{titleErr ? errMsgRequired : ''}</FormHelperText> */}
                    </Form.Group>
                  </Form>
                </div>

                <div className={'row'}>
                  <Form>
                    <Form.Group
                      component="fieldset"
                      value={regulatedType}
                      onChange={handleRegulatedTypeChange}
                    >
                      {/* <FormLabel className={"orgTypeLabel}>Regulated Type</FormLabel> */}
                      <Form.Check
                        type={'radio'}
                        id="Regulated"
                        label="Regulated"
                        value="regulated"
                      />
                      <Form.Check
                        type={'radio'}
                        id="Non Regulated"
                        label="Non Regulated"
                        value="non-regulated"
                      />
                    </Form.Group>
                  </Form>
                </div>
              </div>
            );
        }
    }
    function _renderOrgINDIVIDUAL() {
        if (organizationType === "individual") {
            return (
              <div>
                <div className={"row"}>
                  <input
                    value={companyName}
                    className={"input"}
                    style={{ marginRight: "0px" }}
                    label="Name"
                    variant="outlined"
                    onChange={onCompanyNameChange}
                    required={true}
                    error={companyNameErr}
                    helperText={companyNameErr ? "Required" : undefined}
                    color={"secondary"}
                  />
                </div>
                <div className={"row"}>
                  <input
                    value={ownership}
                    className={"input"}
                    label="Ownership %"
                    placeholder="100"
                    variant="outlined"
                    required={true}
                    error={ownershipErr}
                    onChange={onOwnershipChange}
                    helperText={
                      ownershipErr ? ownerShipErrorMessage : undefined
                    }
                    color={"secondary"}
                  />
                </div>
              </div>
            )
        }
    }
    function _renderOrgDirector() {
        if (organizationType === 'director' || organizationType === "AUTHORISED_PERSONNEL") {
            return (
                <div>
                    <div className={"row"}>
                        <input value={companyName}
                            className={"input"}
                            //style={{ marginRight: '0px' }}
                            label="Name"
                            variant="outlined"
                            required={true}
                            onChange={onCompanyNameChange}
                            error={companyNameErr}
                            helperText={companyNameErr ? 'Required' : undefined}
                            color={'secondary'} />
                    </div>
                </div>
            );
        }
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            addOrginization()
        }
    }


    return (
        <div>

            <div id="popup" className={"popupdModal"}>
                <div className={"panel"} onKeyPress={handleKeyPress}>
                    {/* <div className={"row}> */}
                    {/* {organizationType && <ArrowBackIcon className={"backButton} onClick={() => { onBackButtonClicked() }} />} */}
                    {/* <div className={"titlelabel}>{props.popupType === OrganizationChartAddNodePopupType.add ? 'Add ' : 'Update '} </div> */}
                    {/* </div> */}
                    <div className={"row"} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h3 className={"titlelabel"} variant="h5" color={'textPrimary'}>
                            {props.popupType === 1 ? "Add" : "Update"}
                        </h3>
                        <BsFillXCircleFill style={{ fill: 'white' }} color={'action'} fontSize={'small'} />
                    </div>

                    {organizationType && props.popupType === 1 &&
                        <BsArrowLeft onClick={onBackButtonClicked} className={"back"} color={'action'} fontSize={'small'} />

                    }

                    {_renderOrganizationOptions()}
                    {_renderOrgEntity()}
                    {_renderOrgINDIVIDUAL()}
                    {_renderOrgDirector()}

                    <div className={"row"}>
                        {organizationType && <Button variant={'contained'} color={'secondary'} className={"button"} onClick={() => { addOrginization() }}>{props.popupType === 1 ? "Add" : "Update"}</Button>}
                        <button className={"button"} onClick={() => { props.onExit() }}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
