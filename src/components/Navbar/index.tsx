import { useAuth } from "../../hooks/useAuth";
import "./navbar.scss";

const Navbar: React.FC = () => {
  const { logout, user } = useAuth();
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="navbar">
      <div className="logo">
        <img src="logo.svg" alt="" />
        <span>Expense Manager</span>
      </div>
      <div className="icons">
        <img src="/search.svg" alt="" className="icon" />
        <img src="/app.svg" alt="" className="icon" />
        <img
          src="/expand.svg"
          alt=""
          className="icon"
          onClick={toggleFullscreen}
        />
        <div className="notification">
          <img src="/notifications.svg" alt="" />
          <span>1</span>
        </div>
        <div className="user">
          <img
            src="https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
            alt=""
          />
          <span>{user?.username}</span>
        </div>
        <img
          src="/settings.svg"
          alt=""
          className="icon"
          onClick={logout}
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
};

export default Navbar;
