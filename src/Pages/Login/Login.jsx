import "./Login.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Login = () => {
  let navigate = useNavigate();

  let [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (localStorage.getItem("token")) {
      axios
        .get("/teamDashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (isMounted) {
            setLoggedIn(true);
            navigate("/TeamDashboard");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

    return () => {
      isMounted = false;
    };
  });

  const loginCall = (email, password) => {
    if (email && password) {
      axios
        .post("/login", { email, password })
        .then((res) => {
          const { token } = res.data;
          localStorage.setItem("token", token);
        })
        .then(() => {
          navigate("/TeamDashboard");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const loginHandler = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    loginCall(email, password);
  };

  if (loggedIn) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="login">
        <form className="login__form" onSubmit={loginHandler}>
          <input
            className="login__input"
            type="text"
            name="email"
            placeholder="Email"
          />
          <input
            className="login__input"
            type="password"
            name="password"
            placeholder="Password"
          />
          <button className="login__login-button">Login</button>
        </form>
      </div>
    );
  }
};

export default Login;
