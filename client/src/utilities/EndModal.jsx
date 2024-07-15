import { Modal, Button } from "react-bootstrap";

import PropTypes from "prop-types";

function EndModal(props) {
  const correctCaptions = props.correctCaptions;
  return (
    <Modal className="failure-modal" show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Game Over!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>You were unable to guess the meme!</p>
        <p>The correct answers for this meme were:</p>
        <ul style={{ textAlign: "left" }}>
          {correctCaptions.map((caption, index) => {
            return <li key={index}>{caption.caption}</li>;
          })}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            props.onHide();
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

EndModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  correctCaptions: PropTypes.array.isRequired,
};

export default EndModal;
