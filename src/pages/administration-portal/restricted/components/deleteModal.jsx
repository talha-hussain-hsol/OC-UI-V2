import React, {  useState, useEffect } from "react";
import { Col, Row, Container, Button, Modal } from "react-bootstrap";
import axios from "axios";
import { deleteRestrictedList } from "../../../../api/network/AdministrationApi/AdministrationApi";
import { useParams } from "react-router-dom";
// import LoadingSpinner from "../../../../widgets/bootstrap-component/Spinner";

import Loader from '../../../../components/ui/loader/index'

const DeleteModal = ({ openDeleteModal, handleClose, selectedRow, getList, handleAlert }) => {
    console.log('selectedRow',selectedRow)
  const [isLoaderModal, setIsLoaderModal] = useState(false);
  const params = useParams();
  const cancelTokenSource = axios.CancelToken.source();
  const handleClickContinue = async () => {
    setIsLoaderModal(true);
    const response = await deleteRestrictedList(selectedRow?.id, cancelTokenSource.token);
    console.log("response", response);
    if (response.success == true) {
      setIsLoaderModal(false);
      getList();
      handleAlert({
        variant: "success",
        message: "List Deleted Successfully",
        show: true,
        hideAuto: true,
      });

      handleClose();
    } else {
      handleClose();
      handleAlert({
        variant: "danger",
        message: "List not Deleted",
        show: true,
        hideAuto: true,
      });

      setIsLoaderModal(false);
    }
  };

  return (
    <>
      <Modal size="md" show={openDeleteModal} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <div>
              <h3>Delete List</h3>
            </div>
          </Modal.Title>
        </Modal.Header>

        <>
          {" "}
          <Modal.Body className="show-grid">
            <Container>
              {isLoaderModal ? (
                <Loader height="10em" custom={true} />
              ) : (
                <Row>
                  <Col xs={12} md={12}>
                    <Row>
                      <Col xs={12} md={12}>
                        <h3>To confirm deletion of {selectedRow?.name} list, click 'Continue'. To cancel, click 'Cancel'.</h3>
                      </Col>
                    </Row>
                    <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", marginTop: "1em" }}>
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <Button onClick={handleClickContinue} variant="primary" size="lg">
                          Continue
                        </Button>
                      </div>
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <Button onClick={handleClose} variant="primary" size="lg">
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

export default DeleteModal;
