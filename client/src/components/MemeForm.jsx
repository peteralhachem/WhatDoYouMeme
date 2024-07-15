import { Button, Card, Form, Stack, Image } from "react-bootstrap";
import { Controller } from "react-bootstrap-icons";
import { useCallback, useEffect, useState } from "react";

import { useSetSuccessMessage } from "../context/SuccessContext";
import { useSetErrorMessage } from "../context/ErrorContext";

import CircularTimer from "../utilities/CircularTimer";

import EndModal from "../utilities/EndModal";
import ErrorModal from "../utilities/ErrorModal";

import PropTypes from "prop-types";

function MemeForm(props) {
  const [game, setGame] = useState(false); // game has not started yet
  const [showErrorModal, setShowErrorModal] = useState(false); // show the error modal when an answer is wrong.
  const [showEndModal, setShowEndModal] = useState(false); // show the end modal when the game is over.
  const [seconds, setSeconds] = useState(30); // timer seconds
  const [isActive, setIsActive] = useState(false); // timer is not active
  const [meme, setMeme] = useState(""); //
  const [captions, setCaptions] = useState([]);
  const [isRight, setIsRight] = useState(false); // is the answer the correct answer
  const [selectedIndex, setSelectedIndex] = useState(null); // the index of the clicked button
  const [correctCaptions, setCorrectCaptions] = useState([]); // the correct captions

  const setErrorMessage = useSetErrorMessage();
  const setSuccessMessage = useSetSuccessMessage();

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
          "The error is present is memeForm second part\n" + error.message
        );
        setErrorMessage("Something went wrong with correct captions loading");
      }
    },
    [getCorrectCaptions, setCorrectCaptions, setErrorMessage]
  );

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
      if (meme && captions.length !== 0) {
        fetchCorrectCaptions(meme.id, captions);
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
    setErrorMessage,
    setSuccessMessage,
  ]);

  // async function to fetch the memes
  async function handleStartGame() {
    try {
      const result_object = await props.getMemes();
      setMeme(result_object.meme[0]);
      setCaptions(result_object.captions);
      setSeconds(30);
      setIsActive(true);
      setGame(true);
      setShowEndModal(false);
    } catch (error) {
      console.log(
        "The error is present is memeForm first part\n" + error.message
      );
      setErrorMessage("Something went wrong with meme loading");
    }
  }

  async function handleVerifyGame(meme_id, answer) {
    try {
      const result_object = await props.verifyAnswer(meme_id, answer);
      if (result_object.isCorrect) {
        setSuccessMessage(
          "You have entered a correct answer!\n Your score is 5 points!"
        );
        setTimeout(() => setSuccessMessage(""), 3000);
        setIsActive(false);
        setIsRight(true);
      } else {
        fetchCorrectCaptions(meme.id, captions);
        setIsActive(false);
        setShowErrorModal(true);
        setErrorMessage("");
        setSuccessMessage("");
        setIsRight(false);
      }
    } catch (error) {
      console.log("The error is present is memeForm\n" + error.message);
      setErrorMessage("Something went wrong while verifying the answer!");
    }
  }

  async function handleEndGame() {
    try {
      fetchCorrectCaptions(meme.id, captions);
      setShowEndModal(true);
      setIsActive(false);
    } catch (error) {
      console.log("The error is present is memeForm\n" + error.message);
      setErrorMessage("Something went wrong with meme loading");
    }
  }

  const color = seconds <= 10 ? "red" : "green";

  return (
    <>
      <Card className="meme-form">
        <Card.Header>
          {game ? (
            <Stack direction="horizontal" gap={3}>
              <div className="p-2" style={{ color: "blue" }}>
                Guess the meme!
              </div>
              <div className="p-2 ms-auto">
                <CircularTimer color={color} seconds={seconds} />
              </div>
            </Stack>
          ) : (
            <div className="p-2" style={{ color: "blue", textAlign: "center" }}>
              Guess the meme!
            </div>
          )}
        </Card.Header>
        {game ? (
          <Card.Body>
            <Image
              style={{ paddingBottom: "10px", height: "250px" }}
              src={`../../public/img/${meme.url}`}
              alt="meme"
              fluid
            />
            <Form className="separator">
              <Stack direction="vertical" gap={3}>
                {captions.map((caption, index) => {
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
                        handleVerifyGame(meme.id, caption.caption);
                        setSelectedIndex(index);
                        setIsActive(false);
                      }}
                    >
                      {caption.caption}
                    </Button>
                  );
                })}
              </Stack>
              {isRight ? null : (
                <ErrorModal
                  show={showErrorModal}
                  onHide={() => {
                    setShowErrorModal(false);
                    setGame(false);
                    setMeme("");
                    setCaptions([]);
                    setCorrectCaptions([]);
                    setSelectedIndex(null);
                    setErrorMessage("");
                    setSuccessMessage("");
                  }}
                  correctCaptions={correctCaptions}
                />
              )}
            </Form>
          </Card.Body>
        ) : (
          <Card.Body>
            <Controller color="blue" size="10em" />
          </Card.Body>
        )}

        <Card.Footer className="text-muted">
          {game ? (
            <>
              {isRight ? ( // Guess another meme
                <Button
                  variant="primary"
                  onClick={() => {
                    setIsRight(false);
                    setMeme("");
                    setCaptions([]);
                    setCorrectCaptions([]);
                    setErrorMessage("");
                    setSuccessMessage("");
                    setSelectedIndex(null);
                    handleStartGame();
                  }}
                  className="meme-button"
                >
                  {" "}
                  Guess Another Meme{" "}
                </Button>
              ) : (
                <>
                  <Button
                    variant="primary"
                    onClick={() => {
                      handleEndGame();
                    }}
                    className="meme-button"
                  >
                    {" "}
                    End Game{" "}
                  </Button>
                  {showEndModal ? (
                    <EndModal
                      show={showEndModal}
                      onHide={() => {
                        setShowEndModal(false);
                        setGame(false);
                        setMeme("");
                        setCaptions([]);
                        setCorrectCaptions([]);
                        setSelectedIndex(null);
                        setErrorMessage("");
                        setSuccessMessage("");
                      }}
                      correctCaptions={correctCaptions}
                    />
                  ) : null}
                </>
              )}
            </>
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
      </Card>
    </>
  );
}

// prop types validation

MemeForm.propTypes = {
  getMemes: PropTypes.func.isRequired,
  verifyAnswer: PropTypes.func.isRequired,
  getCorrectCaptions: PropTypes.func.isRequired,
};

export default MemeForm;
