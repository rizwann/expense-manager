import { useEffect, useState } from "react"
import "./addExpense.scss"
import { House, IUser, Store } from "../../types"
import axios from "axios"
import { Collapse, Switch, Checkbox, FormControlLabel, Select } from "@mui/material"
import CustomDropdown from "../CustomDropDown"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAuth } from "../../hooks/useAuth"
import Button from "../../pages/components/Button"
import { Close } from "@mui/icons-material"

interface IProps {
  slug: string
  columns: any[]
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>
  editData?: any // Data to be edited, if applicable
}

enum CategoryName {
  Other = "Other",
  Grocery = "Grocery",
  Restaurant = "Restaurant",
  Clothing = "Clothing",
  Entertainment = "Entertainment",
  Butcher = "Butcher",
}

const Add: React.FC<IProps> = ({
  slug,
  columns,
  setModalOpen,
  setRefresh,
  editData,
}) => {
  const [stores, setStores] = useState<Store[]>([])
  const [houses, setHouses] = useState<House[]>([])
  const [houseUsers, setHouseUsers] = useState<IUser[]>([])
  const [selectCustomTime, setSelectCustomTime] = useState(false)
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [paidByMe, setPaidByMe] = useState(true)
  const [selectedPayer, setSelectedPayer] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState<{ [key: string]: any }>({})
  const token = localStorage.getItem("token")
  const { user } = useAuth()
  const userId = user?._id

  useEffect(() => {
    const fetchStores = async () => {
      const storeApi = `${import.meta.env.VITE_API_URL}/api/stores`
      const data = await axios.get<Store[]>(storeApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setStores(data.data)
    }

    const fetchHouses = async () => {
      const houseApi = `${import.meta.env.VITE_API_URL}/api/houses`
      const data = await axios.get<House[]>(houseApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setHouses(data.data)
    }

    fetchStores()
    fetchHouses()
  }, [token])

  useEffect(() => {
    if (selectedHouse) {
      const fetchHouseUsers = async () => {
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
  }, [selectedHouse, token])

  useEffect(() => {
    if (editData) {
      setFormData(editData)
      setSelectedUsers(editData.involvedUsers || [])
      setPaidByMe(editData.paymentPerson === userId)
      setSelectedPayer(editData.paymentPerson || null)

      const selectedHouse = houses.find(
        (house) => house.code === editData.houseCode
      )
      setSelectedHouse(selectedHouse || null)
    }
  }, [editData, houses, userId])

  useEffect(() => {
    if (editData && selectedHouse) {
      const fetchHouseUsers = async () => {
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
  }, [editData, selectedHouse, token])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: any = {}
    formData.forEach((value, key) => {
      if (key === "date" && !selectCustomTime) {
        return null
      } else if (key === "involvedUsers") {
        data[key] = selectedUsers
      } else {
        data[key] = value
      }
    })

    data.paymentPerson = paidByMe ? userId : selectedPayer

    try {
      if (editData) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/expenses/${editData._id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
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
            },
          }
        )
        toast.success("Expense created successfully!")
      }
      setRefresh && setRefresh((prev) => !prev)
      setModalOpen(false)
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
    }
  }

  return (
    <div className="add-expense">
      <div className="modal-expense">
        <span className="close" onClick={() => setModalOpen(false)}>
          <Close />
        </span>
        <h1>{editData ? `Edit ${slug}` : `Add New ${slug}`}</h1>
        <form onSubmit={handleSubmit} style={{display:'contents', marginTop: "20px"}}>
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
                                          setSelectCustomTime(!selectCustomTime)
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
                        case "select":
                          if (column.field === "storeName") {
                            return (
                              <select
                                name={column.field}
                                value={formData.storeName || ""}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    storeName: e.target.value,
                                  }))
                                }
                                required
                              >
                                <option value="" disabled>
                                  Select Store
                                </option>
                                {stores.map((store) => (
                                  <option key={store._id} value={store.name}>
                                    {store.name}
                                  </option>
                                ))}
                              </select>
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
                                {Object.values(CategoryName).map((category) => (
                                  <option key={category} value={category}>
                                    {category}
                                  </option>
                                ))}
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

          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <Button type="submit" text={editData ? "Update" : "Create"} />
        </form>
      </div>
    </div>
  )
}

export default Add
