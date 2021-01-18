import React, { useState, createContext, useEffect } from "react";
// create a user context
// on page load: get user from api
// when login and logout

// set initial state with get user request

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = () => {
      fetch("https://tcgasearcher.herokuapp.com/profile", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        "Access-Control-Allow-Origin": "https://tcgasearcher.herokuapp.com",
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
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
