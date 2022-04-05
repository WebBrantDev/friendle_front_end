import "./CreateTeam.scss";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const CreateTeam = () => {
  let navigate = useNavigate();
  let params = useParams();

  const apiURL = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";

  const createHandler = (e) => {
    e.preventDefault();
    const team_name = e.target.team.value;
    const user_id = params.id;
    axios
      .post(
        `${apiURL}/createTeam`,
        { team_name, user_id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        navigate(`/TeamDashboard`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="create-team">
      <form className="create-team__form" onSubmit={createHandler}>
        <h1 className="create-team__heading">Create a team!</h1>
        <div className="create-team__input-container">
          <input
            className="create-team__input"
            type="text"
            name="team"
            placeholder="Team Name"
          />
        </div>
        <button className="create-team__button">Create</button>
      </form>
    </div>
  );
};

export default CreateTeam;
