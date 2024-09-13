import { useEffect, useState } from "react"
import "./addHouse.scss"
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Button } from "../Button"
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
      setFormData((prev) => ({ ...prev, image: file }))
      setImagePreview(URL.createObjectURL(file))
    }
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
      <div className="add-house">
        <div className="modal-house">
          <span className="close" onClick={handleClose}>
            <CloseRounded />
          </span>
          <h1>{editData ? "Edit House" : "Add New House"}</h1>
          <form onSubmit={handleSubmit}>
            {columns
              .filter((item) => item.field !== "id")
              .map((column) => (
                <div className="item" key={column.field}>
                  {(() => {
                    switch (column.control) {
                      case "text":
                        return (
                          <input
                            type={column.type === "number" ? "number" : "text"}
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
                            />
                            <label
                              style={{ marginTop: "10px" }}
                              htmlFor="imageUpload"
                            >
                              Upload Image
                            </label>

                            {(imagePreview || editData?.image) && (
                              <div className="image-preview">
                                <img
                                  src={
                                    imagePreview
                                      ? imagePreview
                                      : editData?.image
                                      ? editData?.image
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
                      default:
                        return null
                    }
                  })()}
                </div>
              ))}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <Button type="submit" text={editData ? "Update" : "Create"} />
          </form>
        </div>
      </div>
    </Modal>
  )
}

export default AddHouse
