import "./Error.scss";
import errorIcon from "../../assets/icons/error-icon.png";

const Error = ({ msg }) => {
  return (
    <div className="error">
      <img className="error__icon" src={errorIcon} alt="exclamation point" />
      <p className="error__text">{msg}</p>
    </div>
  );
};

export default Error;
