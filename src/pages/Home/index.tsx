import { ReactNode, useEffect, useState } from "react"
import BarChartBox from "../../components/BarChartBox"
import BigChart from "../../components/BigChart"
import ChartBox from "../../components/ChartBox"
import JoinHouse from "../../components/JoinHouse"
import TopBox from "../../components/TopBox"
import { useAuth } from "../../hooks/useAuth"
import {
  barChartBoxAllUser,
  barChartBoxUserExpenseLastSixMonths,
  chartBoxConversion,
  chartBoxHouseExpense,
  chartBoxUserExpense,
} from "../../menu-item"
import "./home.scss"
import { config } from "../../utils/config"
import Button from "../components/Button"
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material"
import AddHouse from "../../components/AddHouse"
import axios from "axios"
import { House } from "../../types"
import { motion } from "framer-motion"
import { Home as HomeIcon } from "@mui/icons-material"
import Toaster from "../../components/Toaster"
import { months } from "../../menu-item"
import CategoryExpenseViewer from "../../components/Categories"
import StoreExpenseViewer from "../../components/Stores"

// Helper function to get the current year and month
const getCurrentYear = () => new Date().getFullYear();
const getCurrentMonth = () => new Date().toLocaleString('default', { month: 'long' });

const years = Array.from({ length: 5 }, (_, i) => getCurrentYear() - i);


const Home = () => {
  const [joinHouseModal, setJoinHouseModal] = useState(false)
  const [createHouseModal, setCreateHouseModal] = useState(false)
  const { user, selectedHouse, setRefresh, getToken } = useAuth()
  const [loading, setLoading] = useState(true)
  const [houses, setHouses] = useState<House[]>([])
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth())
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear())
  const [selectedHouseLocal, setSelectedHouseLocal] = useState<string>(
    selectedHouse?.code || ""
  )
  const isAdmin = user ? !!(user.username === "RizwanKabir") : false
  const fetchHouses = async () => {
    setLoading(true)
    const token = await getToken()
    const houseApi = isAdmin
      ? `${import.meta.env.VITE_API_URL}/api/houses/all`
      : `${import.meta.env.VITE_API_URL}/api/houses`
    try {
      const response = await axios.get<House[]>(houseApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setHouses(response.data)
    } catch (error) {
      console.error("Error fetching houses:", error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchHouses()
  }, [selectedHouseLocal])
    // Effect to call setRefresh every 10 seconds
    useEffect(() => {
      if (!(user?.houseCodes.length > 0)) {
        const interval = setInterval(() => {
          setRefresh((prev) => !prev)
        }, 30000) // 30 seconds in milliseconds
    
        // Cleanup the interval on component unmount
        return () => clearInterval(interval)
      }
    }, [setRefresh])

  const handleHouseChange = (
    event: SelectChangeEvent<string>,
    _child: ReactNode
  ) => {
    setSelectedHouseLocal(event.target.value as string)
  }
  const handleMonthChange = (
    event: SelectChangeEvent<string>,
    _child: ReactNode
  ) => {
    setSelectedMonth(event.target.value as string)
  }
  const handleYearChange = (
    event: SelectChangeEvent<number>,
    _child: ReactNode
  ) => {
    setSelectedYear(event.target.value as number)
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    )
  }
  const selectedHouseData = houses?.find(
    (house) => house.code === selectedHouseLocal
  )

  if (!user) null

  if (!(user.houseCodes.length > 0)) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          marginTop: "-80px",
        }}
      >
        <Toaster />
        <div className="text-center">
          <Typography
            variant="h5"
            style={{
              marginBottom: "1rem",
            }}
          >
            You're currently not associated with any house.{" "}
          </Typography>
          <Typography variant="h5">
            Please join or create a house to get started.
          </Typography>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 mt-4 sm:flex-row">
          <Button
            text="Join a House"
            size="lg"
            onClick={() => setJoinHouseModal(true)}
          />
          <Button
            text="Create a House"
            size="lg"
            onClick={() => setCreateHouseModal(true)}
          />
        </div>

        <JoinHouse
          setModalOpen={setJoinHouseModal}
          columns={config.houseFields.filter((field) => field.field === "code")}
          modalOpen={joinHouseModal}
        />

        <AddHouse
          setModalOpen={setCreateHouseModal}
          columns={config.houseFields}
          setRefresh={setRefresh}
          modalOpen={createHouseModal}
        />
      </div>
    )
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
       <motion.div
          className="flex flex-col items-center justify-between w-[70%] gap-5 p-4 mb-2 text-white md:flex-row "
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
        <FormControl variant="outlined" className="w-full max-w-xs mb-6">
          <InputLabel id="select-house-label">Select House</InputLabel>
          <Select
            labelId="select-house-label"
            value={selectedHouseLocal}
            onChange={handleHouseChange}
            label="Select House"
            className="text-white bg-gray-800"
            renderValue={(selected) => {
              const selectedHouse = houses.find(
                (house) => house.code === selected
              )
              return selectedHouse ? selectedHouse.description : ""
            }}
          >
            {houses.map((house) => (
              <MenuItem key={house.code} value={house.code}>
                {house.image ? (
                  <img
                    src={house.image}
                    className="mr-2 text-gray-500 ring-4 ring-gray-500"
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  <HomeIcon className="mr-2 text-gray-500" />
                )}
                {house.description}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
           {/* Month Select */}
           <FormControl variant="outlined" className="w-full max-w-xs mb-6">
          <InputLabel id="select-month-label">Select Month</InputLabel>
          <Select
            labelId="select-month-label"
            value={selectedMonth}
            onChange={handleMonthChange}
            label="Select Month"
            className="text-white bg-gray-800"
          >
            {months.map((month) => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Year Select */}
        <FormControl variant="outlined" className="w-full mb-4">
            <InputLabel id="select-year-label">Select Year</InputLabel>
            <Select
              labelId="select-year-label"
              value={selectedYear}
              onChange={handleYearChange}
              label="Select Year"
              className="text-white bg-gray-800"
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
      </motion.div>
      <div className="home">
        <div className="box box1">
          {selectedHouseData && (
            <TopBox user={user} houseCode={selectedHouseData?.code}
            month={months.indexOf(selectedMonth) + 1}
            year={selectedYear}
            selectedHouse={selectedHouseData}
            />
          )}
        </div>
        <div className="box box2">
          {selectedHouseData && (
            <ChartBox
              {...chartBoxUserExpense}
              user={user}
              type="weeklyUser"
              selectedHouse={selectedHouseData}
              month={months.indexOf(selectedMonth) + 1}
              year={selectedYear}
            />
          )}
        </div>
        <div className="box box3">
          {selectedHouseData && (
            <ChartBox
              {...chartBoxHouseExpense}
              user={user}
              type="houseExpenses"
              selectedHouse={selectedHouseData}
              month={months.indexOf(selectedMonth) + 1}
              year={selectedYear}
            />
          )}
        </div>
        {/* <div className="box box4">
          {selectedHouseData && (
            <PieChartBox user={user} selectedHouse={selectedHouseData} />
          )}
        </div> */}
        <div className="box box5">
          {selectedHouseData && (
            <ChartBox
              {...chartBoxConversion}
              user={user}
              type="popularStore"
              selectedHouse={selectedHouseData}
              month={months.indexOf(selectedMonth) + 1}
              year={selectedYear}
            />
          )}
        </div>
         {/* <div className="box box6">
          {selectedHouseData && (
            <ChartBox
              {...chartBoxStoreExpense}
              user={user}
              type="popularCategory"
              selectedHouse={selectedHouseData}
              month={months.indexOf(selectedMonth) + 1}
              year={selectedYear}
            />
          )}
        </div> */}
          <div className="box box6">
          {selectedHouseData && (
           <CategoryExpenseViewer selectedHouse={selectedHouseData} month={months.indexOf(selectedMonth) + 1} year={selectedYear}/>
          )}
        </div>
        <div className="box box10">
          {selectedHouseData && (
           <StoreExpenseViewer selectedHouse={selectedHouseData} month={months.indexOf(selectedMonth) + 1} year={selectedYear}/>
          )}
        </div>
        <div className="box box7">
          {selectedHouseData && (
            <BigChart dataKey="expenses" selectedHouse={selectedHouseData} 
            month={months.indexOf(selectedMonth) + 1} year={selectedYear}
            />
          )}
        </div>
        <div className="box box8">
          {selectedHouseData && (
            <BarChartBox
              {...barChartBoxUserExpenseLastSixMonths}
              user={user}
              type={"userSixMonths"}
              selectedHouse={selectedHouseData}
              month={months.indexOf(selectedMonth) + 1}
              year={selectedYear}
            />
          )}
        </div>

        <div className="box box9">
          {selectedHouseData && (
            <BarChartBox
              {...barChartBoxAllUser}
              user={user}
              type={"contribution"}
              selectedHouse={selectedHouseData}
              month={months.indexOf(selectedMonth) + 1}
              year={selectedYear}
            />
          )}
        </div>
       
      </div>
      
      <Toaster />
    </div>
  )
}

export default Home
