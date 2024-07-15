import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { useErrorMessage, useSetErrorMessage } from "../context/ErrorContext";
import { useSetUser, useUser } from "../context/UserContext";
import ErrorBox from "../utilities/ErrorBox";
import LoginForm from "../components/LoginForm";
import PropTypes from "prop-types";

// login page component
function LoginPage(props) {
  const { login, getCurrentSession, getHistory } = props;

  // context
  const errorMessage = useErrorMessage();
  const setErrorMessage = useSetErrorMessage();
  const user = useUser();
  const setUser = useSetUser();

  const navigate = useNavigate();

  useEffect(() => {
    getCurrentSession().then((currentUser) => {
      setErrorMessage("");
      if (!currentUser) {
        console.clear(); // to clear the '401 unauthorized' error message
        // user is not authenticated or session expired
        return;
      }
      // get also user's score
      getHistory(currentUser.id)
        .then((array_of_objects) => {
          if (array_of_objects.length === 0) {
            currentUser.score = 0;
            setUser(currentUser);

            navigate("/");
            return;
          }
          currentUser.score = array_of_objects.reduce(
            (accumulator, currentObject) => {
              const sumOfScores = currentObject.scores.reduce(
                (sum, score) => sum + score,
                0
              );
              return accumulator + sumOfScores;
            },
            0
          );
          setUser(currentUser);
          // redirect to home page
          navigate("/");
        })
        .catch((error) => {
          setErrorMessage("An error occurred while getting your score");
          throw error;
        });
    });
  }, []);

  if (user) {
    return <></>;
  }

  return (
    <>
      {errorMessage && <ErrorBox className="mx-5">{errorMessage}</ErrorBox>}

      <Row className="mt-5">
        <Col></Col>

        <Col as="main" xs={8} sm={6} lg={4} xl={3} className="my-2 p-1">
          <LoginForm login={login} />
        </Col>

        <Col></Col>
      </Row>
    </>
  );
}

// prop types validation

LoginPage.propTypes = {
  login: PropTypes.func.isRequired,
  getCurrentSession: PropTypes.func.isRequired,
  getHistory: PropTypes.func.isRequired,
};

export default LoginPage;
