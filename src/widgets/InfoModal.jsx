import React from "react"

function InfoModal() {
  return (
    <>
      <Modal
        size="md"
        // show={modalShowDelete}
        // onHide={handleCloseModal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <div>
              <h3>Delete Document</h3>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col xs={12} md={12}>
                <Row>
                  <Col xs={12} md={12}>
                    <h3>
                      To confirm deletion of {documentToDelete?.title} document,
                      click 'Continue'. To cancel, click 'Cancel'.
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
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button onClick={handleDelete} variant="primary" size="lg">
                      Continue
                    </Button>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      onClick={handleCloseModal}
                      variant="primary"
                      size="lg"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default InfoModal
