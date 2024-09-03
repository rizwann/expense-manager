import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import "./navbar.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { GridMenuIcon } from "@mui/x-data-grid";
import { Button } from "@mui/material";

interface IProps {
  toggleMenu: () => void;
}

const Navbar: React.FC<IProps> = ({ toggleMenu }) => {
  const { logout, user } = useAuth();
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const togglePreferences = () => {
    setIsPreferencesOpen(!isPreferencesOpen);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate logout delay
    logout(); // Call the actual logout function
    navigate("/login"); // Redirect to login or any other route
  };

  return (
    <div className="navbar">
      {isLoggingOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative flex flex-col items-center text-white">
            <img
              src="/logout-icon.svg" // Replace with your logout icon or robot image
              alt="Logging out"
              className="w-24 h-24 mb-4"
            />
            <div className="text-2xl animate-pulse">Logging out...</div>
          </div>
        </div>
      )}
      <div className="logo" onClick={toggleMenu}>
        <GridMenuIcon />
        <NavLink to={"/"}>Expense Manager</NavLink>
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
                ? user?.image
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
            <NavLink to={`/users/${user?._id}`}>
              <li>Profile</li>
            </NavLink>

            <li>About</li>
            <li onClick={handleLogout}>Sign Out</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
