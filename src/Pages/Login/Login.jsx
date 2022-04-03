import "./Login.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Login = () => {
  let navigate = useNavigate();

  const apiURL = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";

  let [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (localStorage.getItem("token")) {
      axios
        .get(`${apiURL}/teamDashboard`, {
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

  const loginCall = (username, password) => {
    if (username && password) {
      console.log({ username, password });
      axios
        .post(`${apiURL}/login`, { username, password })
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
    const username = e.target.username.value;
    const password = e.target.password.value;

    loginCall(username, password);
  };

  if (loggedIn) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="login">
        <form className="login__form" onSubmit={loginHandler}>
          <h1 className="login__heading">Login</h1>
          <div className="login__input-container">
            <label className="login__label" htmlFor="username">
              Username
              <input
                className="login__input"
                id="username"
                type="text"
                name="username"
                placeholder="CoolGuy77"
              />
            </label>
            <label className="login__label" htmlFor="password">
              Password
              <input
                className="login__input"
                id="password"
                type="password"
                name="password"
                placeholder="517hkE$FGH!!dfg45"
              />
            </label>
          </div>
          <button className="login__login-button">Login</button>
        </form>
      </div>
    );
  }
};

export default Login;
