import "./Signup.scss";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

const Signup = () => {
  let navigate = useNavigate();
  let params = useParams();

  useEffect(() => {
    let isMounted = true;
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
    }
    return () => {
      isMounted = false;
    };
  });

  const signupHandler = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const team_id = params.id || null;

    axios.post("/testUsername", { username }).then((res) => {
      if (res.data.isUsed) {
        return alert("Username is taken!");
      }

      axios
        .get(`https://www.disify.com/api/email/${email}`)
        .then((res) => {
          const { format, disposable, dns } = res.data;
          if (format && !disposable && dns) {
            axios
              .post("/signup", {
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
    <div className="signup">
      <form className="signup__form" onSubmit={signupHandler}>
        <input
          className="signup__input"
          type="text"
          name="username"
          placeholder="Username"
        />
        <input
          className="signup__input"
          type="text"
          name="email"
          placeholder="Email"
        />
        <input
          className="signup__input"
          type="password"
          name="password"
          placeholder="Password"
        />
        <button className="signup__signup-button">Signup</button>
      </form>
      <div className="signup__text-container">
        <p className="signup__text">Already have an account?</p>
        <Link to="/Login">Log in</Link>
      </div>
    </div>
  );
};

export default Signup;
