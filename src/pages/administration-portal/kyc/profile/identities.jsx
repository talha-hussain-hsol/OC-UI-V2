import {
    Button,
    Col,
    Container,
    Form,
    Row,
    Nav,
    Spinner,
    Dropdown,
  } from "react-bootstrap";
  import ProfileHeader from "../../../widgets/ProfileHeader";
  import React, { useEffect, useMemo, useState } from "react";
  import FeatherIcon from "feather-icons-react";
  import { useNavigate, useLocation } from "react-router-dom";
//   import NumberFormat from "react-number-format";
//   import { Avatar } from "../../../../components";
//   import { Flatpickr } from "../../../../components/vendor";
//   import { AccountHeader } from "../../../../widgets";
  import { getIdentityList } from "../../../../api/network/AdministrationApi/AdministrationApi";
  import axios from "axios";
  
  export default function identities() {
    const { state } = useLocation();
    const [profileListData, setProfileListData] = useState([]);
    const [isLoader, setIsLoader] = useState(false);
    const cancelTokenSource = axios.CancelToken.source();
    const navigate = useNavigate();
  
    useEffect(() => {
      handleGetIdentityList();
    }, []);
    useEffect(() => {
      console.log("profileListData", profileListData);
    }, [profileListData]);
  
    const handleGetIdentityList = async () => {
      console.log(`checking`);
      setIsLoader(true);
  
      const response = await getIdentityList(cancelTokenSource.token);
      console.log("object 1", response);
      if (response.success == true) {
        setIsLoader(false);
        setProfileListData(response?.data);
      } else {
        setIsLoader(false);
      }
    };
  
    const handleEditClick = (identityId, identityType) => {
      console.log("sdasdas", identityId);
      const data = { name: "John", age: 30 };
      navigate(
        `/profile/identity/${identityType.toLowerCase()}/particular/${identityId}`,
        {
          state: { data },
        }
      );
    };
    return (
      <div className="main-content">
        <Container fluid>
          <Row className="justify-content-center">
            <Col xs={12} lg={8} xl={8}>
              <ProfileHeader />
              <div className="table-responsive">
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
                  <table className="table table-sm table-nowrap card-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="list">
                      {profileListData.length > 0 ? (
                        profileListData.map((item, index) => {
                          return (
                            <tr key={index}>
                              {/* {item?.type == "INDIVIDUAL" ? <td>{`${item?.meta?.data?.basic["first_name"].value}`}</td> : <td>{`${item?.meta?.data?.basic["name"].value}`}</td>} */}
                              <td>{`${item?.label}`}</td>
  
                              <td>
                                {item?.type == "INDIVIDUAL" ||
                                item?.type == "CORPORATE"
                                  ? "Entity"
                                  : "Finance"}
                              </td>
                              <td>{item?.type}</td>
                              <td>{item?.status}</td>
                              <td>
                                <Dropdown>
                                  <Dropdown.Toggle
                                    id="dropdown-basic"
                                    align="end"
                                  >
                                    <FeatherIcon icon="more-vertical" size="17" />
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item
                                      onClick={() =>
                                        handleEditClick(item.id, item.type)
                                      }
                                    >
                                      Edit
                                    </Dropdown.Item>
                                    <Dropdown.Item>Delete</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <p>No Data</p>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
              <br />
              <br />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
  