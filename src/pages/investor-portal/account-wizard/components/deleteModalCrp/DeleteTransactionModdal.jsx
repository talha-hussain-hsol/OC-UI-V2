import React, { useMemo, useState, useEffect } from "react";
import {
  Col,
  Row,
  Container,
  Button,
  Spinner,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
// import LoadingSpinner from "../../../../../widgets/bootstrap-component/Spinner"
import { deleteTransaction } from "../../../../../api/network/customerApi";

const DeleteTransactionModal = ({
  openDeleteModal,
  handleClose,
  selectedRow,
  getTransactionList,
  handleAlert,
  getuserDetail,
  account_id,
}) => {
  console.log("selectedRow", selectedRow);
  const [isLoaderModal, setIsLoaderModal] = useState(false);
  const params = useParams();
  const cancelTokenSource = axios.CancelToken.source();
  const handleClickContinue = async () => {
    setIsLoaderModal(true);
    const response = await deleteTransaction(
      account_id,
      selectedRow.id,
      cancelTokenSource.token
    );
    console.log("response", response);
    if (response.success == true) {
      setIsLoaderModal(false);
      getTransactionList();
      getuserDetail();
      handleAlert({
        variant: "success",
        message: "Transaction Deleted Successfully",
        show: true,
        hideAuto: true,
      });

      handleClose();
    } else {
      handleClose();
      handleAlert({
        variant: "danger",
        message: "Transaction not Deleted",
        show: true,
        hideAuto: true,
      });

      setIsLoaderModal(false);
    }
  };

  return (
    <>
      <Modal
        size="md"
        show={openDeleteModal}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <div>
              <h3>Delete Account</h3>
            </div>
          </Modal.Title>
        </Modal.Header>

        <>
          {" "}
          <Modal.Body className="show-grid">
            <Container>
              {isLoaderModal ? (
                // <LoadingSpinner height="10em" custom={true} />
                <></>
              ) : (
                <Row>
                  <Col xs={12} md={12}>
                    <Row>
                      <Col xs={12} md={12}>
                        <h3>
                          To confirm deletion of this Transaction, click
                          'Proceed'. To cancel, click 'Cancel'.
                        </h3>
                      </Col>
                    </Row>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        marginTop: "1em",
                      }}
                    >
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Button
                          onClick={handleClickContinue}
                          variant="success"
                          size="lg"
                        >
                          Proceed
                        </Button>
                      </div>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Button
                          onClick={handleClose}
                          variant="danger"
                          size="lg"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              )}
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </>
      </Modal>
    </>
  );
};

export default DeleteTransactionModal;
