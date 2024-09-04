import React, { useState, useRef, useEffect } from "react"
import { useAuth } from "../../hooks/useAuth"
import "./navbar.scss"
import { NavLink, useNavigate } from "react-router-dom"
import { GridMenuIcon } from "@mui/x-data-grid"
import Menu from "../Menu"
import { TuneRounded } from "@mui/icons-material"

interface IProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Navbar: React.FC<IProps> = ({ setIsOpen }) => {
  const { logout, user } = useAuth()
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const navigate = useNavigate()
  const preferencesRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => {
    setIsOpen((prev) => !prev)
  }

  const togglePreferences = () => {
    setIsPreferencesOpen((prev) => !prev)
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate logout delay
    logout() // Call the actual logout function
    navigate("/login") // Redirect to login or any other route
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      preferencesRef.current &&
      !preferencesRef.current.contains(event.target as Node)
    ) {
      setIsPreferencesOpen(false)
    }
  }

  useEffect(() => {
    if (isPreferencesOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isPreferencesOpen])

  const handlePreferenceItemClick = () => {
    setIsPreferencesOpen(false)
  }

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
      <div className="logo">
        <GridMenuIcon onClick={toggleMenu} />
        <NavLink to={"/"}>Expense Manager</NavLink>
      </div>
      <div className="menu">
        <Menu />
      </div>
      <div className="icons">
        <div className="user">
          <img
            src={user?.image ? user?.image : "/noavatar.png"}
            alt="store"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
              (e.currentTarget.src = "/noavatar.png")
            }
          />
          <span>{user?.username}</span>
        </div>
        <TuneRounded
          onClick={togglePreferences}
          style={{ cursor: "pointer" }}
        />
      </div>

      {isPreferencesOpen && (
        <div className="preferences-popup" ref={preferencesRef}>
          <ul>
            <NavLink
              to={`/users/${user?._id}`}
              onClick={handlePreferenceItemClick}
            >
              <li>Profile</li>
            </NavLink>
            <NavLink to="/about" onClick={handlePreferenceItemClick}>
              <li>About</li>
            </NavLink>
            <li onClick={handleLogout}>Sign Out</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default Navbar
