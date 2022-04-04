import "./Signup.scss";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Error from "../../Components/Error/Error";

const Signup = () => {
  const [formUsername, setFormUsername] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  let navigate = useNavigate();
  let params = useParams();

  const apiURL = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";

  useEffect(() => {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
    }
    return;
  }, []);

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
    return check.test(password);
  };

  const signupHandler = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const team_id = params.id || null;

    if (username && email && password) {
      if (passwordCheck(password)) {
        setPasswordValid(true);
      }

      axios
        .post(`${apiURL}/testUsername`, { username })
        .then((res) => {
          console.log(res.data);
          if (res.data.isUsed) {
            setUsernameAvailable(false);
          } else {
            setUsernameAvailable(true);
          }
        })
        .then(() => {
          axios
            .get(`https://www.disify.com/api/email/${email}`)
            .then((res) => {
              const { format, disposable, dns } = res.data;
              if (format && !disposable && dns) {
                console.log(usernameAvailable);
                setEmailValid(true);
                if (passwordValid) {
                  axios
                    .post(`${apiURL}/signup`, {
                      username,
                      email,
                      password,
                      team_id,
                    })
                    .then(() => {
                      navigate("/Login");
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }
              } else {
                setEmailValid(false);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <section className="signup">
      <form className="signup__form" onSubmit={signupHandler}>
        <h1 className="signup__heading">Friendle</h1>
        <h2 className="signup__subheading">Sign Up</h2>
        <div className="signup__input-container">
          <label htmlFor="username" className="signup__label">
            Username
            <input
              className={
                usernameAvailable
                  ? "signup__input"
                  : "signup__input signup__input--error"
              }
              id="username"
              type="text"
              name="username"
              placeholder="WordleKing23"
              value={formUsername}
              onChange={handleUsernameChange}
            />
          </label>
          {usernameAvailable || <Error msg={"Username is taken or empty"} />}
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
          {emailValid || <Error msg={"Email is invalid"} />}
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
          {passwordValid || (
            <Error
              msg={
                "Minimum eight characters, at least one letter, one number, and one special character"
              }
            />
          )}
        </div>
        <button className="signup__signup-button">Signup</button>
      </form>
      <div className="signup__login-container">
        <Link className="signup__login-link" to="/Login">
          Already have an account?
        </Link>
      </div>
    </section>
  );
};

export default Signup;
