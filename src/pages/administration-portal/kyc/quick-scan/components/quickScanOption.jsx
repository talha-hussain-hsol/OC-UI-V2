import React, { useMemo, useState, useEffect } from "react";
import { Col, Row, Container, Form, Spinner, Button } from "react-bootstrap"
import axios from "axios"
import { postQuickScanAPI } from "../../../../../api/network/AdministrationApi/AdministrationApi"
import { useParams } from "react-router-dom"
import Countries from "./../../../../../helpers/countries"
import FeatherIcon from "feather-icons-react"
import { worldCheckAPI } from "../../../../../api/network/AdministrationApi/AdministrationApi"

// import FiltersModal from "./filtersModal"
// import { set } from "date-fns"
export default function QuickScanOption({ ...props }) {
  console.log(Countries, "Countries")
  const params = useParams()
  const cancelTokenSource = axios.CancelToken.source()
  const [quickScanList, setQuickScanList] = useState(false)
  const [selection, setSelection] = useState("INDIVIDUAL")
  const [dowjones, setDowJones] = useState(false)
  const [internetSearch, setInternetSearch] = useState(false)
  const [factiva, setFactiva] = useState(false)
  const [restrictedList, setRestrictedList] = useState(false)
  const [name, setName] = useState("")
  const [nameError, setNameError] = useState(false)
  const [error, setError] = useState(false)
  const [isLoader, setIsLoader] = useState(false)
  const [advance, setAdvance] = useState(false)
  const [gender, setGender] = useState(null)
  const [dob, setDob] = useState(null)
  const [nationalityCode, setNationalityCode] = useState(null)
  const [filtersModal, setFilterModal] = useState(false)
  const [advanceData, setAdvanceData] = useState(null)
  const [filters, setFilters] = useState(false)
  const [location, setLocation] = useState(null)
  const [pob, setPob] = useState(null)
  const [citizenship, setCitizenship] = useState(null)
  const [selectedDocument, setSelectedDocument] = useState(null)

  // States for Advance Filters
  const [selectedGender, setSelectedGender] = useState(null)
  const [toggleNationalId, setToggleNationalId] = useState(false)
  const [togglePassport, setTogglePassport] = useState(false)
  const [passportFirstName, setPassportFirstName] = useState(null)
  const [passportLastName, setPassportLastName] = useState(null)
  const [passportIssuingState, setPassportIssuingState] = useState(null)
  const [passportNationality, setPassportNationality] = useState(null)
  const [subDocType, setSubDocType] = useState(null)
  const [identificationNumber, setIdentificationNumber] = useState(null)
  const [expiryDate, setExpiryDate] = useState(null)
  const [idType, setIdType] = useState(null)
  const [idNumber, setIdNumber] = useState(null)
  const [typeList, setTypeList] = useState(null)
  const [countryDocList, setCountryDocList] = useState(null)
  const [registeredCountry, setRegisteredCountry] = useState(null)
  const [issuerCountry, setIssuerCountry] = useState(null)
  const [corpIdType, setCorpIdType] = useState(null)
  const [corpIdNumber, setCorpIdNumber] = useState(null)

  const buttonStyles = {
    width: "130px",
    borderRadius: "15px",
  }
  const inputStyles = {
    borderRadius: "15px",
    width: "50%",
  }


  useEffect(() => {
    submitFilters()
  }, [])


  const handleCountryDocList = (e) => {
    setIssuerCountry(e.target.value)
    console.log(selection, "selection")
    let worldCheckCountryListLocal = localStorage.getItem("worldCheckData")
    if (worldCheckCountryListLocal) {
      worldCheckCountryListLocal = JSON.parse(worldCheckCountryListLocal)
    }
    console.log(worldCheckCountryListLocal, "worldCheckCountryListLocal")
    let filterTypeList = []
    let selectedType =
      selection === "INDIVIDUAL" ? "INDIVIDUAL" : "ORGANISATION"
    console.log(e.target.value, "e.target.value")
    // return
    worldCheckCountryListLocal.filter((obj) => {
      console.log(obj, "objfirst ")
      if (
        obj.country.code === e.target.value &&
        obj.entityTypes.includes(selectedType)
      ) {
        filterTypeList.push(obj)
        console.log(filterTypeList, "filterTypeList")
        //
      }
    })
    setTypeList(filterTypeList)
    // return filter
  }

  const submitFilters = async (data) => {
    // setIsLoader(true)
    const response = await worldCheckAPI(
      params?.fundId,
      cancelTokenSource.token
    )
    if (response.success == true) {
      localStorage.setItem(
        "worldCheckData",
        JSON.stringify(response.data?.identityDocumentLocationTypes)
      )
    }
  }

  const handleAdvanceFilters = () => {
    setFilters(!filters)
  }

  const handleClickSelection = (type) => {
    setSelection(type)
  }
  const handleNationalId = () => {
    if (selectedDocument === "NationalId") {
      setSelectedDocument(null)
      setToggleNationalId(false)
    } else {
      setSelectedDocument("NationalId")
      setToggleNationalId(true)
      setTogglePassport(false)
    }
  }

  const handlePassport = () => {
    if (selectedDocument === "PASSPORT") {
      setSelectedDocument(null)
      setTogglePassport(false)
    } else {
      setSelectedDocument("PASSPORT")
      setTogglePassport(true)
      setToggleNationalId(false)
    }
  }
  const handleSubmit = () => {
    // if (!isValidData()) {
    //   setValidError(true)
    //   return
    // } else {
    //   setValidError(false)
    // }
    const advanceData = {
      worldCheck: {
        individual: {
          dob: dob,
          genderKey: selectedGender,
          country_location: location,
          place_of_birth: pob,
          nationalityCode: citizenship,
          document_id_country: issuerCountry,
          document_id_type: idType,
          document_id: idNumber,
          passport_check: {
            passport_given_name: passportFirstName,
            passport_last_name: passportLastName,
            passport_gender: selectedGender,
            passport_issuing_state: passportIssuingState,
            passport_nationality: passportNationality,
            passport_dob: dob,
            passport_document_type: subDocType,
            passport_id_number: identificationNumber,
            passport_date_of_expiry: expiryDate,
          },
        },
        corporate: {
          incorporateCountryCode: registeredCountry,
          document_id_country: issuerCountry,
          document_id_type: corpIdType,
          document_id: corpIdNumber,
        },
      },
    }

    //case  individual
    if (selection === "INDIVIDUAL") {
      //del corp
      delete advanceData?.worldCheck["corporate"]
      // case !individual dob
      if (!advanceData?.worldCheck?.individual.dob) {
        //del dob
        delete advanceData?.worldCheck?.individual.dob
      }
      // case individual genderKey
      if (!advanceData?.worldCheck?.individual.genderKey) {
        // del genderKey
        delete advanceData?.worldCheck?.individual.genderKey
      }
      // case individual country_location
      if (!advanceData?.worldCheck?.individual.country_location) {
        // del country_location
        delete advanceData?.worldCheck?.individual.country_location
      }
      // case individual place_of_birth
      if (!advanceData?.worldCheck?.individual.place_of_birth) {
        //del place_of_birth
        delete advanceData?.worldCheck?.individual.place_of_birth
      }
      // case individual nationalityCode
      if (!advanceData?.worldCheck?.individual.nationalityCode) {
        // del individual nationalityCode
        delete advanceData?.worldCheck?.individual.nationalityCode
      }

      // case individual national id
      if (selectedDocument === "NationalId") {
        // del passport_check
        delete advanceData?.worldCheck?.individual["passport_check"]
      }
      // case individual passport
      if (selectedDocument === "PASSPORT") {
        // del national id
        delete advanceData?.worldCheck?.individual["document_id_country"]
        delete advanceData?.worldCheck?.individual["document_id_type"]
        delete advanceData?.worldCheck?.individual["document_id"]
      }
      if (!selectedDocument) {
        delete advanceData?.worldCheck?.individual["passport_check"]
        delete advanceData?.worldCheck?.individual["document_id_country"]
        delete advanceData?.worldCheck?.individual["document_id_type"]
        delete advanceData?.worldCheck?.individual["document_id"]
      }
    }
    if (selection === "CORPORATE") {
      delete advanceData?.worldCheck["individual"]
    }

    if (
      (dowjones || internetSearch || factiva || restrictedList) &&
      name != ""
    ) {
      let dataToSend = {
        name: name,
        internetSearchCheck: internetSearch,
        restrictedList: restrictedList,
        worldCheck: dowjones,
        dowJones: false,
        factiva: factiva,
        customerType: selection,
        advanced: advanceData,
      }

      SubmitQuickScan(dataToSend)
      setError(false)
      setNameError(false)
    } else {
      setError(true)
      setNameError(true)
    }
  }
  const isValidData = () => {
    if (selection === "INDIVIDUAL") {
      if (!selectedDocument) {
        return true
      }
      if (selectedDocument === "NationalId") {
        if (!issuerCountry && !idType && !idNumber) {
          return false
        } else {
          return true
        }
      }
      if (selectedDocument === "PASSPORT") {
        if (
          !passportFirstName &&
          !passportLastName &&
          !passportIssuingState &&
          !passportNationality &&
          !subDocType &&
          !identificationNumber &&
          !expiryDate
        ) {
          return false
        } else {
          return true
        }
      }
    }
    if (selection === "CORPORATE") {
      if (
        // !companyName &&
        !registeredCountry &&
        !issuerCountry &&
        !corpIdType &&
        !corpIdNumber
      ) {
        return false
      } else {
        return true
      }
    }
  }
  const SubmitQuickScan = async (data) => {
    setIsLoader(true)

    const response = await postQuickScanAPI(
      params?.fund_id,
      data,
      cancelTokenSource.token
    )
    setIsLoader(false)
    if (response.success == true) {
      props.handleRefresh()
    } else {
    }
  }

  return (
    <>
      <div className="main-content">
        <Container fluid>
          {/* {filtersModal && (
            <FiltersModal
              openFiltersModal={filtersModal}
              handleClose={handleCloseFilter}
              selection={selection}
              onAdvanceData={handleAdvanceData}
            />
          )} */}

          <Row className="justify-content-center">
            <Col xs={12} style={{ display: "flex", justifyContent: "center" }}>
              <div
                class="card center-align-quick-scan"
                style={{ width: "99%" }}
              >
                {isLoader ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "20rem",
                    }}
                  >
                    <Spinner animation="grow" />
                  </div>
                ) : (
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="individual-corporate-selection-container">
                        <button
                          className={
                            selection == "INDIVIDUAL"
                              ? "btn btn-primary btn-quick-scan-selection-individual active"
                              : "btn btn-primary btn-quick-scan-selection-individual"
                          }
                          onClick={() => {
                            handleClickSelection("INDIVIDUAL")
                          }}
                        >
                          Individual
                        </button>
                        <button
                          className={
                            selection == "CORPORATE"
                              ? "btn btn-primary btn-quick-scan-selection-corporate active"
                              : "btn btn-primary btn-quick-scan-selection-corporate"
                          }
                          onClick={(e) => {
                            handleClickSelection("CORPORATE")
                          }}
                        >
                          Corporate
                        </button>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {" "}
                      <small
                        style={{ textAlign: "center" }}
                        className="text-muted"
                      >
                        Quick Scan allows users to do an ad-hoc preliminary
                        screening based on the name of an individual or a
                        corporate.
                      </small>
                      <small
                        style={{ textAlign: "center" }}
                        className="text-muted"
                      >
                        Users will have the flexibility to include global
                        database coverage of Politically Exposed Persons (PEP),
                        Sanctions and Adverse Media as part of the search
                        criteria.
                      </small>
                    </div>
                    <div className="col-sm-6 mb-3 mt-5">
                      <Form.Check
                        className={"checkbox-field"}
                        type={"checkbox"}
                        label={"Sanction List"}
                        onChange={(e) => {
                          setDowJones(e.target.checked)
                        }}
                      />
                    </div>
                    <div className="col-sm-6 mb-3 flex-end  mt-5">
                      <Form.Check
                        className={"checkbox-field"}
                        type={"checkbox"}
                        label={"Adverse Media News"}
                        onChange={(e) => {
                          setInternetSearch(e.target.checked)
                        }}
                      />
                    </div>
                    {/* <div className="col-sm-6 mb-3">
                                        <Form.Check
                                            className={"checkbox-field"}
                                            type={"checkbox"}
                                            label={"Factiva"}
                                            onChange={(e) => { setFactiva(e.target.checked) }}
                                        />
                                    </div> */}
                    <div className="col-sm-6 mb-3">
                      <Form.Check
                        className={"checkbox-field"}
                        type={"checkbox"}
                        label={"Internal List"}
                        onChange={(e) => {
                          setRestrictedList(e.target.checked)
                        }}
                      />
                    </div>
                    {error ? (
                      <p className="error-fields">
                        Select at least one option to Continue
                      </p>
                    ) : (
                      <p className="error-fields" style={{ display: "none" }}>
                        Select at least one option to Continue
                      </p>
                    )}
                    <div className="col-sm-12 mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Name"
                        onChange={(e) => {
                          setName(e.target.value)
                        }}
                      />
                      {nameError ? (
                        <p className="error-fields">Enter Name to Continue</p>
                      ) : (
                        <p className="error-fields" style={{ display: "none" }}>
                          Enter Name to Continue
                        </p>
                      )}
                    </div>
                    <div className="col-sm-12 mb-3 d-flex justify-content-end">
                      <button
                        className="btn btn-primary"
                        onClick={handleAdvanceFilters}
                        disabled={!dowjones}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <FeatherIcon
                          icon="sliders"
                          size="15"
                          style={{ marginRight: "5px" }}
                        />
                        Advance Filters
                      </button>
                    </div>
                    {filters && dowjones && (
                      <>
                        {selection === "INDIVIDUAL" && (
                          <div>
                            <h2>GENDER</h2>
                            <div className="d-flex justify-content-start">
                              <div style={{ margin: "10px" }}>
                                <Form.Check
                                  type="radio"
                                  name="gender"
                                  label="Male"
                                  value="MALE"
                                  checked={selectedGender === "MALE"}
                                  onChange={() => setSelectedGender("MALE")}
                                />
                              </div>
                              <div style={{ margin: "10px" }}>
                                <Form.Check
                                  type="radio"
                                  name="gender"
                                  label="Female"
                                  value="FEMALE"
                                  checked={selectedGender === "FEMALE"}
                                  onChange={() => setSelectedGender("FEMALE")}
                                />
                              </div>
                              <div style={{ margin: "10px" }}>
                                <Form.Check
                                  type="radio"
                                  name="gender"
                                  label="Unspecified"
                                  value="unspecified"
                                  checked={selectedGender === "unspecified"}
                                  onChange={() =>
                                    setSelectedGender("unspecified")
                                  }
                                />
                              </div>
                            </div>
                            <div className="d-flex mt-4">
                              <Row>
                                <Col md={3}>
                                  <div className="column">
                                    <h3>Date of Birth</h3>
                                    <div>
                                      <Form.Control
                                        type="date"
                                        name="Issue Date*"
                                        placeholder="Due date"
                                        selected={dob}
                                        onChange={(date) =>
                                          setDob(date.target.value)
                                        }
                                      />
                                    </div>
                                  </div>
                                </Col>
                                <Col sm={6} md={3}>
                                  <div className="column">
                                    <h3>Country Location</h3>
                                    <div className="col-sm-12">
                                      <select
                                        className="form-control"
                                        onChange={(e) => {
                                          setLocation(e.target.value)
                                        }}
                                      >
                                        <option value="">
                                          Country Location
                                        </option>
                                        {Countries &&
                                          Countries.map((item) => (
                                            <option value={item?.iso_code_3}>
                                              {item?.key}
                                            </option>
                                          ))}
                                      </select>
                                    </div>
                                  </div>
                                </Col>
                                <Col md={3}>
                                  <div className="column">
                                    <h3>Place of Birth</h3>
                                    <div className="col-sm-12">
                                      <select
                                        className="form-control"
                                        onChange={(e) => {
                                          setPob(e.target.value)
                                        }}
                                      >
                                        <option value="">Place of Birth</option>
                                        {Countries &&
                                          Countries.map((item, index) => (
                                            <option value={item?.iso_code_3}>
                                              {item?.key}
                                            </option>
                                          ))}
                                      </select>
                                    </div>
                                  </div>
                                </Col>
                                <Col md={3}>
                                  <div className="column">
                                    <h3>Citizenship</h3>
                                    <div className="col-sm-12">
                                      <select
                                        className="form-control"
                                        onChange={(e) => {
                                          setCitizenship(e.target.value)
                                        }}
                                      >
                                        <option value="">Citizenship</option>
                                        {Countries &&
                                          Countries.map((item, index) => (
                                            <option value={item?.code}>
                                              {item?.key}
                                            </option>
                                          ))}
                                      </select>
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                            {/* <div className="d-flex justify-content-evenly mt-4">
                              <Button
                                style={buttonStyles}
                                variant={
                                  selectedDocument === "NationalId"
                                    ? "success"
                                    : "primary"
                                }
                                rounded="true"
                                onClick={() => {
                                  handleNationalId()
                                }}
                              >
                                National ID
                              </Button>

                              <Button
                                style={buttonStyles}
                                variant={
                                  selectedDocument === "PASSPORT"
                                    ? "success"
                                    : "primary"
                                }
                                rounded="true"
                                onClick={() => {
                                  handlePassport()
                                }}
                              >
                                Passport
                              </Button>
                            </div> */}
                            <div className="nationalId-nationalId-selection-container">
                              <button
                                className={
                                  selectedDocument === "NationalId"
                                    ? "btn btn-primary btn-quick-scan-selection-document-type-nationalId active"
                                    : "btn btn-primary btn-quick-scan-selection-document-type-nationalId"
                                }
                                onClick={() => {
                                  handleNationalId()
                                }}
                              >
                                NATIONAL ID
                              </button>
                              <button
                                className={
                                  selectedDocument == "PASSPORT"
                                    ? "btn btn-primary btn-quick-scan-selection-document-type-passport active"
                                    : "btn btn-primary btn-quick-scan-selection-document-type-passport"
                                }
                                onClick={() => {
                                  handlePassport()
                                }}
                              >
                                PASSPORT
                              </button>
                            </div>

                            {selectedDocument === "PASSPORT" ? (
                              <div>
                                <Row>
                                  <Col>
                                    <Form.Group controlId="input1">
                                      <Form.Label>Given Name*</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder="Enter Name"
                                        onChange={(e) => {
                                          setPassportFirstName(e.target.value)
                                        }}
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col>
                                    <Form.Group controlId="input2">
                                      <Form.Label>Last Name*</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder="Enter Last Name"
                                        onChange={(e) => {
                                          setPassportLastName(e.target.value)
                                        }}
                                      />
                                    </Form.Group>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col>
                                    <Form.Group controlId="input4">
                                      <Form.Label>Issuing State*</Form.Label>
                                      <div className="col-sm-12">
                                        <select
                                          className="form-control"
                                          onChange={(e) => {
                                            setPassportIssuingState(
                                              e.target.value
                                            )
                                          }}
                                        >
                                          <option value="">
                                            Issuing State
                                          </option>
                                          {Countries &&
                                            Countries.map((item) => (
                                              <option value={item?.iso_code_3}>
                                                {item?.key}
                                              </option>
                                            ))}
                                        </select>
                                      </div>
                                    </Form.Group>
                                  </Col>
                                  <Col>
                                    <Form.Group controlId="input4">
                                      <Form.Label>Nationality*</Form.Label>
                                      <div className="col-sm-12">
                                        <select
                                          className="form-control"
                                          onChange={(e) => {
                                            setPassportNationality(
                                              e.target.value
                                            )
                                          }}
                                        >
                                          <option value="">Nationality</option>
                                          {Countries &&
                                            Countries.map((item) => (
                                              <option value={item?.iso_code_3}>
                                                {item?.key}
                                              </option>
                                            ))}
                                        </select>
                                      </div>
                                    </Form.Group>
                                  </Col>
                                </Row>
                                <div className="col-sm-6">
                                  <Row>
                                    <Col>
                                      <Form.Group controlId="documentType">
                                        <Form.Label>
                                          SELECT DOCUMENT TYPE*
                                        </Form.Label>
                                        <Form.Control
                                          as="select"
                                          value={subDocType}
                                          onChange={(e) =>
                                            setSubDocType(e.target.value)
                                          }
                                        >
                                          <option value="PASSPORT">
                                            Passport
                                          </option>
                                          <option value="ID1">
                                            {" "}
                                            ID-Card type 1(3 lines)
                                          </option>
                                          <option value="OTHER">
                                            {" "}
                                            ID-Card type 2(2 lines)
                                          </option>
                                        </Form.Control>
                                      </Form.Group>
                                    </Col>

                                    {/* <Col>
                                      <Button
                                        style={buttonStyles}
                                        size="lg"
                                        variant={
                                          subDocType === "PASSPORT"
                                            ? "success"
                                            : "primary"
                                        }
                                        rounded="true"
                                        selected
                                        onClick={() =>
                                          setSubDocType("PASSPORT")
                                        }
                                      >
                                        Passport
                                      </Button>
                                    </Col>
                                    <Col>
                                      <Button
                                        className="w-25 rounded"
                                        size="lg"
                                        variant={
                                          subDocType === "ID1"
                                            ? "success"
                                            : "primary"
                                        }
                                        onClick={() => setSubDocType("ID1")}
                                      >
                                        ID-Card type 1(3 lines)
                                      </Button>
                                    </Col>
                                    <Col>
                                      <Button
                                        className="w-25 rounded"
                                        size="lg"
                                        variant={
                                          subDocType === "ID2"
                                            ? "success"
                                            : "primary"
                                        }
                                        onClick={() => setSubDocType("ID2")}
                                      >
                                        ID-Card type 2(2 lines)
                                      </Button>
                                    </Col> */}
                                  </Row>
                                </div>
                                <div className="mt-4">
                                  <Row>
                                    <Col>
                                    <Form.Label>IDENTIFICATION NUMBER*</Form.Label>
                                      
                                      <Form.Control
                                        type="text"
                                        placeholder="Identification Number"
                                        value={identificationNumber}
                                        onChange={(e) =>
                                          setIdentificationNumber(
                                            e.target.value
                                          )
                                        }
                                      />
                                    </Col>
                                    <Col>
                                    <Form.Label>DATE OF EXPIRY*</Form.Label>
                                      <Form.Control
                                        type="date"
                                        name="Expiry Date*"
                                        placeholder="dd/mm/yyyy"
                                        selected={expiryDate}
                                        onChange={(date) =>
                                          setExpiryDate(date.target.value)
                                        }
                                      />
                                    </Col>
                                  </Row>
                                </div>
                              </div>
                            ) : null}
                            {selectedDocument === "NationalId" ? (
                              <div className="mt-4">
                                <Row>
                                  <Col>
                                    <div className="col-sm-12">
                                    <Form.Label>ISSUERS/COUNTRIES</Form.Label>
                                   
                                      <select
                                        className="form-control"
                                        onChange={(e) => {
                                          handleCountryDocList(e)
                                        }}
                                      >
                                        <option value="">COUNTRIES</option>
                                        {Countries &&
                                          Countries.map((item) => (
                                            <option value={item?.iso_code_3}>
                                              {item?.key}
                                            </option>
                                          ))}
                                      </select>
                                    </div>
                                  </Col>
                                  <Col>
                                    <div className="col-sm-12">
                                    <Form.Label>ID TYPE</Form.Label>
                                      <select
                                        className="form-control"
                                        onChange={(e) => {
                                          setIdType(e.target.value)
                                        }}
                                      >
                                        <option value="">ID TYPE</option>
                                        {console.log(typeList, "typeList")}
                                        {typeList &&
                                          typeList.map((item) => (
                                            <option value={item?.type}>
                                              {item?.name}
                                            </option>
                                          ))}
                                      </select>
                                    </div>
                                  </Col>
                                </Row>
                                <Row className="mt-4 w-50">
                                <Form.Label>ID NUMBER</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter Id Number"
                                    value={idNumber}
                                    onChange={(e) =>
                                      setIdNumber(e.target.value)
                                    }
                                  />
                                </Row>
                              </div>
                            ) : null}
                          </div>
                        )}
                        {selection === "CORPORATE" && (
                          <>
                            <Row className="d-flex flex-row justify-content-center">
                              <Col className="mt-3" style={inputStyles}>
                              <Form.Label>Registered Country</Form.Label>
                                <select
                                  className="form-control"
                                  xs={8}
                                  placeholder="Enter Registered Country"
                                  onChange={(e) => {
                                    setRegisteredCountry(e.target.value)
                                  }}
                                >
                                  <option value="">
                                    Enter Registered Country
                                  </option>
                                  {Countries &&
                                    Countries.map((item, index) => (
                                      <option value={item?.code}>
                                        {item?.key}
                                      </option>
                                    ))}
                                </select>
                              </Col>
                              <Col className="mt-3" style={inputStyles}>
                              <Form.Label>Issuer/Country</Form.Label>
                                <select
                                  className="form-control"
                                  xs={8}
                                  placeholder="Enter Issuer Country"
                                  onChange={(e) => {
                                    handleCountryDocList(e)
                                  }}
                                >
                                  <option value="">Select</option>
                                  {Countries &&
                                    Countries.map((item) => (
                                      <option value={item?.iso_code_3}>
                                        {item?.key}
                                      </option>
                                    ))}
                                </select>
                              </Col>
                            </Row>
                            <Row className="d-flex flex-row justify-content-center">
                              <Col className="mt-3" style={inputStyles}>
                              <Form.Label>ID Type</Form.Label>
                                <select
                                  className="form-control"
                                  xs={8}
                                  placeholder="Enter Registered Country"
                                  onChange={(e) => {
                                    setCorpIdType(e.target.value)
                                  }}
                                >
                                  <option value="">Enter ID Type</option>
                                  {typeList &&
                                    typeList.map((item) => (
                                      <option value={item?.type}>
                                        {item?.name}
                                      </option>
                                    ))}
                                </select>
                              </Col>
                              <Col className="mt-3" style={inputStyles}>
                              <Form.Label>ID Number</Form.Label>
                                <Form.Control
                                  type="number"
                                  placeholder="Enter Id Number"
                                  value={corpIdNumber}
                                  onChange={(e) =>
                                    setCorpIdNumber(e.target.value)
                                  }
                                />
                              </Col>
                            </Row>
                          </>
                        )}
                      </>
                    )}

                    <div className="col-sm-12 mt-3">
                      <div className="btn-submit-container">
                        <button
                          className="btn btn-success"
                          onClick={(e) => {
                            handleSubmit(e)
                          }}
                        >
                          Quick Scan
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}
