import React from "react";
import { useState, useContext } from "react";

import PropTypes from "prop-types";

const ErrorMessageContext = React.createContext();
const SetErrorMessageContext = React.createContext();

function useErrorMessage() {
  return useContext(ErrorMessageContext);
}

function useSetErrorMessage() {
  return useContext(SetErrorMessageContext);
}

function ErrorMessageProvider({ children }) {
  const [errorMessage, setErrorMessage] = useState();

  return (
    <ErrorMessageContext.Provider value={errorMessage}>
      <SetErrorMessageContext.Provider value={setErrorMessage}>
        {children}
      </SetErrorMessageContext.Provider>
    </ErrorMessageContext.Provider>
  );
}

ErrorMessageProvider.propTypes = {
  children: PropTypes.any,
};

export { ErrorMessageProvider, useErrorMessage, useSetErrorMessage };
