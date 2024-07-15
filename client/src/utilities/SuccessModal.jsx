import { Modal, Button, Stack, Image } from "react-bootstrap";

import PropTypes from "prop-types";

function SuccessModal(props) {
  const selectedCorrectAnswer = props.selectedCorrectAnswer;
  return (
    <Modal className="success-modal" show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Good Job!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>You have successfully completed the game!</p>
        <p>These are your correct answers:</p>
        <ul style={{ textAlign: "left" }}>
          {selectedCorrectAnswer.map((obj, index) => {
            return (
              <li key={index}>
                <Stack
                  direction="horizontal"
                  gap={3}
                  style={{ paddingBottom: "25px" }}
                >
                  <Image
                    style={{ height: "100px" }}
                    src={`../../public/img/${obj.meme}`}
                    alt="meme"
                    rounded
                  />
                  <div>{obj.answer}</div>
                </Stack>
              </li>
            );
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

SuccessModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  selectedCorrectAnswer: PropTypes.array.isRequired,
};

export default SuccessModal;
