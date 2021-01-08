import React, { useState, createContext } from "react";
import { Children } from "react";

const ProfileContext = createContext({ name: "", auth: false });

const ProfileProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});

  const checkIfLoggedIn = () => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      //const foundUser = JSON.parse(loggedInUser);
      //setUser(foundUser)
      console.log("found user!");
      setUserData(loggedInUser);
    } else {
      console.log("no user");
    }
  };

  return (
    <ProfileContext.Provider
      value={{ loggedIn, setLoggedIn, userData, setUserData, checkIfLoggedIn }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export { ProfileContext, ProfileProvider };
