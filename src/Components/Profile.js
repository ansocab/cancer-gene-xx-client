import { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";
import { ProfileContext } from "../ProfileContext";

export default function Profile() {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  //const [userData, setUserData] = useState({});
  const history = useHistory();
  const { checkIfLoggedIn, userData } = useContext(ProfileContext);

  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  useEffect(() => {
    const getUser = () => {
      fetch("http://localhost:4000/profile", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        "Access-Control-Allow-Origin": "http://localhost:4000",
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success === true) {
            //   setUserData(res.user);
            localStorage.setItem("user", res.user);
          } else {
            console.log("Uuups - No user found");
          }
        })
        .catch((err) => console.log(err));
    };
    getUser();
  }, []);

  const logout = () => {
    fetch("http://localhost:4000/logout", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      "Access-Control-Allow-Origin": "http://localhost:4000",
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        localStorage.clear();
        handleRedirect(res);
      })
      .catch((err) => console.log(err));
  };

  function handleRedirect(res) {
    if (res.success === true) {
      history.push(res.redirectUrl);
    } else {
      console.log("something went wrong");
    }
  }

  const handleClick = () => {
    logout();
  };

  if (Object.keys(userData).length !== 0) {
    console.log(Object.entries(userData));
    console.log(userData[0]);
    return (
      <div style={{ margin: "20px" }}>
        <p>{`Welcome ${userData[5]}!`}</p>
        <Button variant="primary" onClick={handleClick}>
          Logout
        </Button>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}
