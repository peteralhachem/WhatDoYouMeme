import {
  Container,
  Navbar,
  Button,
  OverlayTrigger,
  Tooltip,
  Stack,
} from "react-bootstrap";
import { PersonCircle, EmojiWinkFill } from "react-bootstrap-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetErrorMessage } from "../context/ErrorContext.jsx";
import { useSetSuccessMessage } from "../context/SuccessContext.jsx";
import { useUser, useSetUser } from "../context/UserContext.jsx";

import PropTypes from "prop-types";

// application navbar component
function MemeNavbar(props) {
  const { logout } = props;

  // context
  const user = useUser();
  const setUser = useSetUser();
  const setErrorMessage = useSetErrorMessage();
  const setSuccessMessage = useSetSuccessMessage();

  const [isHistory, setIsHistory] = useState(false);

  const navigate = useNavigate();

  // callbacks
  function goToHome() {
    setErrorMessage("");
    setSuccessMessage("");
    navigate("/");
    setIsHistory(false);
  }

  function goToLogin() {
    setErrorMessage("");
    setSuccessMessage("");
    navigate("/login");
  }

  async function handleLogout() {
    setErrorMessage("");
    setSuccessMessage("");
    setIsHistory(false);

    try {
      // call the right API endpoint to logout
      await logout();

      // logout successfully done
      setUser(undefined); // delete logged in user info from context
      setSuccessMessage("You have successfully logged out");
      setTimeout(() => setSuccessMessage(""), 3000); // make success message disappear after 3s

      // redirect to home page
      navigate("/");
    } catch (err) {
      setErrorMessage("Something went wrong with your request");
    }
  }

  return (
    <Navbar bg="primary" variant="dark" expand="md" className="memes-navbar">
      <Container fluid>
        <Navbar.Toggle />

        <Navbar.Brand className="d-flex align-items-center action-icon-wrapper">
          <EmojiWinkFill
            color="white"
            size="1.25em"
            className="me-2"
            onClick={() => goToHome()}
          />

          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip>
                Go to the <strong>homepage</strong>
              </Tooltip>
            }
          >
            <span onClick={() => goToHome()}> What do you meme?</span>
          </OverlayTrigger>
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          {user ? (
            // check isHistory to display the button only when user is logged in
            isHistory ? null : (
              <>
                <Navbar.Brand>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip>See your previous games</Tooltip>}
                  >
                    <Button
                      onClick={() => {
                        setIsHistory(true);
                        navigate("/games");
                      }}
                    >
                      Previous Games
                    </Button>
                  </OverlayTrigger>
                </Navbar.Brand>
              </>
            )
          ) : null}
          <Navbar.Brand>
            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip>
                  {user ? "Logout from account" : "Go to sign in page"}
                </Tooltip>
              }
            >
              <Button
                className={`me-3 ${user ? "sign-in" : "logout"}-button`}
                onClick={() => (user ? handleLogout() : goToLogin())}
              >
                {user ? "Logout" : "Sign In"}
              </Button>
            </OverlayTrigger>
          </Navbar.Brand>
        </Navbar.Collapse>

        {user ? (
          <Navbar.Brand>
            <Stack direction="horizontal">
              <Stack className="user-info me-3" align="center">
                <span className="user-username">@{user.username}</span>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Total score of all games</Tooltip>}
                >
                  <span className="user-score">
                    {user.score ?? 0} point{user.score === 1 ? "" : "s"}
                  </span>
                </OverlayTrigger>
              </Stack>

              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>Hi @{user.username}!</Tooltip>}
              >
                <PersonCircle
                  color="white"
                  size="1.7em"
                  className="action-icon"
                />
              </OverlayTrigger>
            </Stack>
          </Navbar.Brand>
        ) : null}
      </Container>
    </Navbar>
  );
}

MemeNavbar.propTypes = {
  logout: PropTypes.func,
};

export default MemeNavbar;
