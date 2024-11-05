import axios from "axios"
import React, { useEffect, useState } from "react"
import {
  Button,
  Col,
  Form,
  Modal,
  ModalBody,
  Row,
} from "react-bootstrap"
import "react-datepicker/dist/react-datepicker.css"
import { useParams } from "react-router-dom"
import { worldCheckAPI } from "../../../../../api/network/AdministrationApi/AdministrationApi"
import Countries from "../../../../../helpers/countries"

const FiltersModal = ({
  openFiltersModal,
  handleClose,
  selection,
  onAdvanceData,
}) => {
  const cancelTokenSource = axios.CancelToken.source()
  const params = useParams()
  const [selectedGender, setSelectedGender] = useState(null)
  const [dob, setDob] = useState(null)
  const [location, setLocation] = useState(null)
  const [pob, setPob] = useState(null)
  const [citizenship, setCitizenship] = useState(null)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [toggleNationalId, setToggleNationalId] = useState(false)
  const [togglePassport, setTogglePassport] = useState(false)
  const [issuedDate, setIssueDate] = useState(null)
  const [passportNationality, setPassportNationality] = useState(null)
  const [country, setCountry] = useState(null)
  const [idType, setIdType] = useState(null)
  const [idNumber, setIdNumber] = useState(null)
  const [docType, setDocType] = useState(null)
  const [expiryDate, setExpiryDate] = useState(null)
  const [identificationNumber, setIdentificationNumber] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [registeredCountry, setRegisteredCountry] = useState(null)
  const [issuerCountry, setIssuerCountry] = useState(null)
  const [corpIdType, setCorpIdType] = useState(null)
  const [corpIdNumber, setCorpIdNumber] = useState("")
  const [passportIssuingState, setPassportIssuingState] = useState(null)
  const [subDocType, setSubDocType] = useState(null)
  const [typeList, setTypeList] = useState([])
  const [passportFirstName, setPassportFirstName] = useState("")
  const [passportLastName, setPassportLastName] = useState("")
  const [validError, setValidError] = useState(false)
  useEffect(() => {
    submitFilters()
  }, [])

  const handleNationalId = () => {
    setSelectedDocument("NationalId")
    setToggleNationalId(true)
    setTogglePassport(false)
  }
  const handlePassport = () => {
    setSelectedDocument("PASSPORT")
    setTogglePassport(true)
    setToggleNationalId(false)
  }
  const buttonStyles = {
    width: "200px",
    borderRadius: "15px",
  }
  const inputStyles = {
    borderRadius: "15px",
    width: "50%",
  }
  function setCountryDocList(e) {
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

  //api
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
  const handleSubmit = () => {
    //debugger
    console.log("clicked")
    if (!isValidData()) {
      setValidError(true)
      return
    } else {
      setValidError(false)
    }
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

      // delete advanceData?.worldCheck["corporate"]
      // if (!selectedDocument) {
      //   delete advanceData?.worldCheck?.individual?.passport_check
      //   delete advanceData?.worldCheck?.individual["document_id_country"]
      //   delete advanceData?.worldCheck?.individual["document_id_type"]
      //   delete advanceData?.worldCheck?.individual["document_id"]
      // }
      // if (selectedDocument === "NationalId") {
      //   delete advanceData?.worldCheck?.individual["passport_check"]
      // }
      // if (selectedDocument === "PASSPORT") {
      //   delete advanceData?.worldCheck?.individual["document_id_country"]
      //   delete advanceData?.worldCheck?.individual["document_id_type"]
      //   delete advanceData?.worldCheck?.individual["document_id"]
      // }
    }
    if (selection === "CORPORATE") {
      delete advanceData?.worldCheck["individual"]
    }

    onAdvanceData(advanceData)
  }

  return (
    <>
      <Modal
        size="xl"
        show={openFiltersModal}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h3>Advance Filter</h3>
          </Modal.Title>
        </Modal.Header>
        {selection === "INDIVIDUAL" && (
          <Modal.Body>
            {validError && (
              <div>
                <h3 style={{ color: "red" }}>
                  Please Fill All Mendatory Fields
                </h3>
              </div>
            )}

            <div>
              <div>
                <h2>Gender</h2>
                <Row>
                  <Col>
                    <Button
                      style={buttonStyles}
                      size="lg"
                      variant={
                        selectedGender === "MALE" ? "success" : "primary"
                      }
                      rounded="true"
                      onClick={() => setSelectedGender("MALE")}
                    >
                      Male
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      style={buttonStyles}
                      size="lg"
                      variant={
                        selectedGender === "FEMALE" ? "success" : "primary"
                      }
                      rounded="true"
                      onClick={() => setSelectedGender("FEMALE")}
                    >
                      Female
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      style={buttonStyles}
                      size="lg"
                      variant={
                        selectedGender === "unspecified" ? "success" : "primary"
                      }
                      rounded="true"
                      onClick={() => setSelectedGender("unspecified")}
                    >
                      Unspecified
                    </Button>
                  </Col>
                </Row>
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
                            onChange={(date) => setDob(date.target.value)}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="column">
                        <h3>Country Location</h3>
                        <div className="col-sm-12">
                          <select
                            className="form-control"
                            onChange={(e) => {
                              setLocation(e.target.value)
                            }}
                          >
                            <option value="">Country Location</option>
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
                                <option value={item?.code}>{item?.key}</option>
                              ))}
                          </select>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="d-flex justify-content-evenly mt-4">
                  <Button
                    style={buttonStyles}
                    variant={
                      selectedDocument === "NationalId" ? "success" : "primary"
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
                      selectedDocument === "PASSPORT" ? "success" : "primary"
                    }
                    rounded="true"
                    onClick={() => {
                      handlePassport()
                    }}
                  >
                    Passport
                  </Button>
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
                                setPassportIssuingState(e.target.value)
                              }}
                            >
                              <option value="">Issuing State</option>
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
                                setPassportNationality(e.target.value)
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
                    <div className="mt-4">
                      <h2>Select Document Type*</h2>
                      <Row>
                        <Col>
                          <Button
                            style={buttonStyles}
                            size="lg"
                            variant={
                              subDocType === "PASSPORT" ? "success" : "primary"
                            }
                            rounded="true"
                            selected
                            onClick={() => setSubDocType("PASSPORT")}
                          >
                            Passport
                          </Button>
                        </Col>
                        <Col>
                          <Button
                            style={buttonStyles}
                            size="lg"
                            variant={
                              subDocType === "ID1" ? "success" : "primary"
                            }
                            rounded="true"
                            onClick={() => setSubDocType("ID1")}
                          >
                            ID-Card type 1(3 lines)
                          </Button>
                        </Col>
                        <Col>
                          <Button
                            style={buttonStyles}
                            size="lg"
                            variant={
                              subDocType === "ID2" ? "success" : "primary"
                            }
                            rounded="true"
                            onClick={() => setSubDocType("ID2")}
                          >
                            ID-Card type 2(2 lines)
                          </Button>
                        </Col>
                      </Row>
                    </div>
                    <div className="mt-4">
                      <Row>
                        <Col>
                          <h2>Identification Number*</h2>
                          <Form.Control
                            type="text"
                            placeholder="Identification Number"
                            value={identificationNumber}
                            onChange={(e) =>
                              setIdentificationNumber(e.target.value)
                            }
                          />
                        </Col>
                        <Col>
                          <h2>Date Of Expiry*</h2>
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
                          <h2>Issuers/Countries</h2>
                          <select
                            className="form-control"
                            onChange={(e) => {
                              setCountryDocList(e)
                            }}
                          >
                            <option value="">Countries</option>
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
                          <h2>ID Type</h2>
                          <select
                            className="form-control"
                            onChange={(e) => {
                              setIdType(e.target.value)
                            }}
                          >
                            <option value="">Id type</option>
                            {console.log(typeList, "typeList")}
                            {typeList &&
                              typeList.map((item) => (
                                <option value={item?.type}>{item?.name}</option>
                              ))}
                          </select>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <h2>Id Number</h2>
                      <Form.Control

                        type="text"
                        placeholder="Enter Id Number"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                      />
                    </Row>
                  </div>
                ) : null}
              </div>
              <div className=" d-flex justify-content-center mt-4">
                <Button
                  variant="success"
                  type="submit"
                  onClick={() => {
                    handleSubmit()
                  }}
                >
                  Submit Filters
                </Button>
              </div>
            </div>
          </Modal.Body>
        )}
        {selection === "CORPORATE" && (
          <Modal.Body>
            <div className="d-flex flex-column align-items-center">
              <div className="mt-3" style={inputStyles}>
                <h3>Registered Country</h3>
                <select
                  className="form-control"
                  xs={8}
                  placeholder="Enter Registered Country"
                  onChange={(e) => {
                    setRegisteredCountry(e.target.value)
                  }}
                >
                  <option value="">Enter Registered Country</option>
                  {Countries &&
                    Countries.map((item, index) => (
                      <option value={item?.code}>{item?.key}</option>
                    ))}
                </select>
              </div>
              <div className="mt-3" style={inputStyles}>
                <h3>Issuer/Country</h3>
                <select
                  className="form-control"
                  xs={8}
                  placeholder="Enter Issuer Country"
                  onChange={(e) => {
                    setCountryDocList(e)
                  }}
                >
                  <option value="">Select</option>
                  {Countries &&
                    Countries.map((item) => (
                      <option value={item?.iso_code_3}>{item?.key}</option>
                    ))}
                </select>
              </div>
              <div className="mt-3" style={inputStyles}>
                <h3>ID Type</h3>
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
                      <option value={item?.type}>{item?.name}</option>
                    ))}
                </select>
              </div>
              <div className="mt-3" style={inputStyles}>
                <h3>ID Number</h3>
                <Form.Control
                  type="number"
                  placeholder="Enter Id Number"
                  value={corpIdNumber}
                  onChange={(e) => setCorpIdNumber(e.target.value)}
                />
              </div>
              <div className="d-flex mt-3">
                <Button
                  variant="success"
                  type="submit"
                  onClick={() => {
                    handleSubmit()
                  }}
                >
                  Submit Filters
                </Button>
              </div>
            </div>
          </Modal.Body>
        )}
      </Modal>
    </>
  )
}

export default FiltersModal
