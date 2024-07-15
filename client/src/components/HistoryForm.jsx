import { Accordion, Stack, Card, Image } from "react-bootstrap";
import PropTypes from "prop-types";

function HistoryCard(props) {
  const { array_of_memes, array_of_scores } = props;
  return (
    <>
      {array_of_memes.map((meme, index) => {
        return (
          <Accordion.Body key={index} style={{ padding: "0px" }}>
            <Stack
              direction="horizontal"
              gap={2}
              style={{
                backgroundColor:
                  array_of_scores[index] === 0 ? "#FFC1C3" : "#ddfada",
              }}
            >
              <Image
                style={{ padding: "10px", height: "100px" }}
                src={`../../public/img/${meme}`}
                alt="meme"
                fluid
              />
              <div
                className="p-2 ms-auto"
                style={{
                  fontSize: "20px",
                  color: array_of_scores[index] === 0 ? "red" : "green",
                  marginRight: "100px",
                }}
              >
                Score {array_of_scores[index]}
              </div>
            </Stack>
          </Accordion.Body>
          // </Card>
        );
      })}
    </>
  );
}

function HistoryForm(props) {
  const { memes, scores } = props;
  return (
    <>
      {memes.length > 0 ? (
        <Accordion className="history-form">
          {memes.map((meme, index) => {
            return (
              <Accordion.Item key={index} eventKey={`${index}`}>
                <Card>
                  <Accordion.Header>
                    <Stack direction="horizontal" gap={2}>
                      <div className="p-2" style={{ marginRight: "700px" }}>
                        Game {memes.length - index}
                      </div>
                      <div className="p-2 ms-auto">
                        Game Score -{" "}
                        {scores[index].reduce((acc, curr) => {
                          return acc + curr;
                        }, 0)}
                      </div>
                    </Stack>
                  </Accordion.Header>
                  <HistoryCard
                    array_of_memes={meme}
                    array_of_scores={scores[index]}
                  />
                </Card>
              </Accordion.Item>
            );
          })}
        </Accordion>
      ) : null}
    </>
  );
}

HistoryForm.propTypes = {
  memes: PropTypes.array,
  scores: PropTypes.array,
};

HistoryCard.propTypes = {
  array_of_memes: PropTypes.array,
  array_of_scores: PropTypes.array,
};

export default HistoryForm;
