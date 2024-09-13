import React, { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { menu } from "../../menu-item"
import { useAuth } from "../../hooks/useAuth"
import ClearIcon from "@mui/icons-material/Clear"
import "./menu.scss"
import { Device } from "@capacitor/device"

interface IProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const MobileMenu: React.FC<IProps> = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth()
  const [isIOSApp, setIsIOSApp] = useState(false)
  const isAdmin = user ? user.username === "RizwanKabir" : false

  useEffect(() => {
    const checkDevice = async () => {
      const info = await Device.getInfo()
      if (info.platform === "ios") {
        setIsIOSApp(true)
      } else {
        setIsIOSApp(false)
      }
    }
    checkDevice()
  }, [])


  const handleSwitchMenu = () => {
    setIsOpen((prev) => !prev)
  }

  if (!isOpen) return null

  return (
    <div className="mobile-menu" style={{
      paddingTop: isIOSApp ? "env(safe-area-inset-top)" : "20px",
    }}>
      <div className="close-icon" onClick={handleSwitchMenu}>
        <h1 className="text-2xl">Expense Manager</h1>
        <ClearIcon />
      </div>
      <div className="menu-items">
        {menu.map((item) => (
          <div className="item" key={item.id}>
            {!isAdmin && item.restricted ? null : (
              <NavLink
                to={item.url}
                className={({ isActive }) =>
                  `list-item ${isActive ? "active" : ""}`
                }
                onClick={handleSwitchMenu}
              >
                <img src={item.icon} alt={item.title} />
                <span className="list-item-title">{item.title}</span>
              </NavLink>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MobileMenu
