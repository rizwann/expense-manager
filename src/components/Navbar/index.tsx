import React, { useState, useRef, useEffect } from "react"
import { useAuth } from "../../hooks/useAuth"
import "./navbar.scss"
import { NavLink, useNavigate } from "react-router-dom"
import { GridMenuIcon } from "@mui/x-data-grid"
import Menu from "../Menu"
import { Device } from "@capacitor/device"
import { Button } from "@mui/material"
import Add from "../Add"
import { config } from "../../utils/config"
import useMediaQuery from "../../hooks/userMediaQuery"

interface IProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Navbar: React.FC<IProps> = ({ setIsOpen }) => {
  const { logout, user, setRefresh } = useAuth()
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isIOSApp, setIsIOSApp] = useState(false)
  const [showDownloadApp, setShowDownloadApp] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const navigate = useNavigate()
  const preferencesRef = useRef<HTMLDivElement>(null)
  const showText = useMediaQuery(795)

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
    const checkDevice = async () => {
      const info = await Device.getInfo()
      if (info.platform === "ios") {
        setIsIOSApp(true)
      } else {
        setIsIOSApp(false)
      }

      if (info.platform === "web") {
        setShowDownloadApp(true)
      } else {
        setShowDownloadApp(false)
      }
    }
    checkDevice()
  }, [])

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
    <div
      className="navbar"
      style={{
        paddingTop: isIOSApp ? "env(safe-area-inset-top)" : "20px",
      }}
    >
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
          <div className="add-btn">
            <Button
              variant="outlined"
              onClick={() => setModalOpen(true)}
              style={{
                color: "white",
                borderColor: "white",
                borderRadius: "20px",
                padding: "5px 20px",
                fontSize: "14px",
                textTransform: "capitalize",
                marginRight: "10px",
              }}
              sx={{
                backgroundColor: showText ? "transparent" : "#8a3ff3",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            >
              {!showText ? "Add Expense" : 
              // transparen plus icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-plus"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M8 1.5a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5zM1.5 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5z"
                />
              </svg>
              
              }
            </Button>
          </div>
          <span>{user?.username}</span>
          <img
            src={user?.image ? user?.image : "/noavatar.png"}
            alt="store"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
              (e.currentTarget.src = "/noavatar.png")
            }
            onClick={togglePreferences}
            style={{ cursor: "pointer" }}
            className=" ring-2 ring-black-300"
          />
        </div>
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
            {showDownloadApp && (
              <NavLink to="/app-download" onClick={handlePreferenceItemClick}>
                <li>Download App</li>
              </NavLink>
            )}
            <li onClick={handleLogout}>Sign Out</li>
          </ul>
        </div>
      )}
      <Add
          setModalOpen={setModalOpen}
          slug="Expense"
          columns={config.expenseFields}
          setRefresh={setRefresh}
          modalOpen={modalOpen}
        />
    </div>
  )
}

export default Navbar
