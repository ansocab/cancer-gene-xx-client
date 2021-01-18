import React, { useState, createContext, useEffect } from "react";
// create a user context
// on page load: get user from api
// when login and logout

// set initial state with get user request

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const serverUrl =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_PROD_SERVER
      : process.env.REACT_APP_DEV_SERVER;

  useEffect(() => {
    const getUser = () => {
      fetch(`${serverUrl}/profile`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        "Access-Control-Allow-Origin": serverUrl,
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success === true) {
            console.log("logged in, continuing session as " + res.user.name);
            setUser(res.user);
          } else {
            console.log("not logged in, continuing session anonymously");
          }
        })
        .catch((err) => console.log(err));
    };
    getUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, serverUrl }}>
      {children}
    </UserContext.Provider>
  );
};
