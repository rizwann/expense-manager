import { useEffect, useState } from "react"
import "./addUser.scss"
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Button } from "../Button"
import { Close } from "@mui/icons-material"
import { Modal } from "@mui/material"
import { useAuth } from "../../hooks/useAuth"

interface IProps {
  columns: any[]
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>
  editData?: any // Data to be edited, if applicable
  modalOpen: boolean
}

const AddUser: React.FC<IProps> = ({
  columns,
  setModalOpen,
  setRefresh,
  editData,
  modalOpen,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null)
  const [formData, setFormData] = useState<{ [key: string]: any }>({})
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { getToken, setRefresh: setReload } = useAuth()
  const updatedColumns = editData
    ? columns.filter(
        (item) =>
          item.field !== "password" &&
          item.field !== "confirmPassword" &&
          item.field !== "gender"
      )
    : columns

  useEffect(() => {
    if (editData) {
      setFormData(editData)
      if (editData.image) {
        setImagePreview(editData.image)
      }
    }
  }, [editData])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
      setImagePreview(URL.createObjectURL(file))
    }
  }

  // Separate effect to validate passwords whenever they change
  useEffect(() => {
    const password = formData.password || ""
    const confirmPassword = formData.confirmPassword || ""

    if (password && password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.")
    } else if (password !== confirmPassword && confirmPassword) {
      setConfirmPasswordError("Passwords do not match.")
    } else {
      setPasswordError(null)
      setConfirmPasswordError(null)
    }
  }, [formData.password, formData.confirmPassword])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const token = await getToken()
    if (!editData && passwordError) return

    const formDataToSend = new FormData()
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key])
    })

    try {
      if (editData) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/user/${editData._id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        toast.success("User updated successfully!")
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/register`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        toast.success("User created successfully!")
      }
      setRefresh && setRefresh((prev) => !prev)
      setReload((prev) => !prev)
      setModalOpen(false)
      setFormData({})
      setImagePreview(null)
    } catch (error: any) {
      if (error.response) {
        setErrorMessage(
          error.response.data.message ||
            "An error occurred while saving the User."
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
    }
  }

  return (
    <Modal open={modalOpen} onClose={handleClose}>
      <div className="add-user">
        <div className="modal-user">
          <span className="close" onClick={handleClose}>
            <Close />
          </span>
          <h1>{editData ? "Edit User" : "Add New User"}</h1>
          <form onSubmit={handleSubmit}>
            {updatedColumns
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
                      case "password":
                        return (
                          <>
                            <input
                              type="password"
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
                            {column.field === "password" && passwordError && (
                              <p className="error-message">{passwordError}</p>
                            )}
                            {column.field === "confirmPassword" &&
                              confirmPasswordError && (
                                <p className="error-message">
                                  {confirmPasswordError}
                                </p>
                              )}
                          </>
                        )
                      case "select":
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
                            <option value="">Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                        )
                      default:
                        return null
                    }
                  })()}
                </div>
              ))}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <Button
              type="submit"
              text={editData ? "Update" : "Create"}
              disabled={
                !editData
                  ? !!passwordError ||
                    !!confirmPasswordError ||
                    !formData.password ||
                    !formData.confirmPassword
                  : false
              }
            />
          </form>
        </div>
      </div>
    </Modal>
  )
}

export default AddUser
