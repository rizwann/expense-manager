import { useEffect, useState } from "react"
import "./addHouse.scss"
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { CloseRounded } from "@mui/icons-material"
import { Modal } from "@mui/material"
import { useAuth } from "../../hooks/useAuth"

interface IProps {
  columns: any[]
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>
  editData?: any // Data to be edited, if applicable
  modalOpen: boolean
}

const AddHouse: React.FC<IProps> = ({
  columns,
  setModalOpen,
  setRefresh,
  editData,
  modalOpen,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState<{ [key: string]: any }>({})
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { getToken } = useAuth()

  useEffect(() => {
    if (editData) {
      setFormData(editData)
      if (editData.image) {
        setImagePreview(editData.image)
      }
    }
  }, [editData, modalOpen])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview)
      }
      setFormData((prev) => ({ ...prev, image: file }))
      setImagePreview(URL.createObjectURL(file))
    }

    e.target.blur()
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const token = await getToken()
    const formDataToSend = new FormData()
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key])
    })

    try {
      if (editData) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/houses/${editData._id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        toast.success("House updated successfully!")
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/houses/create`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        toast.success("House created successfully!")
      }
      setRefresh && setRefresh((prev) => !prev)
      setModalOpen(false)
      setFormData({})
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

  const handleClose = () => {
    setModalOpen(false)
    if (!editData) {
      setFormData({})
      setImagePreview(null)
    }
  }

  return (
    <Modal open={modalOpen} onClose={handleClose}>
      <div className="app-modal add-house">
        <div className="app-modal__dialog app-modal__dialog--medium">
          <button
            type="button"
            className="app-modal__close"
            onClick={handleClose}
            aria-label="Close add house modal"
          >
            <CloseRounded />
          </button>
          <div className="app-modal__header">
            <div className="app-modal__eyebrow">
              {editData ? "House settings" : "New house"}
            </div>
            <h1>{editData ? "Edit House" : "Add New House"}</h1>
            <p>
              Set house details
            </p>
          </div>
          <form onSubmit={handleSubmit} className="app-modal__form">
            <div className="app-modal__body">
              <div className="app-modal__grid">
                {columns
                  .filter((item) => item.field !== "id")
                  .map((column) => {
                    const isWide =
                      column.field === "description" || column.control === "file"

                    return (
                      <div
                        className={`app-modal__field ${isWide ? "app-modal__field--wide" : ""}`}
                        key={column.field}
                      >
                        {(() => {
                          switch (column.control) {
                          case "text":
                            return (
                              <>
                                <label className="app-modal__label" htmlFor={column.field}>
                                  {column.headerName}
                                </label>
                                <input
                                  id={column.field}
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
                                  required
                                />
                              </>
                            )
                          case "file":
                            return (
                              <>
                                <label className="app-modal__label" htmlFor="house-image">
                                  {column.headerName}
                                </label>
                                <p className="app-modal__hint">
                                  Optional. Add a house image that makes it easy
                                  to recognize in the app.
                                </p>
                                <div className="app-modal__file">
                                  <input
                                    className="app-modal__file-input"
                                    type="file"
                                    name={column.field}
                                    onChange={handleImageChange}
                                    id="house-image"
                                    accept="image/*"
                                  />
                                  <label
                                    className="app-modal__file-label"
                                    htmlFor="house-image"
                                  >
                                    <span className="app-modal__file-eyebrow">
                                      House image
                                    </span>
                                    <strong>Choose image</strong>
                                    <span className="app-modal__file-caption">
                                      Upload a cover or icon for the house.
                                    </span>
                                  </label>

                                  {(imagePreview || editData?.image) && (
                                    <div className="app-modal__preview">
                                      <img
                                        src={
                                          imagePreview
                                            ? imagePreview
                                            : editData?.image
                                            ? editData?.image
                                            : "/app.svg"
                                        }
                                        alt="House preview"
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
                              </>
                            )
                          case "select":
                            if (column.field === "timeZone") {
                              return (
                                <>
                                  <label className="app-modal__label" htmlFor={column.field}>
                                    {column.headerName}
                                  </label>
                                  <select
                                    id={column.field}
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
                                    <option value="">Select timezone</option>
                                    {column.options.map((option: any) => (
                                      <option
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                </>
                              )
                            }

                            if (column.field === "currency") {
                              return (
                                <>
                                  <label className="app-modal__label" htmlFor={column.field}>
                                    {column.headerName}
                                  </label>
                                  <select
                                    id={column.field}
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
                                    <option value="">Select currency</option>
                                    {column.options.map((option: any) => (
                                      <option
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.symbol} {option.label}
                                      </option>
                                    ))}
                                  </select>
                                </>
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
            </div>

            <div className="app-modal__footer">
              {errorMessage && (
                <p className="app-modal__error">{errorMessage}</p>
              )}
              <button type="submit" className="app-modal__submit">
                {editData ? "Update House" : "Create House"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  )
}

export default AddHouse
