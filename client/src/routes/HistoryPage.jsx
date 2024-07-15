import { useEffect, useState } from "react";

import { Col, Row } from "react-bootstrap";
import { useErrorMessage, useSetErrorMessage } from "../context/ErrorContext";
import {
  useSuccessMessage,
  useSetSuccessMessage,
} from "../context/SuccessContext";
import { useUser } from "../context/UserContext";

import ErrorBox from "../utilities/ErrorBox";
import SuccessBox from "../utilities/SuccessBox";
import HistoryForm from "../components/HistoryForm";
import PropTypes from "prop-types";

// History page component
function HistoryPage(props) {
  const { getCurrentSession, getHistory } = props;
  const [memes, setMemes] = useState([]); // array of memes
  const [scores, setScores] = useState([]); // array of scores

  // context
  const errorMessage = useErrorMessage();
  const setErrorMessage = useSetErrorMessage();
  const successMessage = useSuccessMessage();
  const setSuccessMessage = useSetSuccessMessage();
  const user = useUser();

  useEffect(() => {
    getCurrentSession()
      .then((currentUser) => {
        setErrorMessage("");
        if (!currentUser) {
          console.clear(); // to clear the 401 error message.
          // user is not authenticated or session expired
          return;
        }
        getHistory(currentUser.id)
          .then((array_of_objects) => {
            if (array_of_objects === null) {
              setErrorMessage(
                "No apparent history is available.\n Please go play some games!"
              );
              setTimeout(() => setErrorMessage(""), 4000);
              return;
            } else {
              const array_of_memes = [];
              const array_of_scores = [];
              for (let i = 0; i < array_of_objects.length; i++) {
                array_of_memes.push(array_of_objects[i].memes);
                array_of_scores.push(array_of_objects[i].scores);
              }
              setMemes(array_of_memes);
              setScores(array_of_scores);
              setSuccessMessage(
                "Here is the history for all the game you have played!"
              );
              setTimeout(() => setSuccessMessage(""), 4000);
            }
          })
          .catch((error) => {
            setErrorMessage(
              "An error occurred while getting your current history"
            );
            throw error;
          });
      })
      .catch((err) => {
        setErrorMessage("An error occurred while getting your current session");
        throw err;
      });
  }, []);

  if (!user) {
    return <></>;
  }

  return (
    <>
      {errorMessage && <ErrorBox className="mx-5">{errorMessage}</ErrorBox>}
      {successMessage && (
        <SuccessBox className="mx-5">{successMessage}</SuccessBox>
      )}

      <Row className="mt-5">
        <Col></Col>

        <Col as="main" className="my-2 p-1">
          <HistoryForm memes={memes} scores={scores} />
        </Col>

        <Col></Col>
      </Row>
    </>
  );
}

// prop types validation

HistoryPage.propTypes = {
  getCurrentSession: PropTypes.func.isRequired,
  getHistory: PropTypes.func.isRequired,
};

export default HistoryPage;
