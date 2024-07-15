import { Modal, Button } from "react-bootstrap";

import PropTypes from "prop-types";

function ErrorModal(props) {
  const correctCaptions = props.correctCaptions;
  return (
    <Modal className="failure-modal" show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Oops!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>You have chosen a wrong caption as your answer</p>
        <p>The correct answers for this meme were:</p>
        <ul style={{ textAlign: "left" }}>
          {correctCaptions.map((caption, index) => {
            return <li key={index}>{caption.caption}</li>;
          })}
        </ul>
        <p>Game Over!</p>
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

ErrorModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  correctCaptions: PropTypes.array.isRequired,
};

export default ErrorModal;
