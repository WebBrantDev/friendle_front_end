import "./Signup.scss";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Error from "../../Components/Error/Error";
import logo from "../../assets/logos/friendle-main-logo.png";

const Signup = () => {
  const [formUsername, setFormUsername] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [dailyWord, setDailyWord] = useState("");

  let navigate = useNavigate();
  let params = useParams();

  const apiURL = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";

  useEffect(() => {
    let isMounted = true;
    if (localStorage.getItem("token")) {
      axios
        .get(`${apiURL}/teamDashboard`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then(() => {
          if (isMounted) {
            navigate("/TeamDashboard");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .get(`${apiURL}/getDailyWord`)
        .then((res) => {
          setDailyWord(res.data.dailyWord);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    return () => {
      isMounted = false;
    };
  });

  const handleUsernameChange = (e) => {
    setFormUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setFormEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setFormPassword(e.target.value);
    if (passwordCheck(e.target.value)) {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
    }
  };

  const passwordCheck = (password) => {
    const check =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (password.match(check)) {
      return true;
    } else {
      return false;
    }
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const team_id = params.id || null;

    if (!username || !password || !email) {
      setEmailValid(false);
      setUsernameAvailable(false);
      setPasswordValid(false);
    }

    if (username && email && password) {
      const testRes = await axios.post(`${apiURL}/testUsername`, {
        username,
      });
      const { isUsed } = testRes.data;
      if (!isUsed) {
        setUsernameAvailable(true);
        const disifyRes = await axios.get(
          `https://www.disify.com/api/email/${email}`
        );

        const { data: disifyData } = disifyRes;

        const { dns, format, disposable } = disifyData;

        if (format && !disposable && dns) {
          setEmailValid(true);
          if (passwordCheck(password)) {
            const signupRes = await axios.post(`${apiURL}/signup`, {
              username,
              email,
              password,
              team_id,
            });
            if (signupRes) {
              const loginRes = await axios
                .post(`${apiURL}/login`, { username, password })
                .then((res) => {
                  const { token } = res.data;
                  localStorage.setItem("token", token);
                  navigate("/TeamDashboard");
                  return res;
                })
                .catch((err) => {
                  console.log(err);
                  return err;
                });
              return loginRes;
            }

            return signupRes;
          } else {
            setPasswordValid(false);
          }
        } else {
          setEmailValid(false);
        }
      } else {
        setUsernameAvailable(false);
      }
    }
  };

  return (
    <section className="signup">
      <form className="signup__form" onSubmit={signupHandler}>
        <img className="signup__logo" src={logo} alt="Friendle logo" />
        <h2 className="signup__subheading">Sign Up</h2>
        <div className="signup__input-container">
          <label htmlFor="username" className="signup__label">
            Username
            <input
              className={`signup__input ${
                usernameAvailable ? "" : "signup__input--error"
              }`}
              id="username"
              type="text"
              name="username"
              placeholder="WordleKing23"
              value={formUsername}
              onChange={handleUsernameChange}
            />
          </label>
          {usernameAvailable ? null : (
            <Error msg={"Username is taken or empty"} />
          )}
          <label htmlFor="email" className="signup__label">
            Email
            <input
              className={
                emailValid
                  ? "signup__input"
                  : "signup__input signup__input--error"
              }
              id="email"
              type="text"
              name="email"
              placeholder="example@example.com"
              value={formEmail}
              onChange={handleEmailChange}
            />
          </label>
          {emailValid ? null : <Error msg={"Email is invalid"} />}
          <label htmlFor="password" className="signup__label">
            Password
            <input
              className={
                passwordValid
                  ? "signup__input"
                  : "signup__input signup__input--error"
              }
              id="password"
              type="password"
              name="password"
              placeholder="DF45$sbbt35hq?11"
              value={formPassword}
              onChange={handlePasswordChange}
            />
          </label>
          {passwordValid ? null : (
            <Error
              msg={
                "Minimum eight characters, at least one letter, one number, and one special character"
              }
            />
          )}
        </div>
        <button className="signup__signup-button">Signup</button>
      </form>
      <div className="signup__login-link-container">
        <Link className="signup__login-link" to="/Login">
          Already have an account?
        </Link>
        {dailyWord ? (
          <p className="signup__daily-word">Global starter: {dailyWord}</p>
        ) : (
          ""
        )}
      </div>
    </section>
  );
  //
};

export default Signup;
