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
  const [gameDay, setGameDay] = useState("");

  let navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    let { value } = e.target.wordle;
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
        .post("/addEntry", formattedData)
        .then(() => {
          axios
            .post("/pullTeamData", {
              team_id: teamId,
              user_id: userId,
              game_day: gameDay,
            })
            .then((res) => {
              let sortedData = res.data.sort(
                (a, b) => a.created_at - b.created_at
              );
              setTeamData(sortedData);
              console.log(res.data);
              // console.log(teamId);
              // console.log(loggedIn);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const inviteHandler = (e) => {
    e.preventDefault();
    const url = `http://localhost:3000/Signup/${teamId}`;
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
    let isMounted = true;
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
    return () => {
      isMounted = false;
    };
  });

  useEffect(() => {
    if (!loggedIn) {
      axios
        .get("/teamDashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          // console.log("hello");
          const { username, id, team_id } = res.data.decoded;
          // console.log(id);
          setUsername(username);
          setUserId(id);
          setTeamId(team_id);
          setLoggedIn(true);
          axios
            .post("/pullTeamData", {
              team_id,
              user_id: id,
              game_day: gameDay,
            })
            .then((res) => {
              let sortedData = res.data.sort(
                (a, b) => a.created_at - b.created_at
              );
              setTeamData(sortedData);
              console.log(res.data);
              // console.log(teamId);
              // console.log(loggedIn);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loggedIn]);

  return (
    <div className="team-dashboard">
      <div className="team-dashboard__main">{`Welcome ${username}!`}</div>
      <button className="team-dashboard__button" onClick={logoutHandler}>
        Logout
      </button>
      {teamId ? (
        <button className="team-dashboard__button" onClick={inviteHandler}>
          Invite a friend!
        </button>
      ) : (
        <button
          className="team-dashboard__button"
          onClick={() => {
            navigate(`/CreateTeam/${userId}`);
          }}
        >
          Create Team
        </button>
      )}
      <form className="team-dashboard__entry-form" onSubmit={handleSubmit}>
        <input type="text" name="wordle" />
        <button>Submit</button>
      </form>
      {teamData ? (
        <div className="team-dashboard__entries-container">
          {teamData.map((entry) => {
            return (
              <div key={uuidv4()} className="team-dashboard__entry">
                <p>{entry.game_day}</p>
                <p>{entry.num_of_guesses}/6</p>
                <p>{entry.username}</p>
                {formatFrontEnd(entry.guess_pattern).map((line) => {
                  return <div key={uuidv4()}>{line}</div>;
                })}
                <p></p>
              </div>
            );
          })}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default TeamDashboard;
