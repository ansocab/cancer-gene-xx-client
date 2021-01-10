import React, { useState, createContext } from "react";
import * as Cookies from "js-cookie";

export const setSessionCookie = (session) => {
  Cookies.remove("session");
  Cookies.set("session", session, { expires: 14 });
};

export const getSessionCookie = () => {
  const sessionCookie = Cookies.get("session");

  if (sessionCookie === undefined) {
    return {};
  } else {
    return JSON.parse(sessionCookie);
  }
};

export const removeSessionCookie = () => {
  Cookies.remove("session");
};

export const SessionContext = createContext(getSessionCookie());

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(getSessionCookie());

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};
