import { useState } from "react"
import "./joinHouse.scss"
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
  modalOpen: boolean
}

const JoinHouse: React.FC<IProps> = ({
  columns,
  setModalOpen,
  setRefresh,
  modalOpen,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState<{ [key: string]: any }>({})
  const {getToken} = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const token = await getToken()
    const formDataToSend = new FormData()
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key])
    })

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/houses/join-house`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      toast.success("Request to join the sent successfully!")

      setRefresh && setRefresh((prev) => !prev)
      setModalOpen(false)
      setFormData({})
    } catch (error: any) {
      if (error.response) {
        setErrorMessage(
          error.response.data.message ||
            "An error occurred while joining the house."
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
    setFormData({})
  }

  return (
    <Modal open={modalOpen} onClose={handleClose}>
      <div className="join-house">
        <div className="join-modal-house">
          <span className="close" onClick={handleClose}>
            <Close />
          </span>
          <h1>{"Join a House"}</h1>

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
                              setFormData((_prev) => ({
                                code: e.target.value,
                              }))
                            }
                            required
                          />
                        )
                      default:
                        return null
                    }
                  })()}
                </div>
              ))}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <Button type="submit" text={"Join House"} />
          </form>
        </div>
      </div>
    </Modal>
  )
}

export default JoinHouse
