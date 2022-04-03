import "./Signup.scss";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

const Signup = () => {
  let navigate = useNavigate();
  let params = useParams();

  const apiURL = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";

  useEffect(() => {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
    }
    return;
  }, []);

  const signupHandler = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const team_id = params.id || null;

    axios.post(`${apiURL}/testUsername`, { username }).then((res) => {
      if (res.data.isUsed) {
        return alert("Username is taken!");
      }

      axios
        .get(`https://www.disify.com/api/email/${email}`)
        .then((res) => {
          const { format, disposable, dns } = res.data;
          if (format && !disposable && dns) {
            axios
              .post(`${apiURL}/signup`, {
                username,
                email,
                password,
                team_id,
              })
              .then((res) => {
                navigate("/Login");
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            alert("Please enter a valid email!");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
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
              className="signup__input"
              id="username"
              type="text"
              name="username"
              placeholder="WordleKing23"
            />
          </label>
          <label htmlFor="email" className="signup__label">
            Email
            <input
              className="signup__input"
              id="email"
              type="text"
              name="email"
              placeholder="example@example.com"
            />
          </label>
          <label htmlFor="password" className="signup__label">
            Password
            <input
              className="signup__input"
              id="password"
              type="password"
              name="password"
              placeholder="DF45$sbbt35hq?11"
            />
          </label>
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
