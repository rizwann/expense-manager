import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./user.scss";
import { NavLink, useParams } from "react-router-dom";
import { IUser } from "../../types";
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../components/Button";
import AddUser from "../../components/AddUser";
import { config } from "../../utils/config";
import Toaster from "../../components/Toaster";

interface IProps {
  id: number;
  image?: string;
  title: string;
  info: object;
  chart: {
    dataKeys: {
      name: string;
      color: string;
    }[];
    data: object[];
  };
  activities: {
    time: string;
    text: string;
  }[];
}

// const data = [
//   {
//     name: "Page A",
//     uv: 4000,
//     pv: 2400,
//     amt: 2400,
//   },
//   {
//     name: "Page B",
//     uv: 3000,
//     pv: 1398,
//     amt: 2210,
//   },
//   {
//     name: "Page C",
//     uv: 2000,
//     pv: 9800,
//     amt: 2290,
//   },
//   {
//     name: "Page D",
//     uv: 2780,
//     pv: 3908,
//     amt: 2000,
//   },
//   {
//     name: "Page E",
//     uv: 1890,
//     pv: 4800,
//     amt: 2181,
//   },
//   {
//     name: "Page F",
//     uv: 2390,
//     pv: 3800,
//     amt: 2500,
//   },
//   {
//     name: "Page G",
//     uv: 3490,
//     pv: 4300,
//     amt: 2100,
//   },
// ];

const SingleUser: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<IUser| null>(null)
  const [info, setInfo] = useState<object>({})
  const [modalOpen, setModalOpen] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const token = localStorage.getItem("token")
  const openEditModal = () => {
    setModalOpen(true)
  }
  useEffect(() => {
    const getUser = async () => {
      const usersApi = `${import.meta.env.VITE_API_URL}/api/user/${id}`
      const data = await axios.get<IUser>(usersApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUser(data.data)
      setInfo({
        "Active": data.data.active ? "Yes" : "No",
        "Email": data.data.email || "N/A",
        "Name": data.data.name || "N/A",
        "House Names": data.data.houses?.map((house) => house.description).join(", "),
      })
    }
    getUser()
  }, [id, refresh])
  return (
    <div className="single">
      <div className="view">
        <div className="info">
          {/* <div className="back-btn">
            <NavLink to="/Users">
              <Button text="Back" />
            </NavLink>
          </div> */}
          <div className="top-info">
          <img
            src={`${import.meta.env.VITE_API_URL}/${user?.image}`}
            alt={user?.name || "user"}
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
              (e.currentTarget.src = "/app.svg")
            }
          />
            <h1>{user?.username}</h1>
            <Button text="Update" onClick={openEditModal} />
          </div>
          <div className="details">
            {Object.entries(info).map((item) => (
              <div className="item" key={item[0]}>
                <span className="item-title">{item[0]}:</span>
                {
                  item[0] === "House Names" ? (
                    <span>
                    {user?.houses?.length ? user?.houses?.map((house, index) => {
                      return (
                        <NavLink to={`/Houses/${house._id}`} key={house._id}
                        style ={{
                          display: 'inline-block',
                          paddingRight: 10,
                          marginRight: 10,
                          fontWeight: 'bold',
                          borderRight: index === (user?.houses?.length ?? 0) - 1 ? 'none' : '1px solid #000'
                        }}
                        >
                          <span style={{ fontWeight: "bold"}}>{house.description}</span>
                        </NavLink>
                      )

                    }
                    ) : <span>No joined houses!</span>
                  }
                    </span>
                   
                  ) : (
                    <span className="item-value">{item[1]}</span>
                  )
                }
                {/* <span className="item-value">{item[1]}</span> */}
              </div>
            ))}
          </div>
        </div>
        {/* {charts && (
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={500}
                height={300}
                data={charts.data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {charts.dataKeys.map((item) => (
                  <Line
                    type="monotone"
                    activeDot={{ r: 8 }}
                    dataKey={item.name}
                    stroke={item.color}
                    key={item.color}
                  />
                ))}
                <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )} */}
      </div>
      {/* <div className="activities">
        <h2>Latest Activities</h2>
        {activities && (
          <ul>
            {activities.map((activity, idX) => (
              <li key={idX}>
                <div>
                  <p>{activity.text}</p>
                  <time>{activity.time}</time>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div> */}
      {modalOpen && (
        <AddUser
          editData={user}
          setModalOpen={setModalOpen}
          setRefresh={setRefresh}
          columns={config.userFields}
        />
      )}
      <Toaster/>
    </div>
  );
};

export default SingleUser;
