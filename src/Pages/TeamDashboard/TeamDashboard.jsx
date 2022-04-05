import { useEffect, useState } from "react";
import axios from "axios";
import "./TeamDashboard.scss";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { formatBackEnd, formatFrontEnd } from "../../helpers/formatEntry";
import toast from "react-hot-toast";
import Sidebar from "../../Components/Sidebar/Sidebar";
import logoutIcon from "../../assets/icons/logout-icon.png";
import inviteIcon from "../../assets/icons/invite-icon.png";
import createIcon from "../../assets/icons/create-team-icon.png";

const TeamDashboard = () => {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [teamId, setTeamId] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [teamData, setTeamData] = useState("");
  const [teamName, setTeamName] = useState("");
  const [currentGameDay, setCurrentGameDay] = useState("");
  const [dailyWord, setDailyWord] = useState("");

  const apiURL = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";
  const siteURL = process.env.REACT_APP_SITE_URL || "http://localhost:3000";

  let navigate = useNavigate();

  if (!localStorage.getItem("token")) {
    navigate("/");
  }

  const submitHandler = (e) => {
    e.preventDefault();
    let { value } = e.target.wordle;
    e.target.wordle.value = "";
    if (value && value.includes("Wordle")) {
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
              current_game_day: currentGameDay,
            })
            .then((res) => {
              let sortedData = res.data.sort(
                (a, b) => b.created_at - a.created_at
              );
              setTeamData(sortedData);
              toast("Entry added!", {
                icon: "👍",
                style: {
                  borderRadius: "24px",
                  background: "#FFFFEB",
                  color: "#423E3B",
                },
              });
            });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      toast.error("Please input some wordle data", {
        style: {
          borderRadius: "24px",
          background: "#FFFFEB",
          color: "#423E3B",
        },
      });
      return;
    }
  };

  const inviteHandler = (e) => {
    e.preventDefault();
    const url = `${siteURL}/Signup/${teamId}`;
    console.log(url);
    navigator.clipboard.writeText(url);
    toast("Copied to clipboard!", {
      icon: "👏",
      style: {
        borderRadius: "24px",
        background: "#FFFFEB",
        color: "#423E3B",
      },
    });
  };

  const logoutHandler = (e) => {
    e.preventDefault();
    setLoggedIn(false);
    localStorage.removeItem("token");
    toast.success("Logged out", {
      style: {
        borderRadius: "24px",
        background: "#FFFFEB",
        color: "#423E3B",
      },
    });
    navigate("/Login");
  };

  useEffect(() => {
    const serverURL =
      process.env.REACT_APP_SERVER_URL || "http://localhost:8080";
    if (!loggedIn) {
      console.log("running");
      axios
        .get(`${serverURL}/teamDashboard`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          console.log("running");
          const {
            username,
            id,
            team_id,
            team_name,
            daily_word,
            current_game_day,
          } = res.data;
          if (team_name) {
            setTeamName(team_name);
            setTeamId(team_id);
            setCurrentGameDay(current_game_day);
            setDailyWord(daily_word);
          }
          setUsername(username);
          setUserId(id);
          setLoggedIn(true);
          if (team_id) {
            axios
              .post(
                `${serverURL}/pullTeamData`,
                {
                  team_id,
                  user_id: id,
                  current_game_day,
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              )
              .then((res) => {
                let sortedData = res.data.sort(
                  (a, b) => b.created_at - a.created_at
                );
                setTeamData(sortedData);
              });
          }
        })
        .catch((err) => {
          console.log(err);
          navigate("/Login");
        });
    }
  }, [loggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="team-dashboard" id="outer-container">
      <Sidebar
        inviteHandler={inviteHandler}
        logoutHandler={logoutHandler}
        userId={userId}
        teamId={teamId}
        logoutIcon={logoutIcon}
        createIcon={createIcon}
        inviteIcon={inviteIcon}
        pageWrapId={"page-wrap"}
        outerContainerId={"outer-container"}
      />
      <div className="team-dashboard__wrapper" id="page-wrap">
        <div className="team-dashboard__header">
          <div className="team-dashboard__team-info-container">
            <h1 className="team-dashboard__heading">
              {teamName ? `${teamName}` : `${username}`}
            </h1>
            <div className="team-dashboard__cta-container">
              {teamId ? (
                <button
                  className="team-dashboard__secondary-button"
                  onClick={inviteHandler}
                >
                  <img
                    className="team-dashboard__icon"
                    src={inviteIcon}
                    alt="invite a friend icon"
                  />
                  Invite a friend!
                </button>
              ) : (
                <button
                  className="team-dashboard__secondary-button"
                  onClick={() => {
                    navigate(`/CreateTeam/${userId}`);
                  }}
                >
                  <img
                    className="team-dashboard__icon"
                    src={createIcon}
                    alt="create a team icon"
                  />
                  Create Team
                </button>
              )}
              <button
                className="team-dashboard__secondary-button"
                onClick={logoutHandler}
              >
                <img
                  className="team-dashboard__icon"
                  src={logoutIcon}
                  alt="logout icon"
                />
                Logout
              </button>
            </div>
          </div>
          <div className="team-dashboard__user-info-container">
            <p className="team-dashboard__user-info">User: {username}</p>
            <p className="team-dashboard__user-info">Daily word: {dailyWord}</p>
            <p className="team-dashboard__user-info">
              Current game day: {currentGameDay}
            </p>
          </div>
        </div>
        <form className="team-dashboard__entry-form" onSubmit={submitHandler}>
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
                  <div
                    className={
                      entry.username === username
                        ? "team-dashboard__user-data-container team-dashboard__user-data-container--right"
                        : "team-dashboard__user-data-container"
                    }
                  >
                    <p className="team-dashboard__user-data">
                      {entry.game_day}
                    </p>
                    <p className="team-dashboard__user-data">
                      {entry.num_of_guesses}/6
                    </p>
                    <p className="team-dashboard__user-data">
                      {entry.username}
                    </p>
                  </div>
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
      </div>
    </section>
  );
};

export default TeamDashboard;
