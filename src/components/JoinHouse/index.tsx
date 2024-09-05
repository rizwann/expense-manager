import { useState } from "react";
import "./joinHouse.scss";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "../Button";
import { Close } from "@mui/icons-material";


interface IProps {
  columns: any[];
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
}

const JoinHouse: React.FC<IProps> = ({ columns, setModalOpen, setRefresh }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const token = localStorage.getItem("token");



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

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
        );
        toast.success("House Joined successfully!");
      
      setRefresh && setRefresh((prev) => !prev);
      setModalOpen(false);
    } catch (error: any) {
      if (error.response) {
        setErrorMessage(
          error.response.data.message ||
            "An error occurred while joining the house."
        );
      } else if (error.request) {
        setErrorMessage("No response from the server. Please try again later.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div className="join-house">
      <div className="join-modal-house">
        <span className="close" onClick={() => setModalOpen(false)}>
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
                            setFormData((prev) => ({
                              code : e.target.value,
                            }))
                          }
                          required
                        />
                      );
                    default:
                      return null;
                  }
                })()}
              </div>
            ))}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <Button type="submit" text={"Join House"}/>
        </form>
      </div>
    </div>
  );
};

export default JoinHouse;
