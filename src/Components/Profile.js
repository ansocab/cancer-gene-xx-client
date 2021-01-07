import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export default function Profile() {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [userData, setUserData] = useState({});
  const history = useHistory();
  //const [passwordDots, setPasswordDots] = useState("");
  console.log("test");
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
        .then((res) => console.log(res));
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

  return (
    <div style={{ margin: "20px" }}>
      WELCOME!
      <button onClick={handleClick}>Logout</button>
    </div>
  );
}
