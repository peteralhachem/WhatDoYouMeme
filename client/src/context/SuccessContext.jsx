import React from "react";
import { useState, useContext } from "react";
import PropTypes from "prop-types";

const SuccessMessageContext = React.createContext();
const SetSuccessMessageContext = React.createContext();

function useSuccessMessage() {
  return useContext(SuccessMessageContext);
}

function useSetSuccessMessage() {
  return useContext(SetSuccessMessageContext);
}

function SuccessMessageProvider({ children }) {
  const [successMessage, setSuccessMessage] = useState();

  return (
    <SuccessMessageContext.Provider value={successMessage}>
      <SetSuccessMessageContext.Provider value={setSuccessMessage}>
        {children}
      </SetSuccessMessageContext.Provider>
    </SuccessMessageContext.Provider>
  );
}

SuccessMessageProvider.propTypes = {
  children: PropTypes.any,
};

export { SuccessMessageProvider, useSuccessMessage, useSetSuccessMessage };
