import { useEffect, useState } from "react"
import "./addUser.scss"
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
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

type PasswordFormData = {
  oldPassword: string
  newPassword: string
  confirmNewPassword: string
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
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [passwordModalError, setPasswordModalError] = useState<string | null>(
    null
  )
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [passwordFormData, setPasswordFormData] = useState<PasswordFormData>({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  })
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

  useEffect(() => {
    if (!modalOpen) {
      setPasswordModalOpen(false)
      setPasswordModalError(null)
      setPasswordFormData({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      })
    }
  }, [modalOpen])

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

  const passwordValidationError =
    passwordFormData.newPassword &&
    passwordFormData.newPassword.length < 6
      ? "New password must be at least 6 characters long."
      : passwordFormData.confirmNewPassword &&
          passwordFormData.newPassword !== passwordFormData.confirmNewPassword
        ? "New passwords do not match."
        : null

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
    setPasswordModalOpen(false)
    setPasswordModalError(null)
    setPasswordFormData({
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    })
  }

  const handlePasswordModalClose = () => {
    setPasswordModalOpen(false)
    setPasswordModalError(null)
    setPasswordFormData({
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    })
  }

  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    setPasswordFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!editData?._id || passwordValidationError) return

    const token = await getToken()
    setIsUpdatingPassword(true)
    setPasswordModalError(null)

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/${editData._id}/change-password`,
        {
          oldPassword: passwordFormData.oldPassword,
          password: passwordFormData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      toast.success("Password updated successfully!")
      setReload((prev) => !prev)
      handlePasswordModalClose()
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "An error occurred while updating the password."
      setPasswordModalError(message)
      toast.error(message)
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  return (
    <>
      <Modal open={modalOpen} onClose={handleClose}>
        <div className="app-modal add-user">
          <div className="app-modal__dialog app-modal__dialog--wide">
            <button
              type="button"
              className="app-modal__close"
              onClick={handleClose}
              aria-label="Close user modal"
            >
              <Close />
            </button>
            <div className="app-modal__header">
              <div className="app-modal__eyebrow">
                {editData ? "User settings" : "New user"}
              </div>
              <h1>{editData ? "Edit User" : "Add New User"}</h1>
            </div>
            <form onSubmit={handleSubmit} className="app-modal__form">
              <div className="app-modal__body">
                <div className="app-modal__grid">
                  {updatedColumns
                    .filter((item) => item.field !== "id")
                    .map((column) => {
                      const isWide = column.control === "file"

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
                                  <label className="app-modal__label" htmlFor="user-image">
                                    Upload Image
                                  </label>
                                  <p className="app-modal__hint">
                                    Optional profile image for the user card and
                                    admin views.
                                  </p>
                                  <div className="app-modal__file">
                                    <input
                                      className="app-modal__file-input"
                                      type="file"
                                      name={column.field}
                                      onChange={handleImageChange}
                                      id="user-image"
                                      accept="image/*"
                                    />
                                    <label
                                      className="app-modal__file-label"
                                      htmlFor="user-image"
                                    >
                                      <span className="app-modal__file-eyebrow">
                                        User image
                                      </span>
                                      <strong>Choose image</strong>
                                      <span className="app-modal__file-caption">
                                        Pick a clear profile picture or avatar.
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
                                          alt="User preview"
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
                            case "password":
                              return (
                                <>
                                  <label className="app-modal__label" htmlFor={column.field}>
                                    {column.headerName}
                                  </label>
                                  <input
                                    id={column.field}
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
                                    <p className="add-user__inline-error">
                                      {passwordError}
                                    </p>
                                  )}
                                  {column.field === "confirmPassword" &&
                                    confirmPasswordError && (
                                      <p className="add-user__inline-error">
                                        {confirmPasswordError}
                                      </p>
                                    )}
                                </>
                              )
                            case "select":
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
                                    <option value="">Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                  </select>
                                </>
                              )
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
                <div className="app-modal__actions add-user__actions">
                  {editData && (
                    <button
                      type="button"
                      className="app-modal__ghost"
                      onClick={() => setPasswordModalOpen(true)}
                    >
                      Change Password
                    </button>
                  )}
                  <button
                    type="submit"
                    className="app-modal__submit"
                    disabled={
                      !editData
                        ? !!passwordError ||
                          !!confirmPasswordError ||
                          !formData.password ||
                          !formData.confirmPassword
                        : false
                    }
                  >
                    {editData ? "Update User" : "Create User"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Modal>

      <Modal open={passwordModalOpen} onClose={handlePasswordModalClose}>
        <div className="app-modal add-user add-user--password">
          <div className="app-modal__dialog app-modal__dialog--compact">
            <button
              type="button"
              className="app-modal__close"
              onClick={handlePasswordModalClose}
              aria-label="Close password modal"
            >
              <Close />
            </button>
            <div className="app-modal__header">
              <div className="app-modal__eyebrow">Security</div>
              <h1>Change Password</h1>
              <p>
                Update the user password securely. The current password is
                required before the new one can be saved.
              </p>
            </div>
            <form onSubmit={handlePasswordUpdate} className="app-modal__form">
              <div className="app-modal__body">
                <div className="app-modal__grid app-modal__grid--single">
                  <div className="app-modal__field app-modal__field--wide">
                    <label className="app-modal__label" htmlFor="oldPassword">
                      Old Password
                    </label>
                    <input
                      id="oldPassword"
                      type="password"
                      name="oldPassword"
                      placeholder="Enter old password"
                      value={passwordFormData.oldPassword}
                      onChange={handlePasswordInputChange}
                      required
                    />
                  </div>
                  <div className="app-modal__field app-modal__field--wide">
                    <label className="app-modal__label" htmlFor="newPassword">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      name="newPassword"
                      placeholder="Enter new password"
                      value={passwordFormData.newPassword}
                      onChange={handlePasswordInputChange}
                      required
                    />
                  </div>
                  <div className="app-modal__field app-modal__field--wide">
                    <label
                      className="app-modal__label"
                      htmlFor="confirmNewPassword"
                    >
                      Confirm New Password
                    </label>
                    <input
                      id="confirmNewPassword"
                      type="password"
                      name="confirmNewPassword"
                      placeholder="Confirm new password"
                      value={passwordFormData.confirmNewPassword}
                      onChange={handlePasswordInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="app-modal__footer">
                {passwordValidationError && (
                  <p className="app-modal__error">{passwordValidationError}</p>
                )}
                {passwordModalError && (
                  <p className="app-modal__error">{passwordModalError}</p>
                )}
                <button
                  type="submit"
                  className="app-modal__submit"
                  disabled={
                    isUpdatingPassword ||
                    !!passwordValidationError ||
                    !passwordFormData.oldPassword ||
                    !passwordFormData.newPassword ||
                    !passwordFormData.confirmNewPassword
                  }
                >
                  {isUpdatingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default AddUser
