import { Link } from "react-router-dom";
import "../../styles/auth.scss";

interface IProps {
  heading: string;
  paragraph?: string;
  linkName?: string;
  linkUrl?: string;
}

const Header: React.FC<IProps> = ({
  heading,
  paragraph,
  linkName,
  linkUrl = "#",
}) => {
  return (
    <div className="auth-header">
      <div className="auth-header__logo">
        <img alt="" src={import.meta.env.VITE_LOGO_URL} />
      </div>
      <h2 className="auth-header__title">{heading}</h2>
      {paragraph && linkName && (
        <p className="auth-header__subtitle">
          {paragraph}{" "}
          <Link to={linkUrl}>{linkName}</Link>
        </p>
      )}
    </div>
  );
};

export default Header;
