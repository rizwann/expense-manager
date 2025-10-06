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
import Button from "../../pages/components/Button"
import { Close } from "@mui/icons-material"
import CreatableSelect from "react-select/creatable"
import { StylesConfig } from "react-select"
import { formatToLocalDatetime } from "../../utils/utils"

interface IProps {
  slug: string
  columns: any[]
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>
  editData?: any // Data to be edited, if applicable
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


  const { user, getToken, setRecall } = useAuth()
  const userId = user?._id
  const selectThemeStyles = useMemo<StylesConfig<{ value: string; label: string }, boolean>>(
    () => ({
      control: (styles, state) => ({
        ...styles,
        backgroundColor: "var(--color-inputBg)",
        borderColor: state.isFocused
          ? "var(--color-primary)"
          : "var(--color-inputBorder)",
        color: "var(--color-text)",
        boxShadow: state.isFocused
          ? `0 0 0 1px var(--color-primary)`
          : styles.boxShadow,
        minHeight: 44,
        "&:hover": {
          borderColor: "var(--color-primary)",
        },
      }),
      menu: (styles) => ({
        ...styles,
        backgroundColor: "var(--color-surface)",
        color: "var(--color-text)",
        border: `1px solid var(--color-border)`
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
        backgroundColor: "rgba(0, 106, 220, 0.15)",
        color: "var(--color-text)",
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
        padding: "2px 8px",
      }),
      menuList: (styles) => ({
        ...styles,
        backgroundColor: "var(--color-surface)",
      }),
    }),
    []
  )


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
  
      // 👉 ADD this for setting time
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

    Object.keys(formDataToSend).forEach((key) => {
      formDataToSend.append(key, formDataToSend[key])
    })
    formDataToSend.forEach((value, key) => {
      if (key === "date") {
        if (selectCustomTime) {
          const localDateTime = new Date(value as string)
          const utcDateTime = localDateTime.toISOString()
          data[key] = utcDateTime
        }
      } else if (key === "involvedUsers") {
        data[key] = selectedUsers
      } else {
        data[key] = value
      }
    })

    data.storeName = storeName
    data.paymentPerson = paidByMe ? userId : selectedPayer
    data.receipt = formData.receipt
    try {
      if (editData) {
        console.log("henda,", editData, data)
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
      // Reset the form data
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
      setFormData((prev) => ({ ...prev, receipt: file }))
      setImagePreview(URL.createObjectURL(file))
    }
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
  

  return (
    <Modal
      open={modalOpen}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="add-expense">
        <div className="modal-expense">
          <span className="close" onClick={handleCloseModal}>
            <Close />
          </span>
          <h1>{editData ? `Edit ${slug}` : `Add New ${slug}`}</h1>
          <form onSubmit={handleSubmit}>
            <div className="item-container">
              {columns
                .filter((item) => item.field !== "id")
                .map((column) => {
                  return (
                    <div className="item" key={column.field}>
                      {(() => {
                        switch (column.control) {
                          case "text":
                            return (
                              <input
                                type={
                                  column.type === "number" ? "number" : "text"
                                }
                                placeholder={column.headerName}
                                name={column.field}
                                value={formData[column.field] || ""}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    [column.field]: e.target.value,
                                  }))
                                }
                                required={
                                  column.field === "cost" ||
                                  column.field === "description"
                                }
                              />
                            )
                          case "date":
                            return (
                              <div className="switch-container">
                                <div>
                                  {!editData && <FormControlLabel
                                    control={
                                      <Switch
                                        checked={selectCustomTime}
                                        onChange={() =>
                                          setSelectCustomTime(!selectCustomTime)
                                        }
                                        inputProps={{
                                          "aria-label": "controlled",
                                        }}
                                      />
                                    }
                                    label="Custom Time"
                                  />}
                                  <Collapse
                                    in={selectCustomTime}
                                    style={{ marginTop: "10px" }}
                                  >
                                    <input
                                      type="datetime-local"
                                      placeholder={column.headerName}
                                      name={column.field}
                                      value={
                                        formData[column.field]
                                          ? formatToLocalDatetime(
                                              formData[column.field]
                                            )
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
                                    <div className="item">
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            checked={paidByMe}
                                            onChange={() =>
                                              setPaidByMe(!paidByMe)
                                            }
                                            inputProps={{
                                              "aria-label": "controlled",
                                            }}
                                          />
                                        }
                                        label="Paid by me"
                                      />
                                      <Collapse in={!paidByMe}>
                                        <select
                                          name="paymentPerson"
                                          value={selectedPayer || ""}
                                          onChange={(e) =>
                                            setSelectedPayer(e.target.value)
                                          }
                                          required={!paidByMe}
                                        >
                                          <option value="" disabled>
                                            Select Payer
                                          </option>
                                          {houseUsers
                                            .filter((u) => u._id !== userId)
                                            .map((user) => (
                                              <option
                                                key={user._id}
                                                value={user._id}
                                              >
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
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexDirection: "column",
                                }}
                              >
                                <input
                                  type="file"
                                  name={column.field}
                                  onChange={handleImageChange}
                                  id="imageUpload"
                                  //only image
                                  accept="image/*"
                                  aria-label="Upload Receipt"
                                />
                                <label
                                  style={{ marginTop: "10px" }}
                                  htmlFor="imageUpload"
                                >
                                  Upload Receipt
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
                                      alt="Image Preview"
                                      onError={(
                                        e: React.SyntheticEvent<
                                          HTMLImageElement,
                                          Event
                                        >
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
                                    setStoreOptions((prevOptions) => [
                                      ...prevOptions,
                                      newOption,
                                    ])
                                    setStoreName(inputValue)
                                  }}
                                  components={{
                                    DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  placeholder="Store Name"
                                  value={
                                    storeName
                                      ? storeOptions.find((option) => option.value === storeName) || {
                                          value: storeName,
                                          label: storeName,
                                        }
                                      : null
                                  }
                                  styles={selectThemeStyles}
                                  classNamePrefix="themed-select"
                                  formatCreateLabel={(inputValue) => `Add Store "${inputValue}"`}
                                />
                              )
                            }

                            if (column.field === "involvedUsers") {
                              return (
                                <CreatableSelect<{ value: string; label: string }, true>
                                  isMulti
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
                                  classNamePrefix="themed-select"
                                />
                              )
                            }

                            if (column.field === "category") {
                              return (
                                <select
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
                                    Select Category
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
                                  name="houseCode"
                                  value={selectedHouse?.code || ""}
                                  onChange={(e) => {
                                    const nextHouse = houses.find((house) => house.code === e.target.value)
                                    setSelectedHouse(nextHouse || null)
                                  }}
                                  required
                                >
                                  <option value="" disabled>
                                    Select House
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
                      })()}
                    </div>
                  )
                })}
            </div>

            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
            <Button type="submit" text={editData ? "Update" : "Create"} disabled={submitBtnDisabled} />
          </form>
        </div>
      </div>
    </Modal>
  )
}

export default Add
