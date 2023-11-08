import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Footer from "./components/Footer";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import Expenses from "./pages/Expenses";
import Home from "./pages/Home";
import Houses from "./pages/Houses";
import Login from "./pages/Login";
import Stores from "./pages/Stores";
import Users from "./pages/Users";
import "./styles/global.scss";

const App = () => {
  const Layout = () => {
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
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
