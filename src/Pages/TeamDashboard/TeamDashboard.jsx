import { useEffect, useState } from "react";
import axios from "axios";
import "./TeamDashboard.scss";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { formatBackEnd, formatFrontEnd } from "../../helpers/formatEntry";

const TeamDashboard = () => {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [teamId, setTeamId] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [teamData, setTeamData] = useState("");

  const apiURL = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";
  const siteURL = process.env.REACT_APP_SITE_URL || "http://localhost:3000";

  let navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    let { value } = e.target.wordle;
    e.target.wordle.value = "";
    if (value) {
      value = value.split(" ");
      const game_day = value[1];
      const num_of_guesses = value[2][0];
      const guess_pattern = value.splice(4);
      const formattedData = formatBackEnd(
        game_day,
        num_of_guesses,
        guess_pattern,
        userId,
        teamId
      );
      axios
        .post(`${apiURL}/addEntry`, formattedData)
        .then(() => {
          axios
            .post(`${apiURL}/pullTeamData`, {
              team_id: teamId,
              user_id: userId,
            })
            .then((res) => {
              let sortedData = res.data.sort(
                (a, b) => a.created_at - b.created_at
              );
              setTeamData(sortedData);
              console.log(res.data);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const inviteHandler = (e) => {
    e.preventDefault();
    const url = `${siteURL}/Signup/${teamId}`;
    console.log(url);
    navigator.clipboard.writeText(url);
    alert("Copied link to clipboard!");
  };

  const logoutHandler = (e) => {
    e.preventDefault();
    setLoggedIn(false);
    localStorage.removeItem("token");
    navigate("/Login");
  };

  useEffect(() => {
    const serverURL =
      process.env.REACT_APP_SERVER_URL || "http://localhost:8080";
    if (!loggedIn) {
      axios
        .get(`${serverURL}/teamDashboard`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          const { username, id, team_id } = res.data.decoded;
          setUsername(username);
          setUserId(id);
          setTeamId(team_id);
          setLoggedIn(true);
          if (team_id) {
            axios
              .post(`${serverURL}/pullTeamData`, {
                team_id,
                user_id: id,
              })
              .then((res) => {
                let sortedData = res.data.sort(
                  (a, b) => a.created_at - b.created_at
                );
                setTeamData(sortedData);
                console.log(res.data);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loggedIn]);

  if (!localStorage.getItem("token")) {
    navigate("/");
  }

  return (
    <section className="team-dashboard">
      <div className="team-dashboard__header">
        <h1 className="team-dashboard__heading">{`Team ${username}!`}</h1>
        <div className="team-dashboard__cta-container">
          <button
            className="team-dashboard__secondary-button"
            onClick={logoutHandler}
          >
            Logout
          </button>
          {teamId ? (
            <button
              className="team-dashboard__secondary-button"
              onClick={inviteHandler}
            >
              Invite a friend!
            </button>
          ) : (
            <button
              className="team-dashboard__secondary-button"
              onClick={() => {
                navigate(`/CreateTeam/${userId}`);
              }}
            >
              Create Team
            </button>
          )}
        </div>
      </div>
      <form className="team-dashboard__entry-form" onSubmit={handleSubmit}>
        <input
          className="team-dashboard__input"
          type="text"
          name="wordle"
          placeholder="Put your Wordle data here"
        />
        <button className="team-dashboard__button">Submit</button>
      </form>
      {teamData ? (
        <div className="team-dashboard__entries-container">
          {teamData.map((entry) => {
            return (
              <div
                key={uuidv4()}
                className={
                  entry.username === username
                    ? "team-dashboard__entry-container team-dashboard__entry-container--right"
                    : "team-dashboard__entry-container"
                }
              >
                <p className="team-dashboard__user-data">{entry.game_day}</p>
                <p className="team-dashboard__user-data">
                  {entry.num_of_guesses}/6
                </p>
                <p className="team-dashboard__user-data">{entry.username}</p>
                <div className="team-dashboard__pattern-container">
                  {formatFrontEnd(entry.guess_pattern).map((line) => {
                    return <div key={uuidv4()}>{line}</div>;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        ""
      )}
    </section>
  );
};

export default TeamDashboard;
