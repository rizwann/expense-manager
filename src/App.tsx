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

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
})

const LoadingSkeleton = () => {
  return (
    <div className="h-screen p-4 bg-gray-100 border rounded">
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
    const [isOpen, setIsOpen] = useState(false)
    useEffect(() => {
      if (!user && location.pathname !== "/login") {
        navigate("/login")
      } else {
        setLoading(false)
      }
    }, [user, navigate, location])

    if (loading) {
      return <LoadingSkeleton />
    }

    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div className="main">
          <Navbar setIsOpen={setIsOpen} />
          <div className="main-container">
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
    { path: "/auth/activate/:id", element: <ActivationPage /> }, // Activation route
    { path: "*", element: <NotFoundPage /> }, // Add another wildcard route for undefined paths
  ])

  return <RouterProvider router={router} />
}

export default App
