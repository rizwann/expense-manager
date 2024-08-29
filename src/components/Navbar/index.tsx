import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import "./navbar.scss";
import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => {
  const { logout, user } = useAuth();
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const togglePreferences = () => {
    setIsPreferencesOpen(!isPreferencesOpen);
  };

  return (
    <div className="navbar">
      <div className="logo">
        <img src="logo.svg" alt="" />
        <span>Expense Manager</span>
      </div>
      <div className="icons">
        <div className="notification">
          <img src="/notifications.svg" alt="" />
          <span>1</span>
        </div>
        <div className="user">
          <img
            src={
              user?.image
                ? `${import.meta.env.VITE_API_URL}/${user?.image}`
                : "/noavatar.png"
            }
            alt="store"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
              (e.currentTarget.src = "/noavatar.png")
            }
          />
          <span>{user?.username}</span>
        </div>
        <img
          src="/settings.svg"
          alt=""
          className="icon"
          onClick={togglePreferences}
          style={{ cursor: "pointer" }}
        />
      </div>

      {isPreferencesOpen && (
        <div className="preferences-popup">
          <ul>
            <li>
              <NavLink to={`/users/${user?._id}`}>Profile</NavLink>
            </li>
            <li>About</li>
            <li onClick={logout}>Sign Out</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
