import { Row, Col, Alert } from "react-bootstrap";
import PropTypes from "prop-types";

function SuccessBox({ children, className }) {
  let lines;

  if (typeof children === "string") {
    lines = children
      .split("\n")
      .map((line, index) => <p key={`success-${index}`}>{line}</p>);
  }

  return (
    <Row className="mt-1 mb-3 pe-5 ps-3 success-box">
      <Col className={className}>
        <Alert variant="success">{lines ? lines : children}</Alert>
      </Col>
    </Row>
  );
}

SuccessBox.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  className: PropTypes.string,
};

export default SuccessBox;
