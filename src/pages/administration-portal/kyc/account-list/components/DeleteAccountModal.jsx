import React, { useMemo, useState, useEffect } from "react"
import {
  Col,
  Row,
  Container,
  Pagination,
  Card,
  OverlayTrigger,
  ProgressBar,
  Button,
  Spinner,
  Modal,
} from "react-bootstrap"
import axios from "axios"
import { deleteEntityAccount } from "../../../../../api/network/AdministrationApi/AdministrationApi"
import { Link, useParams } from "react-router-dom"
// import LoadingSpinner from "../../../../../widgets/bootstrap-component/Spinner"
import Loader from "../../../../../components/ui/loader"

const DeleteAccountModal = ({
  openDeleteModal,
  handleClose,
  selectedRow,
  getList,
  handleAlert,
}) => {
  console.log("selectedRow", selectedRow)
  const [isLoaderModal, setIsLoaderModal] = useState(false)
  const params = useParams()
  const cancelTokenSource = axios.CancelToken.source()
  const handleClickContinue = async () => {
    setIsLoaderModal(true)
    const response = await deleteEntityAccount(
      selectedRow?.id,
      cancelTokenSource.token
    )
    console.log("response", response)
    if (response.success == true) {
      setIsLoaderModal(false)
      getList()
      handleAlert({
        variant: "success",
        message: "Document Deleted Successfully",
        show: true,
        hideAuto: true,
      })

      handleClose()
    } else {
      handleClose()
      handleAlert({
        variant: "danger",
        message: "Document not Deleted",
        show: true,
        hideAuto: true,
      })

      setIsLoaderModal(false)
    }
  }

  const getFullName = (data) => {
    if (data?.type == "CORPORATE") {
      if (data?.meta?.data) {
        if (data?.meta?.data[data?.type.toLowerCase() + ".basic.name"]?.value) {
          return data?.meta?.data[data?.type.toLowerCase() + ".basic.name"]
            ?.value
        }
      } else {
        return ""
      }
    }
    let first_name = ""
    let middle_name = ""
    let last_name = ""
    if (
      data?.meta?.data[data?.type.toLowerCase() + ".basic.first_name"]?.value
    ) {
      first_name =
        data?.meta?.data[data?.type.toLowerCase() + ".basic.first_name"]?.value
    }
    if (
      data?.meta?.data[data.type.toLowerCase() + ".basic.middle_name"]?.value
    ) {
      middle_name =
        data?.meta?.data[data?.type.toLowerCase() + ".basic.middle_name"]?.value
    }
    if (
      data?.meta?.data[data?.type.toLowerCase() + ".basic.last_name"]?.value
    ) {
      last_name =
        data?.meta?.data[data?.type.toLowerCase() + ".basic.last_name"]?.value
    }
    let full_name = first_name + " " + middle_name + " " + last_name
    return full_name
  }

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
                <Loader height="10em" custom={true} />
              ) : (
                <Row>
                  <Col xs={12} md={12}>
                    <Row>
                      <Col xs={12} md={12}>
                        <h3>
                          To confirm deletion of this{" "}
                          {(() => {
                            if (
                              getFullName(
                                selectedRow?.accountHolders[0]?.identity
                              ).trim() !== ""
                            ) {
                              return getFullName(
                                selectedRow?.accountHolders[0]?.identity
                              )
                            } else {
                              return selectedRow?.accountHolders[0]?.identity
                                ?.label
                            }
                          })()}{" "}
                          account, click 'Proceed'. To cancel, click 'Cancel'.
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
  )
}

export default DeleteAccountModal
