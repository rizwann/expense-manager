import { useEffect, useState } from "react"
import "./joinHouse.scss"
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Close } from "@mui/icons-material"
import { Modal } from "@mui/material"
import { useAuth } from "../../hooks/useAuth"
import { House } from "../../types"

interface IProps {
  columns: any[]
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>
  modalOpen: boolean
}

const JoinHouse: React.FC<IProps> = ({
  setModalOpen,
  setRefresh,
  modalOpen,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [code, setCode] = useState("")
  const [matchedHouse, setMatchedHouse] = useState<House | null>(null)
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const { getToken } = useAuth()

  useEffect(() => {
    if (!modalOpen) {
      setCode("")
      setMatchedHouse(null)
      setErrorMessage(null)
      setIsLookingUp(false)
      setIsJoining(false)
    }
  }, [modalOpen])

  const handleLookup = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault()
    const trimmedCode = code.trim()

    if (!trimmedCode) {
      setErrorMessage("Enter a house code to look up the house first.")
      setMatchedHouse(null)
      return
    }

    const token = await getToken()
    setIsLookingUp(true)
    setErrorMessage(null)

    try {
      const response = await axios.get<House>(
        `${import.meta.env.VITE_API_URL}/api/houses/${trimmedCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setMatchedHouse(response.data)
    } catch (error: any) {
      setMatchedHouse(null)
      if (error.response) {
        setErrorMessage(
          error.response.data.message ||
            "No house found for that code."
        )
      } else if (error.request) {
        setErrorMessage("No response from the server. Please try again later.")
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLookingUp(false)
    }
  }

  const handleJoin = async () => {
    if (!matchedHouse) return

    const token = await getToken()
    const formDataToSend = new FormData()
    formDataToSend.append("code", matchedHouse.code)
    setIsJoining(true)
    setErrorMessage(null)

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
      toast.success(`Request to join ${matchedHouse.description} sent successfully!`)
      setRefresh && setRefresh((prev) => !prev)
      setModalOpen(false)
      setCode("")
      setMatchedHouse(null)
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
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
      <div className="app-modal join-house">
        <div className="app-modal__dialog app-modal__dialog--compact">
          <button
            type="button"
            className="app-modal__close"
            onClick={() => setModalOpen(false)}
            aria-label="Close join house modal"
          >
            <Close />
          </button>
          <div className="app-modal__header">
            <div className="app-modal__eyebrow">House access</div>
            <h1>Join a House</h1>
            <p>
              Enter the invitation code first. Once the house is confirmed,
              send the join request from the second step.
            </p>
          </div>

          <form onSubmit={handleLookup} className="app-modal__form">
            <div className="app-modal__body">
              <div className="app-modal__grid app-modal__grid--single">
                <div className="app-modal__field app-modal__field--wide">
                  <label className="app-modal__label" htmlFor="join-house-code">
                    House code
                  </label>
                  <p className="app-modal__hint">
                    Ask a house admin for the code, then confirm the house name
                    before you request access.
                  </p>
                  <input
                    id="join-house-code"
                    type="text"
                    placeholder="Enter house code"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value)
                      setMatchedHouse(null)
                      setErrorMessage(null)
                    }}
                    required
                  />
                </div>

                {matchedHouse && (
                  <div className="app-modal__card app-modal__card--wide join-house__match">
                    <span className="join-house__match-eyebrow">House found</span>
                    <strong className="join-house__match-name">
                      {matchedHouse.description}
                    </strong>
                    <span className="join-house__match-code">
                      Code: {matchedHouse.code}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="app-modal__footer">
              {errorMessage && (
                <p className="app-modal__error">{errorMessage}</p>
              )}

              {matchedHouse ? (
                <div className="app-modal__actions">
                  <button
                    type="button"
                    className="app-modal__ghost"
                    onClick={() => {
                      setMatchedHouse(null)
                      setErrorMessage(null)
                    }}
                  >
                    Use Another Code
                  </button>
                  <button
                    type="button"
                    className="app-modal__submit"
                    onClick={handleJoin}
                    disabled={isJoining}
                  >
                    {isJoining ? "Joining..." : "Join House"}
                  </button>
                </div>
              ) : (
                <button
                  type="submit"
                  className="app-modal__submit"
                  disabled={isLookingUp}
                >
                  {isLookingUp ? "Checking..." : "Find House"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </Modal>
  )
}

export default JoinHouse
