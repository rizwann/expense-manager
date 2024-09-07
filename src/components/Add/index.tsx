import { useEffect, useRef, useState } from "react"
import "./addExpense.scss"
import { House, IUser, Store } from "../../types"
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
  Utilities = "Utilities",
  Health = "Health",
}

const Add: React.FC<IProps> = ({
  slug,
  columns,
  setModalOpen,
  setRefresh,
  editData,
  modalOpen
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
  const [filteredStores, setFilteredStores] = useState<Store[]>([])
  const [selectedStore, setSelectedStore] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const token = localStorage.getItem("token")
  const { user } = useAuth()
  const userId = user?._id
  const containerRef = useRef<HTMLDivElement>(null) // Explicitly typing the ref
  // Ref for the dropdown container

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

  // Filter stores based on search term
  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = stores.filter((store) =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredStores(filtered)
      // setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }, [searchTerm, stores])

  const handleStoreSelect = (storeId: string, storeName: string) => {
    setSelectedStore(storeId)
    setSearchTerm(storeName) // Set the searchTerm to the store name when selected
    setShowSuggestions(false) // Hide the suggestions after selection
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Ensure containerRef.current is defined and not null
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false) // Close suggestions when clicking outside
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])
  
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
      const selectedStoreName = editData.storeName
      setSearchTerm(selectedStoreName || "")

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

    data.storeId = selectedStore
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
      // Reset the form data
      setFormData({})
      setSelectedUsers([])
      setSelectedPayer(null)
      setSearchTerm("")
      setSelectedStore(null)
      setSelectedHouse(null)
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
    <Modal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
    <div className="add-expense">
      <div className="modal-expense">
        <span className="close" onClick={() => setModalOpen(false)}>
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
                              <div
                                className="relative w-full"
                                ref={containerRef}
                              >
                                <input
                                  type="text"
                                  placeholder="Search Store..."
                                  value={searchTerm}
                                  onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                  }
                                  onFocus={() => setShowSuggestions(true)}
                                  className="w-full px-4 py-2 text-white bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {showSuggestions &&
                                  filteredStores.length > 0 && (
                                    <ul className="absolute z-10 w-full gap-1 mt-1 overflow-y-auto bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-60">
                                      {filteredStores.map((store) => (
                                        <li
                                          key={store._id}
                                          onClick={() => {
                                            setShowSuggestions(false)
                                            handleStoreSelect(
                                              store._id,
                                              store.name
                                            )
                                          }}
                                          className="flex items-center gap-2 px-4 py-2 text-white cursor-pointer hover:bg-gray-700"
                                        >
                                          <img
                                            src={store.image || "/app.svg"}
                                            alt={store.name}
                                            className="w-8 h-8 rounded-full"
                                          />
                                          <div className="text-xs">
                                            {store.name.length > 9 ? store.name.substring(0, 9) + "..." : store.name}
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
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
    </Modal>
  )
}

export default Add
