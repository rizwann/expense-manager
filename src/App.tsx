import { useEffect } from "react";
import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom";
import Footer from "./components/Footer";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import { useAuth } from "./hooks/useAuth";
import Expense from "./pages/Expense";
import Expenses from "./pages/Expenses";
import ForgotPasswordPage from "./pages/ForgetPassword";
import Home from "./pages/Home";
import House from "./pages/House";
import Houses from "./pages/Houses";
import LoginPage from "./pages/Login";
import RegistrationPage from "./pages/Registration";
import ResetPasswordPage from "./pages/ResetPassword";
import Store from "./pages/Store";
import Stores from "./pages/Stores";
import User from "./pages/User";
import Users from "./pages/Users";
import "./styles/global.scss";

const App = () => {
  const { user } = useAuth();
  console.log(user, "user from app");

  const Layout = () => {
    const navigate = useNavigate();
    useEffect(() => {
      if (!user) {
        navigate("/login");
      }
    }, [user]);
    return (
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
    );
  };

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
  ]);

  return <RouterProvider router={router} />;
};

export default App;
