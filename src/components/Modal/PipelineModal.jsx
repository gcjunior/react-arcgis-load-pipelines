import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";

const PipelineModal = ({ hideModal, labelCloseBtn, record }) => {
  return (
    <Modal
      id={"editUsersModal"}
      show
      backdrop="static"
      onHide={hideModal}
    >
      <Modal.Header closeButton>
        <h4 className="modal-title">Pipeline Details</h4>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Name:</strong> {record.name}
        </p>
        <p>
          <strong>Type:</strong> {record.status}
        </p>
      </Modal.Body>
      <Modal.Footer>
        {hideModal && (
          <Button type="button" onClick={hideModal}>
            {labelCloseBtn}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

PipelineModal.defaultProps = {
  labelCloseBtn: "Close",
};

PipelineModal.propTypes = {
  labelCloseBtn: PropTypes.string,
};

export default PipelineModal;
