import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { Routes, Route } from "react-router-dom";
import { Container, Row } from "react-bootstrap";

// import all contexts
import { UserProvider } from "./context/UserContext";
import { SuccessMessageProvider } from "./context/SuccessContext";
import { ErrorMessageProvider } from "./context/ErrorContext";

import {
  logout,
  login,
  getCurrentSession,
  getMemes,
  verifyAnswer,
  getCorrectCaptions,
  insertGame,
  getHistory,
} from "./API.mjs";

import MemeNavbar from "./components/MemeNavbar";

// import all routes pages.
import LoginPage from "./routes/LoginPage";
import Home from "./routes/Home";
import HistoryPage from "./routes/HistoryPage";

function App() {
  return (
    <>
      <UserProvider>
        <SuccessMessageProvider>
          <ErrorMessageProvider>
            <Container fluid className="vh-100">
              <Row as="header">
                <MemeNavbar logout={logout} />
              </Row>
              <Routes>
                <Route
                  index
                  element={
                    <Home
                      getMemes={getMemes}
                      verifyAnswer={verifyAnswer}
                      getCorrectCaptions={getCorrectCaptions}
                      getCurrentSession={getCurrentSession}
                      insertGame={insertGame}
                      getHistory={getHistory}
                    />
                  }
                />
                <Route
                  path="/login"
                  element={
                    <LoginPage
                      login={login}
                      getCurrentSession={getCurrentSession}
                      getHistory={getHistory}
                    />
                  }
                />
                <Route
                  path="/games"
                  element={
                    <HistoryPage
                      getCurrentSession={getCurrentSession}
                      getHistory={getHistory}
                    />
                  }
                />
              </Routes>
            </Container>
          </ErrorMessageProvider>
        </SuccessMessageProvider>
      </UserProvider>
    </>
  );
}

export default App;
