import "./Sidebar.scss";
import { slide as Menu } from "react-burger-menu";
import { Link } from "react-router-dom";

const Sidebar = ({
  teamId,
  userId,
  inviteHandler,
  logoutHandler,
  inviteIcon,
  logoutIcon,
  createIcon,
}) => {
  return (
    <div className="sidebar">
      <Menu>
        {teamId ? (
          <div className="sidebar__link" onClick={inviteHandler}>
            <img className="sidebar__icon" src={inviteIcon} alt="invite icon" />
            Invite a friend!
          </div>
        ) : (
          <Link className="sidebar__link" to={`/CreateTeam/${userId}`}>
            <img className="sidebar__icon" src={createIcon} alt="create icon" />
            Create Team
          </Link>
        )}
        <div className="sidebar__link" onClick={logoutHandler}>
          <img className="sidebar__icon" src={logoutIcon} alt="logout icon" />
          Logout
        </div>
      </Menu>
    </div>
  );
};

export default Sidebar;
