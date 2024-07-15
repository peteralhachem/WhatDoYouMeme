import { Card, Stack, Image, Form, Button } from "react-bootstrap";
import { Controller } from "react-bootstrap-icons";
import { useState, useEffect, useCallback } from "react";
import CircularTimer from "../utilities/CircularTimer";

import { useSetSuccessMessage } from "../context/SuccessContext";

import { useSetErrorMessage } from "../context/ErrorContext";

import { useUser, useSetUser } from "../context/UserContext";

import EndModal from "../utilities/EndModal";
import SuccessModal from "../utilities/SuccessModal";

import PropTypes from "prop-types";

function UserMemeForm(props) {
  const [game, setGame] = useState(false); // state to see if the game is on or not.
  const [seconds, setSeconds] = useState(30); // timer seconds.
  const [isActive, setIsActive] = useState(false); // timer is not active
  const [meme, setMeme] = useState([]); // array of memes
  const [captions, setCaptions] = useState([]); // array of captions
  const [round, setRound] = useState(1); // round number
  const [scores, setScores] = useState([]); // array of scores for each round
  const [isRight, setIsRight] = useState(false); // is the answer the correct answer
  const [selectedIndex, setSelectedIndex] = useState(null); // the index of the clicked button
  // the meme with its corresponding correct answer that the user has selected.
  const [selectedCorrectAnswer, setSelectedCorrectAnswer] = useState([]);
  const [correctCaptions, setCorrectCaptions] = useState([]); // the correct captions

  const [showEndModal, setShowEndModal] = useState(false); // show end modal
  const [showSuccessModal, setShowSuccessModal] = useState(false); // show success modal

  const setErrorMessage = useSetErrorMessage(); // from error context
  const setSuccessMessage = useSetSuccessMessage(); // from success context
  const user = useUser(); // from user context
  const setUser = useSetUser(); // from user context

  const getCorrectCaptions = props.getCorrectCaptions;

  // Callback function to fetch correct values
  const fetchCorrectCaptions = useCallback(
    async (meme_id, selected_captions) => {
      try {
        const result_object = await getCorrectCaptions(
          meme_id,
          selected_captions
        );
        setCorrectCaptions(result_object.captions);
      } catch (error) {
        console.log(
          "The error is present in UsermemeForm second part\n" + error.message
        );
        setErrorMessage("Something went wrong with correct captions loading");
      }
    },
    [getCorrectCaptions, setCorrectCaptions, setErrorMessage]
  );

  // useEffect that handles the timer.
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
            clearInterval(interval);
            setIsActive(false);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    } else if (seconds === 0) {
      clearInterval(interval);
      setIsActive(false);
      // check if meme is not empty before fetching correct captions
      if (meme.length !== 0 && captions.length !== 0) {
        fetchCorrectCaptions(meme[round - 1].id, captions[round - 1]);
      }
      setShowEndModal(true);
      setErrorMessage("");
      setSuccessMessage("");
      return;
    }
    return () => clearInterval(interval);
  }, [
    isActive,
    seconds,
    meme,
    captions,
    fetchCorrectCaptions,
    round,
    setIsActive,
    setRound,
    setScores,
    setMeme,
    setCaptions,
    setSelectedCorrectAnswer,
    setErrorMessage,
    setSuccessMessage,
    setShowEndModal,
  ]);

  const color = seconds <= 10 ? "red" : "green";

  // asynchronous function that handles the start of the game
  async function handleStartGame() {
    try {
      const array_of_memes = [];
      const array_of_captions = [];
      const array_of_objects = await props.getMemes();
      for (let i = 0; i < array_of_objects.length; i++) {
        array_of_memes.push(array_of_objects[i].meme);
        array_of_captions.push(array_of_objects[i].captions);
      }
      setMeme(array_of_memes);
      setCaptions(array_of_captions);
      setSeconds(30);
      setIsActive(true);
      setGame(true);
      setShowEndModal(false);
      setSelectedIndex(null);
      setErrorMessage("");
      setSuccessMessage("");
    } catch (error) {
      console.log(
        "The error is present in  UsermemeForm first part\n" + error.message
      );
      setErrorMessage("Something went wrong with meme loading");
    }
  }
  // asynchronous function that handles the verification of the answer if it is correct or not
  async function handleVerifyGame(meme_id, answer) {
    try {
      const result_object = await props.verifyAnswer(meme_id, answer);
      if (result_object.isCorrect) {
        setSuccessMessage(
          "Your answer is correct! You have scored 5 points for this round!"
        );
        setScores([...scores, 5]);
        setIsRight(true);
        setSelectedCorrectAnswer([
          ...selectedCorrectAnswer,
          { meme: meme[round - 1].url, answer: answer },
        ]);

        setTimeout(() => {
          handleNextRound();
        }, 3000);
      } else {
        setIsRight(false);

        setErrorMessage(
          "Your answer is incorrect! You get 0 points for this round!"
        );

        setScores([...scores, 0]);
        setTimeout(() => {
          handleNextRound();
        }, 3000);
      }
    } catch (error) {
      console.log("The error is present in UsermemeForm\n" + error.message);
      setErrorMessage("Something went wrong with verifying the answer.");
    }
  }

  // useEffect to handle if the round is greater than 3, show success modal
  useEffect(() => {
    if (round > 3) {
      setIsActive(false);
      setShowSuccessModal(true);
      setErrorMessage("");
      setSuccessMessage("");
      return;
    }
  }, [
    round,
    setIsActive,
    setShowSuccessModal,
    setGame,
    setRound,
    setErrorMessage,
    setSuccessMessage,
  ]);

  // asynchronous function that handles the next round
  async function handleNextRound() {
    try {
      setRound((prevRound) => prevRound + 1);
      setSelectedIndex(null);
      setSeconds(30);
      setIsActive(true);
      setErrorMessage("");
      setSuccessMessage("");
    } catch (error) {
      console.log("The error is present in UsermemeForm\n" + error.message);
      setErrorMessage("Something went wrong with meme loading");
    }
  }

  // async function that handles if the end game button is clicked
  async function handleEndGame() {
    try {
      if (selectedIndex !== null) {
        setShowEndModal(false);
        setErrorMessage("Please wait for the game to load new meme");
        setTimeout(() => setErrorMessage(""), 3000);
      } else {
        fetchCorrectCaptions(meme[round - 1].id, captions[round - 1]);
        setShowEndModal(true);
        setIsActive(false);
        setErrorMessage("");
        setSuccessMessage("");
      }
    } catch (error) {
      console.log("The error is present is memeForm\n" + error.message);
      setErrorMessage("Something went wrong with meme loading");
    }
  }

  // handle game insertion
  async function handleInsertGame(user_id, meme_array, score_array) {
    try {
      await props.insertGame(user_id, meme_array, score_array);
      setSuccessMessage(
        "Game registered successfully!\n You can now check it in the 'Previous Games' section."
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.log("The error is present in UsermemeForm\n" + error.message);
      setErrorMessage("Something went wrong with inserting the game.");
    }
  }

  async function handleUpdateScore() {
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
                // get also user's score
                newUser.score = array_of_objects.reduce(
                  (accumulator, currentObject) => {
                    // Sum the scores of the current object and add to the accumulator
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
  }

  return (
    <>
      <Card className="meme-form">
        <Card.Header>
          {game ? (
            round <= 3 ? (
              <Stack direction="horizontal" gap={3}>
                <div className="p-2" style={{ color: "blue" }}>
                  Round {round}
                </div>
                <div className="p-2 ms-auto">
                  <CircularTimer color={color} seconds={seconds} />
                </div>
              </Stack>
            ) : null
          ) : (
            <div className="p-2" style={{ color: "blue", textAlign: "center" }}>
              Guess the meme!
            </div>
          )}
        </Card.Header>
        {game ? (
          // check if the round is less or equal to 3
          round <= 3 ? (
            <Card.Body>
              <Image
                style={{ paddingBottom: "10px", height: "250px" }}
                src={`../../public/img/${meme[round - 1].url}`}
                alt="meme"
                fluid
              />
              <Form className="separator">
                <Stack direction="vertical" gap={3}>
                  {captions[round - 1].map((caption, index) => {
                    return (
                      <Button
                        className="meme-answers"
                        variant={
                          selectedIndex === index
                            ? isRight
                              ? "success"
                              : "danger"
                            : "primary"
                        }
                        key={index}
                        onClick={() => {
                          handleVerifyGame(meme[round - 1].id, caption.caption);
                          setSelectedIndex(index);
                          setIsActive(false);
                        }}
                      >
                        {caption.caption}
                      </Button>
                    );
                  })}
                </Stack>
              </Form>
            </Card.Body>
          ) : null
        ) : (
          <Card.Body>
            <Controller color="blue" size="10em" />
          </Card.Body>
        )}

        <Card.Footer className="text-muted">
          {game ? (
            round <= 3 ? (
              <Stack direction="horizontal" gap={3}>
                <div className="p-2" style={{ fontWeight: "bold" }}>
                  Total Score:{" "}
                  {scores.reduce((variable, currentValue) => {
                    return variable + currentValue;
                  }, 0)}
                </div>
                <Button
                  variant="primary"
                  onClick={() => {
                    handleEndGame();
                  }}
                  className="meme-button p-2 ms-auto"
                >
                  {" "}
                  End Game{" "}
                </Button>
                {showEndModal ? (
                  <EndModal
                    show={showEndModal}
                    onHide={() => {
                      setShowEndModal(false);
                      setRound(1);
                      setGame(false);
                      setScores([]);
                      setMeme([]);
                      setCaptions([]);
                      setSelectedCorrectAnswer([]);
                    }}
                    correctCaptions={correctCaptions}
                  />
                ) : null}
              </Stack>
            ) : null
          ) : (
            <Button
              variant="primary"
              onClick={() => {
                handleStartGame();
              }}
              className="meme-button"
            >
              {" "}
              Start Game{" "}
            </Button>
          )}
        </Card.Footer>
        {showSuccessModal ? (
          <SuccessModal
            show={showSuccessModal}
            onHide={() => {
              setShowSuccessModal(false);
              setRound(1);
              setGame(false);
              setScores([]);
              setMeme([]);
              setCaptions([]);
              setSelectedCorrectAnswer([]);
              handleInsertGame(user.id, meme, scores);
              handleUpdateScore();
            }}
            selectedCorrectAnswer={selectedCorrectAnswer}
          />
        ) : null}
      </Card>
    </>
  );
}

UserMemeForm.propTypes = {
  getCorrectCaptions: PropTypes.func.isRequired,
  getMemes: PropTypes.func.isRequired,
  verifyAnswer: PropTypes.func.isRequired,
  insertGame: PropTypes.func.isRequired,
  getCurrentSession: PropTypes.func.isRequired,
  getHistory: PropTypes.func.isRequired,
};

export default UserMemeForm;
