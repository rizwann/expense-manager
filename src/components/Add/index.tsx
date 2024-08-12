import { useEffect, useState } from "react";
import "./add.scss";
import { House, IUser, Store } from "../../types";
import axios from "axios";
import { Collapse, Switch, Checkbox, FormControlLabel } from "@mui/material";
import CustomDropdown from "../CustomDropDown";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../hooks/useAuth";

interface IProps {
  slug: string;
  columns: any[];
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
  editData?: any; // Data to be edited, if applicable
}

enum CategoryName {
  Other = "Other",
  Grocery = "Grocery",
  Restaurant = "Restaurant",
  Clothing = "Clothing",
  Entertainment = "Entertainment",
  Butcher = "Butcher",
}

const Add: React.FC<IProps> = ({ slug, columns, setModalOpen, setRefresh, editData }) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [houses, setHouses] = useState<House[]>([]);
  const [houseUsers, setHouseUsers] = useState<IUser[]>([]);
  const [selectCustomTime, setSelectCustomTime] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [paidByMe, setPaidByMe] = useState(true);
  const [selectedPayer, setSelectedPayer] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const token = localStorage.getItem("token");
  const { user } = useAuth();
  const userId = user?._id;

  useEffect(() => {
    const fetchStores = async () => {
      const storeApi = `${import.meta.env.VITE_API_URL}/api/stores`;
      const data = await axios.get<Store[]>(storeApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStores(data.data);
    };

    const fetchHouses = async () => {
      const houseApi = `${import.meta.env.VITE_API_URL}/api/houses`;
      const data = await axios.get<House[]>(houseApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHouses(data.data);
    };

    fetchStores();
    fetchHouses();
  }, [token]);

  useEffect(() => {
    if (selectedHouse) {
      const fetchHouseUsers = async () => {
        try {
          const res = await axios.get<IUser[]>(`${import.meta.env.VITE_API_URL}/api/user/house/${selectedHouse.code}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setHouseUsers(res.data);
        } catch (error) {
          console.error("Error fetching house users:", error);
        }
      };
      fetchHouseUsers();
    }
  }, [selectedHouse, token]);

  useEffect(() => {
    if (editData) {
      setFormData(editData);
      setSelectedUsers(editData.involvedUsers || []);
      setPaidByMe(editData.paymentPerson === userId);
      setSelectedPayer(editData.paymentPerson || null);

      const selectedHouse = houses.find(house => house.code === editData.houseCode);
      setSelectedHouse(selectedHouse || null);
    }
  }, [editData, houses, userId]);

  useEffect(() => {
    if (editData && selectedHouse) {
      const fetchHouseUsers = async () => {
        try {
          const res = await axios.get<IUser[]>(`${import.meta.env.VITE_API_URL}/api/user/house/${selectedHouse.code}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setHouseUsers(res.data);
        } catch (error) {
          console.error("Error fetching house users:", error);
        }
      };
      fetchHouseUsers();
    }
  }, [editData, selectedHouse, token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: any = {};
    formData.forEach((value, key) => {
      if (key === "date" && !selectCustomTime) {
        return null;
      } else if (key === "involvedUsers") {
        data[key] = selectedUsers;
      } else {
        data[key] = value;
      }
    });

    data.paymentPerson = paidByMe ? userId : selectedPayer;

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
        );
        toast.success("Expense updated successfully!");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/expenses/create`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Expense created successfully!");
      }
      setRefresh && setRefresh((prev) => !prev);
      setModalOpen(false);
    } catch (error: any) {
      if (error.response) {
        setErrorMessage(
          error.response.data.message ||
            "An error occurred while saving the expense."
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
    <div className="add">
      <div className="modal">
        <span className="close" onClick={() => setModalOpen(false)}>
          X
        </span>
        <h1>{editData ? `Edit ${slug}` : `Add New ${slug}`}</h1>
        <form onSubmit={handleSubmit}>
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
                            type={column.type === "number" ? "number" : "text"}
                            placeholder={column.headerName}
                            name={column.field}
                            value={formData[column.field] || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, [column.field]: e.target.value }))}
                            required={column.field === "cost"}
                          />
                        );
                      case "date":
                        return (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "10px",
                            }}
                          >
                            <div>
                              <Switch
                                checked={selectCustomTime}
                                onChange={() =>
                                  setSelectCustomTime(!selectCustomTime)
                                }
                                inputProps={{ "aria-label": "controlled" }}
                              />
                              <label>Custom Time</label>
                            </div>
                            <Collapse in={selectCustomTime}>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "10px",
                                }}
                              >
                                <input
                                  type="datetime-local"
                                  placeholder={column.headerName}
                                  name={column.field}
                                  value={formData[column.field] || ''}
                                  onChange={(e) => setFormData(prev => ({ ...prev, [column.field]: e.target.value }))}
                                />
                              </div>
                            </Collapse>
                          </div>
                        );
                      case "select":
                        if (column.field === "storeName") {
                          return (
                            <select
                              name={"storeId"}
                              value={formData.storeId || ''}
                              onChange={(e) => setFormData(prev => ({ ...prev, storeId: e.target.value }))}
                              required
                            >
                              <option value="" disabled>Select Store</option>
                              {stores.map((store) => (
                                <option key={store._id} value={store._id}>
                                  {store.name}
                                </option>
                              ))}
                            </select>
                          );
                        } else if (column.field === "category") {
                          return (
                            <select
                              name={column.field}
                              value={formData.category || ''}
                              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                              required
                            >
                              <option value="" disabled>Select Category</option>
                              {Object.values(CategoryName).map((category) => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))}
                            </select>
                          );
                        } else if (column.field === "house") {
                          return (
                            <select
                              name={"houseCode"}
                              value={selectedHouse?.code || ''}
                              onChange={(e) => {
                                const selectedHouse = houses.find(
                                  (house) => house.code === e.target.value
                                );
                                setSelectedHouse(selectedHouse || null);
                              }}
                              required
                            >
                              <option value="" disabled>Select House</option>
                              {houses.map((house) => (
                                <option key={house._id} value={house.code}>
                                  {house.description}
                                </option>
                              ))}
                            </select>
                          );
                        } else if (column.field === "involvedUsers") {
                          return (
                            <CustomDropdown
                              options={houseUsers}
                              label={column.headerName}
                              name={column.field}
                              selectedValues={selectedUsers}
                              setSelectedValues={setSelectedUsers}
                            />
                          );
                        } else {
                          return null;
                        }
                      default:
                        return null;
                    }
                  })()}
                </div>
              );
            })}
         { !editData && <div className="item">
            <FormControlLabel
              control={
                <Checkbox
                  checked={paidByMe}
                  onChange={() => setPaidByMe(!paidByMe)}
                />
              }
              label="Paid by me"
            />
            {!paidByMe && (
              <select
                name="paymentPerson"
                value={selectedPayer || ''}
                onChange={(e) => setSelectedPayer(e.target.value)}
                required
              >
                <option value="" disabled>Select Payer</option>
                {houseUsers.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.username}
                  </option>
                ))}
              </select>
            )}
          </div>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit">{editData ? 'Update' : 'Create'}</button>
        </form>
      </div>
    </div>
  );
};

export default Add;
