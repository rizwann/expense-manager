import { useEffect, useState } from "react"
import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  useLocation,
  useNavigate,
} from "react-router-dom"
import Footer from "./components/Footer"
import Menu from "./components/Menu"
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

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
})
const LoadingSkeleton = () => {
  // Replace this with your own skeleton loading UI using Tailwind CSS classes
  return (
    <div className="h-screen p-4 bg-gray-100 border rounded">
      {/* Example skeleton loading UI */}
      <div className="h-10 mb-4 bg-gray-300 rounded"></div>
      <div className="flex gap-4">
        <div className="flex-1 h-40 bg-gray-300 rounded"></div>
        <div className="h-40 bg-gray-300 rounded flex-3"></div>
      </div>
      <div className="h-10 mt-4 bg-gray-300 rounded"></div>
    </div>
  )
}

const App = () => {
  const { user } = useAuth()
  console.log(user, "user from app")

  const Layout = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      if (!user && location.pathname !== "/login") {
        navigate("/login")
      } else {
        setLoading(false)
      }
    }, [user, navigate, location])

    if (loading) {
      return <LoadingSkeleton /> // Render the loading skeleton while checking authentication
    }

    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div className="main">
          <Navbar />
          <div className="container">
            <div className="menu-container">
              <Menu />
            </div>

            <div className="content-container">
              <Outlet />
            </div>
          </div>
          <Footer />
        </div>
      </ThemeProvider>
    )
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/stores",
          element: <Stores />,
        },
        {
          path: "/expenses",
          element: <Expenses />,
        },
        {
          path: "/houses",
          element: <Houses />,
        },
        {
          path: "/users",
          element: <Users />,
        },
        {
          path: "/users/:id",
          element: <User />,
        },
        {
          path: "/expenses/:id",
          element: <Expense />,
        },
        {
          path: "/stores/:id",
          element: <Store />,
        },
        {
          path: "/houses/:id",
          element: <House />,
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/registration",
      element: <RegistrationPage />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPasswordPage />,
    },
    {
      path: "/reset-password/:id",
      element: <ResetPasswordPage />,
    },
  ])

  return <RouterProvider router={router} />
}

export default App
