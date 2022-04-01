import "./CreateTeam.scss";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const CreateTeam = () => {
  let navigate = useNavigate();
  let params = useParams();

  console.log(params);

  const createHandler = (e) => {
    e.preventDefault();
    const team_name = e.target.team.value;
    const user_id = params.id;
    console.log(team_name, user_id);
    axios
      .post("/createTeam", { team_name, user_id })
      .then((res) => {
        console.log(res.data);
        navigate("/TeamDashboard");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="create-team">
      <form className="create-team__form" onSubmit={createHandler}>
        <input
          className="create-team__input"
          type="text"
          name="team"
          placeholder="Team Name"
        />
        <button className="create-team__button">Create</button>
      </form>
    </div>
  );
};

export default CreateTeam;
