import { useEffect, useState } from "react"
import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  useLocation,
  useNavigate,
} from "react-router-dom"
import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import { useAuth } from "./hooks/useAuth"
import Expense from "./pages/Expense"
import Expenses from "./pages/Expenses"
import ForgotPasswordPage from "./pages/ForgetPassword"
import Home from "./pages/Home"
import House from "./pages/House"
import Houses from "./pages/Houses"
import LoginPage from "./pages/Login"
import RegistrationPage from "./pages/Registration"
import ResetPasswordPage from "./pages/ResetPassword"
import Store from "./pages/Store"
import Stores from "./pages/Stores"
import User from "./pages/User"
import Users from "./pages/Users"
import "./styles/global.scss"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import NotFoundPage from "./pages/NotFound"
import Balances from "./pages/Balances"
import ActivationPage from "./pages/AccountActivation"
import MobileMenu from "./components/MobileMenu"
import About from "./pages/About"
import AcceptUserPage from "./pages/AcceptUser"
import DownloadApp from "./pages/AppDownload"

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
})

const LoadingSkeleton = () => {
  return (
    <div className="h-screen p-4 border rounded bg-stone-800">
      <div className="h-10 mb-4 rounded bg-stone-900"></div>
      <div className="flex gap-4">
        <div className="flex-1 h-40 rounded bg-stone-900"></div>
        <div className="h-40 rounded bg-stone-950 flex-3"></div>
      </div>
      <div className="h-10 mt-4 rounded bg-stone-950"></div>
    </div>
  )
}

const App = () => {
  const { user, loading } = useAuth()
  const Layout = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isOpen, setIsOpen] = useState(false)
    const [weather, setWeather] = useState<{ temp: number; icon: string, city: string  } | null>(
      null
    )

    const fetchWeatherData = async (lat: number, lon: number) => {
      console.log("fetchWeatherData", lat, lon)
      try {
        const apiKey = "669da1d889c14c00895153646251301" // Replace with your WeatherAPI.com API key
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`
        )
        const data = await response.json()
        setWeather({
          temp: Math.round(data.current.temp_c),
          icon: data.current.condition.icon, // Direct URL for WeatherAPI icons
          city: data.location.name
        })
      } catch (error) {
        console.error("Error fetching weather data:", error)
      }
    }
    
  
    useEffect(() => {
      const isDev = process.env.NODE_ENV === "development"
    
      const getWeatherData = () => {
        if (isDev) {
          // Mock location for development
          fetchWeatherData(51.444041, 6.975880) // London coordinates
        } else {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords
              fetchWeatherData(latitude, longitude)
            },
            (error) => {
              console.error("Error getting location:", error.message)
            }
          )
        }
      }
    
      getWeatherData()
    }, [])
    
  
    useEffect(() => {
      if(!loading){
        if (!user && location.pathname !== "/login") {
          navigate("/login")
        } 
      }
    }, [user, navigate, location, loading])

    if (loading) {
      return <LoadingSkeleton />
    }

    return (
      <ThemeProvider theme={darkTheme}
      >
        <CssBaseline />
        <div className="main">
          <Navbar setIsOpen={setIsOpen} weather={weather} />
          <div className="main-container" style={{
            paddingTop: 'env(safe-area-inset-top)'
          }}>
            <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className="content-container">
              <Outlet />
            </div>
          </div>
        </div>
        <Footer />
      </ThemeProvider>
    )
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/stores", element: <Stores /> },
        { path: "/expenses", element: <Expenses /> },
        { path: "/houses", element: <Houses /> },
        { path: "/users", element: <Users /> },
        { path: "/users/:id", element: <User /> },
        { path: "/expenses/:id", element: <Expense /> },
        { path: "/stores/:id", element: <Store /> },
        { path: "/houses/:id", element: <House /> },
        { path: "/balance", element: <Balances /> },
        { path: "/about", element: <About /> },
        { path: "*", element: <NotFoundPage /> }, // Add wildcard route for undefined paths
      ],
    },
    { path: "/login", element: <LoginPage /> },
    { path: "/registration", element: <RegistrationPage /> },
    { path: "/forgot-password", element: <ForgotPasswordPage /> },
    { path: "/reset-password/:id", element: <ResetPasswordPage /> },
    { path: "/app-download", element: <DownloadApp /> },
    { path: "/auth/activate/:id", element: <ActivationPage /> }, // Activation route
    { path: "/accept-user/:id/:houseCode/:ownId", element: <AcceptUserPage /> }, // Accept user route
    { path: "*", element: <NotFoundPage /> }, // Add another wildcard route for undefined paths
  ])

  return <RouterProvider router={router} />
}

export default App
