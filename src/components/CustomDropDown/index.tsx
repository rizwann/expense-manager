import React, { useState } from "react"
import "./customDropdown.scss"
import { IUser } from "../../types"

interface CustomDropdownProps {
  options: IUser[]
  label: string
  name: string
  selectedValues: string[]
  setSelectedValues: (values: string[]) => void
disabled?: boolean
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  name,
  selectedValues,
  setSelectedValues,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => {
    if (options.length > 0) {
      setIsOpen(!isOpen)
    }
  }

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value))
    } else {
      setSelectedValues([...selectedValues, value])
    }
  }

  const selectedText =
    selectedValues.length > 0
      ? `${selectedValues.length} user${
          selectedValues.length > 1 ? "s" : ""
        } selected`
      : "All Members"

  return (
    <div className="custom-dropdown">
      <div className="dropdown-header" onClick={toggleDropdown}>
        <span>{selectedText}</span>
        <span className="toggle-icon">
          {isOpen ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 14L12 9L17 14"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 10L12 15L17 10"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <label key={option._id} className="dropdown-item">
              <input
                type="checkbox"
                name={name}
                value={option.username}
                checked={selectedValues.includes(option.username)}
                onChange={handleCheckboxChange}
                disabled={disabled}
              />
              {option.username}
            </label>
          ))}
        </div>
      )}
      {selectedValues.map((value) => (
        <input key={value} type="hidden" name={name} value={value} />
      ))}
    </div>
  )
}

export default CustomDropdown
