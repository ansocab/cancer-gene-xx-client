import { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { SessionContext } from "../Helpers/session";

export default function Profile() {
  const history = useHistory();
  const { session } = useContext(SessionContext);

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
            console.log(res);
          } else {
            console.log("Uuups - No user found");
            history.push("/");
          }
        })
        .catch((err) => console.log(err));
    };
    getUser();
  }, []);

  if (Object.keys(session).length !== 0) {
    return (
      <div style={{ margin: "20px" }}>
        <p>{`Welcome ${session.name}!`}</p>
        <p>This is your profile page</p>
      </div>
    );
  } else {
    return <div>Please login to access your profile</div>;
  }
}
