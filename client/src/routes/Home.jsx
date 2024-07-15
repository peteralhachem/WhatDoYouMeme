import { Row, Col } from "react-bootstrap";

import { useEffect } from "react";

import { useSuccessMessage } from "../context/SuccessContext";
import { useErrorMessage, useSetErrorMessage } from "../context/ErrorContext";
import { useSetUser, useUser } from "../context/UserContext";
import MemeForm from "../components/MemeForm";
import UserMemeForm from "../components/UserMemeForm";
import ErrorBox from "../utilities/ErrorBox";
import SuccessBox from "../utilities/SuccessBox";
import PropTypes from "prop-types";

function Home(props) {
  // context
  const errorMessage = useErrorMessage();
  const successMessage = useSuccessMessage();
  const setErrorMessage = useSetErrorMessage();

  const user = useUser();
  const setUser = useSetUser();

  useEffect(() => {
    // check if user is logged in
    props
      .getCurrentSession()
      .then((newUser) => {
        if (newUser) {
          // get total score of the user
          props
            .getHistory(newUser.id)
            .then((array_of_objects) => {
              // check if array of objects is null
              if (array_of_objects === null) {
                newUser.score = 0;
                setUser(newUser);
              } else {
                newUser.score = array_of_objects.reduce(
                  (accumulator, currentObject) => {
                    const sumOfScores = currentObject.scores.reduce(
                      (sum, score) => sum + score,
                      0
                    );
                    return accumulator + sumOfScores;
                  },
                  0
                );
                setUser(newUser);
              }
            })
            .catch((error) => {
              setErrorMessage("An error occurred while getting your score");
              throw error;
            });
        } else {
          console.clear(); // in order to clear the '401 unauthorized' error message
        }
      })
      .catch((err) => {
        setErrorMessage("An error occurred while getting your current session");
        throw err;
      });
  }, [setUser, setErrorMessage, props]);

  return (
    <>
      {errorMessage && <ErrorBox className="mx-5">{errorMessage}</ErrorBox>}
      {successMessage && (
        <SuccessBox className="mx-5">{successMessage}</SuccessBox>
      )}

      <Row className="mt-5">
        <Col></Col>

        <Col as="main" className="my-2 p-1">
          {user ? (
            <UserMemeForm
              getMemes={props.getMemes}
              getCorrectCaptions={props.getCorrectCaptions}
              verifyAnswer={props.verifyAnswer}
              insertGame={props.insertGame}
              getCurrentSession={props.getCurrentSession}
              getHistory={props.getHistory}
            />
          ) : (
            <MemeForm
              getMemes={props.getMemes}
              verifyAnswer={props.verifyAnswer}
              getCorrectCaptions={props.getCorrectCaptions}
            />
          )}
        </Col>

        <Col></Col>
      </Row>
    </>
  );
}

// prop types validation

Home.propTypes = {
  getMemes: PropTypes.func.isRequired,
  verifyAnswer: PropTypes.func.isRequired,
  getCorrectCaptions: PropTypes.func.isRequired,
  getCurrentSession: PropTypes.func.isRequired,
  insertGame: PropTypes.func.isRequired,
  getHistory: PropTypes.func.isRequired,
};

export default Home;
