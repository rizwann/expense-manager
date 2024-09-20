import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import 'react-medium-image-zoom/dist/styles.css';
import "./expenseDetail.scss"
import { useAuth } from "../../hooks/useAuth"
import { toast } from "react-toastify"
import Button from "../components/Button"
import { Expense } from "../../types"
import { config } from "../../utils/config"
import Add from "../../components/Add"
import Loading from "../../components/Loading"
import Toaster from "../../components/Toaster"
import { DownloadOutlined } from "@mui/icons-material";

const ExpenseDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [expense, setExpense] = useState<Expense | null>(null)
  const { user, getToken } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false);

  // Open modal in edit mode
  const openEditModal = () => {
    setModalOpen(true)
  }

  // Fetch the expense details by ID
  useEffect(() => {
    const fetchExpense = async () => {
      const token = await getToken()
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/expenses/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setExpense(response.data)
      } catch (error) {
        console.error("Error fetching expense:", error)
        toast.error("Failed to load expense details.")
      }
    }

    fetchExpense()
  }, [id, refresh])

  if (!expense) {
    return <Loading />
  }

  const isEditable = user?.username === expense.user


  const handleDownload = () => {
    if(!expense.receipt) {
      toast.error("No receipt found for this expense.");
    } else {
      fetch(expense.receipt, {
        method: 'GET',
        headers: {},
      })
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${expense.storeName}_${new Date(expense.date).toLocaleString(
            "en-DE",
            {
              month: "short",
              day: "numeric",
              year: "numeric",
            }
          )}.png`); // Set filename
          document.body.appendChild(link);
          link.click();
          link.remove();
        });
    }

  };

  return (
    <div className="expense-detail">
      <div className="expense-header">
        <button className="back-button" onClick={() => navigate("/expenses")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-arrow-left"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M8.707 12.707a1 1 0 0 0 0-1.414L5.414 8l3.293-3.293a1 1 0 0 0-1.414-1.414L4 7.586a2 2 0 0 0 0 2.828l3.293 3.293a1 1 0 0 0 1.414 0z"
            />
          </svg>
          <p>Expenses</p>
        </button>
        {isEditable && <Button text={"Edit"} onClick={() => openEditModal()} />}
      </div>
      <div className="content">
      <div className="image">
      <h1>Expense Details</h1>
      <img
        src={expense.receipt || "/app.svg"}
        alt={expense.storeName}
        onClick={() => {
          expense.receipt && setIsZoomed(true)
        }} // Open zoom modal on click
        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
          (e.currentTarget.src = "/app.svg")
        }
        className="image-preview"
      />
      <button className="download-btn" onClick={handleDownload}>
        <DownloadOutlined/> Download Image
      </button>

      {/* Custom Modal for Zoom */}
      {isZoomed && (
        <div className="modal-overlay" onClick={() => setIsZoomed(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={expense.receipt || "/app.svg"} alt={expense.storeName} />
          </div>
          {/* // Close button */}
          <button
          className="close-btn"
            onClick={() => setIsZoomed(false)}>
            Close
            </button>
        </div>
      )}
    </div>
        <div className="details">
          <label>
            Store Name:
            <span>{expense.storeName}</span>
          </label>
          <label>
            House:
            <span>{expense.houseName}</span>
          </label>
          <label>
            Category:
            <span>{expense.category}</span>
          </label>
          <label>
            Cost:
            <span>€{expense.cost}</span>
          </label>
          <label>
            Involved Users:
            <span>{expense.involvedUsers.join(", ")}</span>
          </label>
          <label>
            Paid by:
            <span>{expense.user}</span>
          </label>
          <label>
            Description:
            <span>{expense.description}</span>
          </label>
          <label>
            Date:
            <span>{new Date(expense.date).toLocaleString()}</span>
          </label>
        </div>
      </div>
        <Add
          slug="Expense"
          columns={config.expenseFields}
          setModalOpen={setModalOpen}
          editData={expense} 
          modalOpen={modalOpen}
          setRefresh={setRefresh}
        />
      <Toaster />
    </div>
  )
}

export default ExpenseDetail
