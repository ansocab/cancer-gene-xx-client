import { useState } from "react";
import { useHistory } from "react-router-dom";

export default function Login() {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const history = useHistory();
  //const [passwordDots, setPasswordDots] = useState("");

  const login = () => {
    fetch("http://localhost:4000/login", {
      method: "POST",
      body: JSON.stringify({ email: emailValue, password: passwordValue }),
      headers: {
        "Content-Type": "application/json",
      },
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

  const handleChange = (e) => {
    const currentValue = e.target.value;
    if (e.target.id === "email") {
      setEmailValue(currentValue);
    } else if (e.target.id === "password") {
      setPasswordValue(currentValue);
      //   const dots = currentValue
      //     .split("")
      //     .map((char) => passwordDots.concat("\u2981"));
      //   setPasswordDots(dots);
    }
  };

  const handleSubmission = (e) => {
    e.preventDefault();
    login();
  };

  return (
    <div style={{ margin: "20px" }}>
      LOGIN
      <form onSubmit={handleSubmission} style={{ padding: "10px" }}>
        <label>
          e-mail
          <input
            type="text"
            id="email"
            placeholder="john@doe.com"
            value={emailValue}
            onChange={handleChange}
          />
        </label>
        <label>
          password
          <input
            type="text"
            id="password"
            placeholder={
              "\u2981\u2981\u2981\u2981\u2981\u2981\u2981\u2981\u2981\u2981"
            }
            value={passwordValue}
            onChange={handleChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
