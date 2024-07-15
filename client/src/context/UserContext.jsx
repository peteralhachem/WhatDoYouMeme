import React from "react";
import PropTypes from "prop-types";

import { useState, useContext } from "react";

const UserContext = React.createContext();
const SetUserContext = React.createContext();

function useUser() {
  // user context hook
  return useContext(UserContext);
}

function useSetUser() {
  // setUser context hook
  return useContext(SetUserContext);
}

function UserProvider({ children }) {
  // provider component
  const [user, setUser] = useState(); // logged user context

  return (
    <UserContext.Provider value={user}>
      <SetUserContext.Provider value={setUser}>
        {children}
      </SetUserContext.Provider>
    </UserContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.any,
};

export { UserProvider, useUser, useSetUser };
