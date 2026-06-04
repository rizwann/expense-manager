import React, { useEffect, useMemo, useState } from "react"
import "./addExpense.scss"
import { House, IUser } from "../../types"
import axios from "axios"
import {
  Collapse,
  Switch,
  Checkbox,
  FormControlLabel,
  Modal,
} from "@mui/material"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAuth } from "../../hooks/useAuth"
import { Close } from "@mui/icons-material"
import CreatableSelect from "react-select/creatable"
import Select, { components as selectComponents } from "react-select"
import { StylesConfig } from "react-select"
import {
  formatToLocalDatetime,
  normalizeCurrencyValue,
} from "../../utils/utils"

interface IProps {
  slug: string
  columns: any[]
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>
  editData?: any
  modalOpen: boolean
  re?: boolean
}

enum CategoryName {
  Other = "Other",
  Grocery = "Grocery",
  Restaurant = "Restaurant",
  Clothing = "Clothing",
  Entertainment = "Entertainment",
  Butcher = "Butcher",
  Travel = "Travel",
  Electronics = "Electronics",
  Furniture = "Furniture",
  Utilities = "Utilities",
  Health = "Health",
}

const Add: React.FC<IProps> = ({
  slug,
  columns,
  setModalOpen,
  setRefresh,
  editData,
  modalOpen,
}) => {
  const [houses, setHouses] = useState<House[]>([])
  const [houseUsers, setHouseUsers] = useState<IUser[]>([])
  const [selectCustomTime, setSelectCustomTime] = useState(false)
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [storeOptions, setStoreOptions] = useState<
    { value: string; label: string }[]
  >([])
  const [paidByMe, setPaidByMe] = useState(true)
  const [selectedPayer, setSelectedPayer] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState<{ [key: string]: any }>({})
  const [storeName, setStoreName] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false)
  const [useInlineSelectMenu, setUseInlineSelectMenu] = useState(false)

  const { user, getToken, setRecall } = useAuth()
  const userId = user?._id
  const modalTitle = editData ? `Edit ${slug}` : `Add New ${slug}`
  const submitButtonText = submitBtnDisabled
    ? editData
      ? "Updating..."
      : "Creating..."
    : editData
    ? "Update"
    : "Create"
  const selectThemeStyles = useMemo<
    StylesConfig<{ value: string; label: string }, boolean>
  >(
    () => ({
      control: (styles, state) => ({
        ...styles,
        backgroundColor: "var(--color-inputBg)",
        borderColor: state.isFocused
          ? "var(--color-primary)"
          : "var(--color-inputBorder)",
        color: "var(--color-text)",
        borderRadius: 16,
        boxShadow: state.isFocused
          ? `0 0 0 4px rgba(31, 111, 235, 0.14)`
          : styles.boxShadow,
        minHeight: 52,
        paddingInline: 4,
        "&:hover": {
          borderColor: "var(--color-primary)",
        },
      }),
      menu: (styles) => ({
        ...styles,
        backgroundColor: "var(--color-surface)",
        color: "var(--color-text)",
        border: `1px solid var(--color-border)`,
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 22px 48px rgba(0, 0, 0, 0.35)",
      }),
      option: (styles, { isFocused, isSelected }) => ({
        ...styles,
        backgroundColor: isSelected
          ? "var(--color-primary)"
          : isFocused
          ? "rgba(0, 106, 220, 0.15)"
          : "var(--color-surface)",
        color: isSelected ? "var(--color-button-text)" : "var(--color-text)",
      }),
      placeholder: (styles) => ({
        ...styles,
        color: "var(--color-muted)",
      }),
      menuPortal: (styles) => ({
        ...styles,
        zIndex: 1600,
      }),
      singleValue: (styles) => ({
        ...styles,
        color: "var(--color-text)",
      }),
      input: (styles) => ({
        ...styles,
        color: "var(--color-text)",
      }),
      multiValue: (styles) => ({
        ...styles,
        backgroundColor: "var(--color-primary)",
        color: "var(--color-button-text)",
        borderRadius: 999,
        paddingInline: 6,
      }),
      multiValueLabel: (styles) => ({
        ...styles,
        color: "var(--color-button-text)",
        fontWeight: 500,
      }),
      multiValueRemove: (styles) => ({
        ...styles,
        color: "var(--color-button-text)",
        ":hover": {
          backgroundColor: "transparent",
          color: "var(--color-button-text)",
        },
      }),
      dropdownIndicator: (styles) => ({
        ...styles,
        color: "var(--color-text)",
        "&:hover": {
          color: "var(--color-primary)",
        },
      }),
      clearIndicator: (styles) => ({
        ...styles,
        color: "var(--color-text)",
        "&:hover": {
          color: "var(--color-primary)",
        },
      }),
      indicatorSeparator: (styles) => ({
        ...styles,
        backgroundColor: "var(--color-inputBorder)",
      }),
      valueContainer: (styles) => ({
        ...styles,
        padding: "4px 10px",
      }),
      menuList: (styles) => ({
        ...styles,
        backgroundColor: "var(--color-surface)",
        paddingBlock: 6,
      }),
    }),
    []
  )
  const menuPortalTarget =
    typeof window !== "undefined" && !useInlineSelectMenu
      ? document.body
      : undefined

  useEffect(() => {
    if (typeof window === "undefined") return

    const updateMenuBehavior = () => {
      const visualViewport = window.visualViewport
      const viewportHeight = visualViewport?.height ?? window.innerHeight
      const layoutHeight = window.innerHeight
      const isMobileViewport = window.matchMedia("(max-width: 820px)").matches
      const isKeyboardOpen = layoutHeight - viewportHeight > 120

      setUseInlineSelectMenu(isMobileViewport && isKeyboardOpen)
    }

    updateMenuBehavior()

    window.addEventListener("resize", updateMenuBehavior)
    window.visualViewport?.addEventListener("resize", updateMenuBehavior)
    window.visualViewport?.addEventListener("scroll", updateMenuBehavior)

    return () => {
      window.removeEventListener("resize", updateMenuBehavior)
      window.visualViewport?.removeEventListener("resize", updateMenuBehavior)
      window.visualViewport?.removeEventListener("scroll", updateMenuBehavior)
    }
  }, [])


  useEffect(() => {
    const fetchHouses = async () => {
      const token = await getToken()
      const houseApi = `${import.meta.env.VITE_API_URL}/api/houses`
      const data = await axios.get<House[]>(houseApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setHouses(data.data)
    }

    fetchHouses()
  }, [])

  useEffect(() => {
    const fetchStoreNames = async () => {
      const token = await getToken()
      const storeApi = `${import.meta.env.VITE_API_URL}/api/stores/names`
      const data = await axios.get<string[]>(storeApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setStoreOptions(data.data.map((name) => ({ value: name, label: name })))
    }
    fetchStoreNames()
  }
  , [])

  useEffect(() => {
    if (selectedHouse) {
      const fetchHouseUsers = async () => {
      const token = await getToken()
        try {
          const res = await axios.get<IUser[]>(
            `${import.meta.env.VITE_API_URL}/api/user/house/${
              selectedHouse.code
            }`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          setHouseUsers(res.data)
        } catch (error) {
          console.error("Error fetching house users:", error)
        }
      }
      fetchHouseUsers()
    }
  }, [selectedHouse])

  useEffect(() => {
    if (editData) {
      setFormData(editData)
      setSelectedUsers(editData.involvedUsers || [])
      setPaidByMe(editData.paymentPerson === userId)
      setSelectedPayer(editData.paymentPerson || null)
      const selectedStoreName = editData.storeName
      setStoreName(selectedStoreName || "")
  
      const selectedHouse = houses.find(
        (house) => house.code === editData.houseCode
      )
      setSelectedHouse(selectedHouse || null)
  
      if (editData.receipt) {
        setImagePreview(editData.receipt)
      }
  
      // setting time
      if (editData.date) {
        setSelectCustomTime(true)
        setFormData((prev) => ({
          ...prev,
          date: new Date(editData.date).toISOString()
        }))
      }
    }
  }, [editData, houses, userId, modalOpen])
  

  useEffect(() => {
    if (editData && selectedHouse) {
      const fetchHouseUsers = async () => {
      const token = await getToken()
        try {
          const res = await axios.get<IUser[]>(
            `${import.meta.env.VITE_API_URL}/api/user/house/${
              selectedHouse.code
            }`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          setHouseUsers(res.data)
        } catch (error) {
          console.error("Error fetching house users:", error)
        }
      }
      fetchHouseUsers()
    }
  }, [editData, selectedHouse])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitBtnDisabled(true)
    const formDataToSend = new FormData(e.currentTarget)
    const data: any = {}
    const token = await getToken()
    let costValidationError: string | null = null

    formDataToSend.forEach((value, key) => {
      if (key === "cost") {
        const normalizedCost = normalizeCurrencyValue(String(value))

        if (!normalizedCost) {
          costValidationError =
            "Enter a valid cost. Examples: 12,50 or 17,212."
          return
        }

        data[key] = normalizedCost
      } else if (key === "date") {
        if (selectCustomTime) {
          const localDateTime = new Date(value as string)
          const utcDateTime = localDateTime.toISOString()
          data[key] = utcDateTime
        }
      } else {
        data[key] = value
      }
    })

    if (costValidationError) {
      setErrorMessage(costValidationError)
      toast.error(costValidationError)
      setSubmitBtnDisabled(false)
      return
    }

    data.involvedUsers = selectedUsers
    data.storeName = storeName
    data.paymentPerson = paidByMe ? userId : selectedPayer
    data.receipt = formData.receipt
    try {
      if (editData) {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/expenses/${editData._id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        toast.success("Expense updated successfully!")
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/expenses/create`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        toast.success("Expense created successfully!")
        setRecall((prev) => !prev)
      }
      setRefresh && setRefresh((prev) => !prev)
      setModalOpen(false)
      // Resetting the form data
      setFormData({})
      setSelectedUsers([])
      setSelectedPayer(null)
      setStoreName("")
      setSelectedHouse(null)
      setImagePreview(null)
      setSubmitBtnDisabled(false)
    } catch (error: any) {
      if (error.response) {
        setErrorMessage(
          error.response.data.message ||
            "An error occurred while saving the expense."
        )
      } else if (error.request) {
        setErrorMessage("No response from the server. Please try again later.")
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.")
      }
      toast.error(errorMessage)
      setSubmitBtnDisabled(false)
    }
  }
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview)
      }
      setFormData((prev) => ({ ...prev, receipt: file }))
      setImagePreview(URL.createObjectURL(file))
    }

    e.target.blur()
  }
  const handleCloseModal = () => {
    setModalOpen(false)
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
      setImagePreview(null)
    }
    if (!editData) {
      setFormData({})
      setSelectedUsers([])
      setSelectedPayer(null)
      setStoreName("")
      setSelectedHouse(null)
      setErrorMessage(null)
    }
  }
  const getFieldId = (field: string) => `expense-${field}`
  const getFieldLabel = (column: any) => {
    if (column.field === "storeName") return "Store"
    if (column.field === "house") return "House"
    if (column.field === "involvedUsers") return "Split with"
    if (column.control === "date") return "Payment details"
    if (column.control === "file") return "Receipt"
    return column.headerName || column.field
  }
  const getFieldHint = (column: any) => {
    if (column.field === "involvedUsers") {
      return "Choose everyone who should share this expense."
    }

    if (column.control === "date") {
      return "Set a custom timestamp or mark who paid."
    }

    if (column.control === "file") {
      return "Optional, but useful for records and verification."
    }

    return null
  }
  const isWideField = (column: any) =>
    column.field === "description" ||
    column.field === "storeName" ||
    column.field === "involvedUsers" ||
    column.control === "date" ||
    column.control === "file"
  const renderFieldControl = (column: any) => {
    const fieldId = getFieldId(column.field)

    switch (column.control) {
    case "text":
      if (column.field === "description") {
        return (
          <textarea
            id={fieldId}
            placeholder={column.headerName}
            name={column.field}
            value={formData[column.field] || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [column.field]: e.target.value,
              }))
            }
            rows={4}
            required
          />
        )
      }

      return (
        <input
          id={fieldId}
          type={
            column.field === "cost"
              ? "text"
              : column.type === "number"
              ? "number"
              : "text"
          }
          inputMode={
            column.field === "cost"
              ? "decimal"
              : column.type === "number"
              ? "decimal"
              : undefined
          }
          placeholder={column.headerName}
          name={column.field}
          value={formData[column.field] || ""}
          onChange={(e) =>
            setFormData((prev) => {
              if (column.field === "cost") {
                const nextValue = e.target.value
                const sanitizedValue = nextValue.replace(/[^\d.,\s\u00A0]/g, "")

                return {
                  ...prev,
                  [column.field]: sanitizedValue,
                }
              }

              return {
                ...prev,
                [column.field]: e.target.value,
              }
            })
          }
          required={
            column.field === "cost" || column.field === "description"
          }
        />
      )
    case "date":
      return (
        <div className="switch-grid">
          <div className="switch-card">
            {!editData ? (
              <FormControlLabel
                control={
                  <Switch
                    checked={selectCustomTime}
                    onChange={() => setSelectCustomTime(!selectCustomTime)}
                    inputProps={{
                      "aria-label": "Toggle custom time",
                    }}
                  />
                }
                label="Use custom time"
              />
            ) : (
              <p className="switch-card__title">Edit the saved date and time</p>
            )}
            <Collapse
              in={editData ? true : selectCustomTime}
              style={{ marginTop: "10px" }}
            >
              <input
                id={fieldId}
                type="datetime-local"
                placeholder={column.headerName}
                name={column.field}
                value={
                  formData[column.field]
                    ? formatToLocalDatetime(formData[column.field])
                    : ""
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [column.field]: e.target.value,
                  }))
                }
              />
            </Collapse>
          </div>

          {!editData && (
            <div className="switch-card">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={paidByMe}
                    onChange={() => setPaidByMe(!paidByMe)}
                    inputProps={{
                      "aria-label": "Toggle paid by me",
                    }}
                  />
                }
                label="I paid for this"
              />
              <Collapse in={!paidByMe} style={{ marginTop: "10px" }}>
                <select
                  id="expense-payment-person"
                  name="paymentPerson"
                  value={selectedPayer || ""}
                  onChange={(e) => setSelectedPayer(e.target.value)}
                  required={!paidByMe}
                >
                  <option value="" disabled>
                    Select payer
                  </option>
                  {houseUsers
                    .filter((u) => u._id !== userId)
                    .map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.username}
                      </option>
                    ))}
                </select>
              </Collapse>
            </div>
          )}
        </div>
      )
    case "file":
      return (
        <div className="receipt-upload">
          <input
            id={fieldId}
            className="receipt-upload__input"
            type="file"
            name={column.field}
            onChange={handleImageChange}
            accept="image/*"
            aria-label="Upload Receipt"
          />
          <label className="receipt-upload__label" htmlFor={fieldId}>
            <span className="receipt-upload__eyebrow">Attach image</span>
            <strong>Choose receipt photo</strong>
            <span className="receipt-upload__caption">
              JPG, PNG, HEIC and other mobile image formats are supported.
            </span>
          </label>

          {(imagePreview || editData?.receipt) && (
            <div className="image-preview">
              <img
                src={
                  imagePreview
                    ? imagePreview
                    : editData?.receipt
                    ? editData?.receipt
                    : "/app.svg"
                }
                alt="Receipt preview"
                onError={(
                  e: React.SyntheticEvent<HTMLImageElement, Event>
                ) => (e.currentTarget.src = "/app.svg")}
              />
            </div>
          )}
        </div>
      )
    case "select":
      if (column.field === "storeName") {
        return (
          <CreatableSelect<{ value: string; label: string }, false>
            inputId={fieldId}
            required
            options={storeOptions}
            onChange={(selectedOption) => {
              if (selectedOption) {
                setStoreName(selectedOption.value)
              } else {
                setStoreName("")
              }
            }}
            onCreateOption={(inputValue) => {
              const newOption = {
                value: inputValue,
                label: inputValue,
              }
              setStoreOptions((prevOptions) => [...prevOptions, newOption])
              setStoreName(inputValue)
            }}
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
            }}
            placeholder="Select or create a store"
            value={
              storeName
                ? storeOptions.find((option) => option.value === storeName) || {
                    value: storeName,
                    label: storeName,
                  }
                : null
            }
            styles={selectThemeStyles}
            classNamePrefix="expense-select"
            formatCreateLabel={(inputValue) => `Add Store "${inputValue}"`}
            menuPortalTarget={menuPortalTarget}
            menuPosition={useInlineSelectMenu ? "absolute" : "fixed"}
            menuPlacement="auto"
            menuShouldScrollIntoView={!useInlineSelectMenu}
          />
        )
      }

      if (column.field === "involvedUsers") {
        const OptionComponent = selectComponents.Option
        return (
          <Select<{ value: string; label: string }, true>
            inputId={fieldId}
            isMulti
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            options={houseUsers.map((member) => ({
              value: member.username,
              label: member.username,
            }))}
            value={selectedUsers.map((username) => ({
              value: username,
              label: username,
            }))}
            onChange={(selected) => {
              const values = Array.isArray(selected)
                ? selected.map((option) => option.value)
                : []
              setSelectedUsers(values)
            }}
            placeholder="Select members"
            styles={selectThemeStyles}
            classNamePrefix="expense-select"
            menuPortalTarget={menuPortalTarget}
            menuPosition={useInlineSelectMenu ? "absolute" : "fixed"}
            menuPlacement="auto"
            menuShouldScrollIntoView={!useInlineSelectMenu}
            components={{
              Option: (props) => (
                <OptionComponent {...props}>
                  <div className="multi-option">
                    <input
                      type="checkbox"
                      readOnly
                      checked={props.isSelected}
                      tabIndex={-1}
                      style={{ marginRight: 8 }}
                    />
                    <span>{props.label}</span>
                  </div>
                </OptionComponent>
              ),
            }}
          />
        )
      }

      if (column.field === "category") {
        return (
          <select
            id={fieldId}
            name={column.field}
            value={formData.category || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                category: e.target.value,
              }))
            }
            required
          >
            <option value="" disabled>
              Select category
            </option>
            {Object.values(CategoryName).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        )
      }

      if (column.field === "house") {
        return (
          <select
            id={fieldId}
            name="houseCode"
            value={selectedHouse?.code || ""}
            onChange={(e) => {
              const nextHouse = houses.find(
                (house) => house.code === e.target.value
              )
              setSelectedHouse(nextHouse || null)
            }}
            required
          >
            <option value="" disabled>
              Select house
            </option>
            {houses.map((house) => (
              <option key={house._id} value={house.code}>
                {house.description}
              </option>
            ))}
          </select>
        )
      }

      if (column.options?.length) {
        return (
          <select
            id={fieldId}
            name={column.field}
            value={formData[column.field] || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [column.field]: e.target.value,
              }))
            }
            required
          >
            <option value="" disabled>
              Select {column.headerName}
            </option>
            {column.options.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      }

      return null
    default:
      return null
    }
  }

  return (
    <Modal
      open={modalOpen}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="add-expense">
        <div className="modal-expense">
          <button
            type="button"
            className="close"
            onClick={handleCloseModal}
            aria-label="Close add expense modal"
          >
            <Close />
          </button>
          <div className="modal-expense__header">
            <div className="modal-expense__eyebrow">
              {editData ? "Expense editor" : "New expense"}
            </div>
            <h1 id="modal-modal-title">{modalTitle}</h1>
            <p id="modal-modal-description">
              Capture the amount, split, payment source, and receipt
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-content">
              <div className="item-container">
                {columns
                  .filter((item) => item.field !== "id")
                  .map((column) => {
                    return (
                      <div
                        className={`item ${isWideField(column) ? "item--wide" : ""}`}
                        key={column.field}
                      >
                        <label className="item__label" htmlFor={getFieldId(column.field)}>
                          {getFieldLabel(column)}
                        </label>
                        {getFieldHint(column) && (
                          <p className="item__hint">{getFieldHint(column)}</p>
                        )}
                        {renderFieldControl(column)}
                      </div>
                    )
                  })}
              </div>
            </div>

            <div className="form-actions">
              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}
              <button
                type="submit"
                className="submit-button"
                disabled={submitBtnDisabled}
              >
                {submitButtonText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  )
}

export default Add
