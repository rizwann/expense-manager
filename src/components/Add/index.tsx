import { useEffect, useState } from "react"
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
import CustomDropdown from "../CustomDropDown"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAuth } from "../../hooks/useAuth"
import Button from "../../pages/components/Button"
import { Close } from "@mui/icons-material"
import React from "react"

interface IProps {
  slug: string
  columns: any[]
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>
  editData?: any // Data to be edited, if applicable
  modalOpen: boolean
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
  const [paidByMe, setPaidByMe] = useState(true)
  const [selectedPayer, setSelectedPayer] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState<{ [key: string]: any }>({})
  const [storeName, setStoreName] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false)


  const { user, getToken } = useAuth()
  const userId = user?._id


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
   if (!editData) {
      setFormData({})
      setSelectedUsers([])
      setSelectedPayer(null)
      setStoreName("")
      setSelectedHouse(null)
      setErrorMessage(null)
      setImagePreview(null)
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
          <form
            onSubmit={handleSubmit}
            style={{ display: "contents", marginTop: "20px" }}
          >
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
                                {!editData && (
                                  <div>
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={selectCustomTime}
                                          onChange={() =>
                                            setSelectCustomTime(
                                              !selectCustomTime
                                            )
                                          }
                                          inputProps={{
                                            "aria-label": "controlled",
                                          }}
                                        />
                                      }
                                      label="Custom Time"
                                    />
                                    <Collapse
                                      in={selectCustomTime}
                                      style={{ marginTop: "10px" }}
                                    >
                                      <input
                                        type="datetime-local"
                                        placeholder={column.headerName}
                                        name={column.field}
                                        value={formData[column.field] || ""}
                                        onChange={(e) =>
                                          setFormData((prev) => ({
                                            ...prev,
                                            [column.field]: e.target.value,
                                          }))
                                        }
                                      />
                                    </Collapse>
                                  </div>
                                )}
                                <div>
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
                                <div
                                  className="relative w-full"
                                >
                                  <input
                                    type="text"
                                    placeholder="Store Name"
                                    value={storeName}
                                    onChange={(e) => setStoreName(e.target.value)}
                                    className="w-full px-4 py-2 text-white bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                  />
                                  
                                </div>
                              )
                            } else if (column.field === "category") {
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
                                  {Object.values(CategoryName).map(
                                    (category) => (
                                      <option key={category} value={category}>
                                        {category}
                                      </option>
                                    )
                                  )}
                                </select>
                              )
                            } else if (column.field === "house") {
                              return (
                                <select
                                  name={"houseCode"}
                                  value={selectedHouse?.code || ""}
                                  onChange={(e) => {
                                    const selectedHouse = houses.find(
                                      (house) => house.code === e.target.value
                                    )
                                    setSelectedHouse(selectedHouse || null)
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
                            } else if (column.field === "involvedUsers") {
                              return (
                                <CustomDropdown
                                  options={houseUsers}
                                  label={column.headerName}
                                  name={column.field}
                                  selectedValues={selectedUsers}
                                  setSelectedValues={setSelectedUsers}
                                />
                              )
                            } else {
                              return null
                            }
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
