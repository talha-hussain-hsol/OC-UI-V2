import { Modal, Button } from "react-bootstrap";
import PropTypes from "prop-types";

function DynamicModal({ show, handleClose, handleConfirm, title, body }) {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

DynamicModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  handleConfirm: PropTypes.func,
  title: PropTypes.string,
  body: PropTypes.string,
};

export default DynamicModal;
