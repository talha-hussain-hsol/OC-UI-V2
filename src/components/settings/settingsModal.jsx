import React, { useMemo, useState, useEffect } from "react";
import { Col, Row, Container, Button, Spinner, Modal } from "react-bootstrap";
import axios from "axios";
import {
  getCountryListSettings,
  updateCountryListSettings,
} from "../../api/network/administrationApi/administrationAPI";
import { useParams } from "react-router-dom";
// import LoadingSpinner from "../../widgets/bootstrap-component/Spinner";
import Loader from "../ui/loader";
import TableComponent from "../../pages/shared-components/table-components";

// import CustomAlert from "../../widgets/bootstrap-component/Alert";

const restrictedList = [
  {
    name: "List 1",
    business_units: [{ name: "Business Unit A" }, { name: "Business Unit B" }],
    customers_count: 100,
    created_at: "2023-01-15T10:30:00",
    updated_at: "2023-03-20T15:45:00",
  },
  {
    name: "List 2",
    business_units: [{ name: "Business Unit C" }],
    customers_count: 50,
    created_at: "2023-02-05T14:20:00",
    updated_at: "2023-04-10T09:15:00",
  },
  {
    name: "List 2",
    business_units: [{ name: "Business Unit C" }],
    customers_count: 50,
    created_at: "2023-02-05T14:20:00",
    updated_at: "2023-04-10T09:15:00",
  },
  {
    name: "List 2",
    business_units: [{ name: "Business Unit C" }],
    customers_count: 50,
    created_at: "2023-02-05T14:20:00",
    updated_at: "2023-04-10T09:15:00",
  },
  {
    name: "List 2",
    business_units: [{ name: "Business Unit C" }],
    customers_count: 50,
    created_at: "2023-02-05T14:20:00",
    updated_at: "2023-04-10T09:15:00",
  },
  {
    name: "List 2",
    business_units: [{ name: "Business Unit C" }],
    customers_count: 50,
    created_at: "2023-02-05T14:20:00",
    updated_at: "2023-04-10T09:15:00",
  },
  {
    name: "List 2",
    business_units: [{ name: "Business Unit C" }],
    customers_count: 50,
    created_at: "2023-02-05T14:20:00",
    updated_at: "2023-04-10T09:15:00",
  },
  {
    name: "List 2",
    business_units: [{ name: "Business Unit C" }],
    customers_count: 50,
    created_at: "2023-02-05T14:20:00",
    updated_at: "2023-04-10T09:15:00",
  },
  {
    name: "List 2",
    business_units: [{ name: "Business Unit C" }],
    customers_count: 50,
    created_at: "2023-02-05T14:20:00",
    updated_at: "2023-04-10T09:15:00",
  },
  {
    name: "List 2",
    business_units: [{ name: "Business Unit C" }],
    customers_count: 50,
    created_at: "2023-02-05T14:20:00",
    updated_at: "2023-04-10T09:15:00",
  },
  {
    name: "List 2",
    business_units: [{ name: "Business Unit C" }],
    customers_count: 50,
    created_at: "2023-02-05T14:20:00",
    updated_at: "2023-04-10T09:15:00",
  },
  {
    name: "List 2",
    business_units: [{ name: "Business Unit C" }],
    customers_count: 50,
    created_at: "2023-02-05T14:20:00",
    updated_at: "2023-04-10T09:15:00",
  },
  {
    name: "List 2",
    business_units: [{ name: "Business Unit C" }],
    customers_count: 50,
    created_at: "2023-02-05T14:20:00",
    updated_at: "2023-04-10T09:15:00",
  },
  {
    name: "List 2",
    business_units: [{ name: "Business Unit C" }],
    customers_count: 50,
    created_at: "2023-02-05T14:20:00",
    updated_at: "2023-04-10T09:15:00",
  },
  {
    name: "List 2",
    business_units: [{ name: "Business Unit C" }],
    customers_count: 50,
    created_at: "2023-02-05T14:20:00",
    updated_at: "2023-04-10T09:15:00",
  },
  {
    name: "List 2",
    business_units: [{ name: "Business Unit C" }],
    customers_count: 50,
    created_at: "2023-02-05T14:20:00",
    updated_at: "2023-04-10T09:15:00",
  },
  {
    name: "List 2",
    business_units: [{ name: "Business Unit C" }],
    customers_count: 50,
    created_at: "2023-02-05T14:20:00",
    updated_at: "2023-04-10T09:15:00",
  },
  {
    name: "List 2",
    business_units: [{ name: "Business Unit C" }],
    customers_count: 50,
    created_at: "2023-02-05T14:20:00",
    updated_at: "2023-04-10T09:15:00",
  },
  {
    name: "List 2",
    business_units: [{ name: "Business Unit C" }],
    customers_count: 50,
    created_at: "2023-02-05T14:20:00",
    updated_at: "2023-04-10T09:15:00",
  },
  {
    name: "List 2",
    business_units: [{ name: "Business Unit C" }],
    customers_count: 50,
    created_at: "2023-02-05T14:20:00",
    updated_at: "2023-04-10T09:15:00",
  },
  {
    name: "List 2",
    business_units: [{ name: "Business Unit C" }],
    customers_count: 50,
    created_at: "2023-02-05T14:20:00",
    updated_at: "2023-04-10T09:15:00",
  },
  {
    name: "List 2",
    business_units: [{ name: "Business Unit C" }],
    customers_count: 50,
    created_at: "2023-02-05T14:20:00",
    updated_at: "2023-04-10T09:15:00",
  },
  {
    name: "List 2",
    business_units: [{ name: "Business Unit C" }],
    customers_count: 50,
    created_at: "2023-02-05T14:20:00",
    updated_at: "2023-04-10T09:15:00",
  },
  {
    name: "List 2",
    business_units: [{ name: "Business Unit C" }],
    customers_count: 50,
    created_at: "2023-02-05T14:20:00",
    updated_at: "2023-04-10T09:15:00",
  },
  {
    name: "List 2",
    business_units: [{ name: "Business Unit C" }],
    customers_count: 50,
    created_at: "2023-02-05T14:20:00",
    updated_at: "2023-04-10T09:15:00",
  },
  {
    name: "List 2",
    business_units: [{ name: "Business Unit C" }],
    customers_count: 50,
    created_at: "2023-02-05T14:20:00",
    updated_at: "2023-04-10T09:15:00",
  },
];

const SettingsModal = ({ closeModal, openSettings }) => {
  const [isLoaderModal, setIsLoaderModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingRowIndex, setLoadingRowIndex] = useState(null);
  const [countryList, setCountryList] = useState([]);
  const [riskSelected, setRiskSelected] = useState({});

  const handleRiskChange = (newRisk, rowIndex) => {
    setRiskSelected((prev) => ({
      ...prev,
      [rowIndex]: newRisk,
    }));
  };

  const safeRiskSelected = riskSelected || {};
  const params = useParams();
  const cancelTokenSource = axios.CancelToken.source();
  const [alertProps, setAlertProps] = useState({
    variant: "",
    message: "",
    show: false,
    hideAuto: false,
  });
  const handleAlert = ({ variant, message, hideAuto }) => {
    setAlertProps({ variant, message, show: true, hideAuto });
  };
  const handleCloseAlert = () => {
    setAlertProps({ ...alertProps, show: false });
  };

  const pageNumberChangedCallback = (e) => {
    console.log(e, "pageNumberChangedCallback");
  };

  useEffect(() => {
    getCountryList();
  }, []);

  const handleScoreChange = (index, value, row) => {
    // debugger;
    console.log("countryList", countryList);
    console.log("countryList row", row);
    // Using the state update callback to ensure countryList is up to date
    setCountryList((prevCountryList) => {
      const updatedData = [...prevCountryList];
      updatedData[index].score = value;
      return updatedData;
    });
  };

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Code",
        accessor: "code",
        // Cell: ({ value }) => <p>{value[0].name}</p>,
      },
      {
        Header: "ISO Code",
        accessor: "iso_code",
      },
      {
        Header: "Risk",
        accessor: "risk",
        Cell: ({ value, row }) => {
          const riskOptions = ["Prohibited", "High", "Medium", "Low"];
          const selectedRisk = riskSelected[row.index] || value || "Low";

          const handleChange = (e) => {
            const newRisk = e.target.value;
            handleRiskChange(newRisk, row.index); // Update parent state
          };

          return (
            <select
              className="form-control"
              value={selectedRisk}
              onChange={handleChange}
              style={{ fontSize: "0.8125rem" }}
              // defaultValue={type}
            >
              <option value="">Select Type</option>

              {riskOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        },
      },
      {
        Header: "Score",
        accessor: "score",
        Cell: ({ row, index }) => (
          <input
            className="form-control"
            type="number"
            value={row.original.score}
            style={{
              color: "white",
              backgroundColor: "#002858",
              fontSize: "0.8125rem",
            }}
            onChange={(e) =>
              handleScoreChange(row.index, parseFloat(e.target.value), row)
            }
          />
        ),
      },

      {
        id: "actions",
        Cell: ({ row }) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              onClick={() => updateCountryList(row, row.index)}
              disabled={loadingRowIndex === row.index} // Disable button while loading
            >
              {loadingRowIndex === row.index ? "Updating..." : "Update"}
            </Button>
            {loadingRowIndex === row.index && (
              // <LoadingSpinner animation="border" variant="primary" style={{ marginLeft: "1rem" }}/>
              <Loader />
            )}
          </div>
        ),
      },
    ],
    [loadingRowIndex, riskSelected]
  );

  const getCountryList = async () => {
    setIsLoaderModal(true);
    const response = await getCountryListSettings(cancelTokenSource.token);
    if (response.success) {
      setIsLoaderModal(false);
      console.log("response", response);
      setCountryList(response?.data?.countryList);
    } else {
      setIsLoaderModal(false);
    }
  };

  const updateCountryList = async (row, rowIndex) => {
    setLoadingRowIndex(rowIndex); // Start loader for this specific row

    // await new Promise((resolve) => setTimeout(resolve, 1000)); // Optional delay

    console.warn(row, "row-data");
    const data = {
      id: row.original.id,
      score: row.original.score,
      risk: safeRiskSelected[row.index]
        ? safeRiskSelected[row.index]
        : row.original.risk,
    };

    try {
      const response = await updateCountryListSettings(
        data,
        cancelTokenSource.token
      );
      if (response.success) {
        setLoadingRowIndex(null); // Stop loader
        console.log("response", response);
        handleAlert({
          variant: "success",
          message: `${row.original.name} country score updated to ${
            row.original.score
          } & risk to ${safeRiskSelected[row.index]}`,
          show: true,
          hideAuto: true,
        });
      } else {
        setLoadingRowIndex(null); // Stop loader on error
        handleAlert({
          variant: "danger",
          message: response?.user_message,
          show: true,
          hideAuto: true,
        });
      }
    } catch (error) {
      setLoadingRowIndex(null); // Stop loader on exception
      console.error("Error updating country list:", error);
      handleAlert({
        variant: "danger",
        message: "An error occurred while updating the country list.",
        show: true,
        hideAuto: true,
      });
    }
  };

  return (
    <Modal
      size="xl"
      show={openSettings}
      onHide={closeModal}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <div>
            <h3>Country List</h3>
          </div>
        </Modal.Title>
      </Modal.Header>

      <>
        {" "}
        <Modal.Body className="show-grid">
          <Container>
            {isLoaderModal ? (
              // <LoadingSpinner height="10em" custom={true} />
              <Loader />
            ) : (
              <Row>
                <Col xs={12} md={12}>
                  <Row>
                    <TableComponent
                      searchableCountry={true}
                      pagination={true}
                      columns={columns}
                      allData={countryList}
                      pageNumberChangedCallback={pageNumberChangedCallback}
                    />
                  </Row>
                </Col>
              </Row>
            )}
          </Container>
          {/* {alertProps.show && (
            <CustomAlert top={true} handleCloseAlert={handleCloseAlert} message={alertProps.message} variant={alertProps.variant} show={alertProps.show} hideAuto={alertProps.hideAuto} onClose={() => setAlertProps({ ...alertProps, show: false })}>
              {alertProps.message}
            </CustomAlert>
          )} */}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={closeModal}>Close</Button>
        </Modal.Footer>
      </>
    </Modal>
  );
};

export default SettingsModal;
