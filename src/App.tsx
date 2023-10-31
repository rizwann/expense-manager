import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Expenses from "./pages/Expenses";
import Home from "./pages/Home";
import Stores from "./pages/Stores";

const App = () => {
  const router = createBrowserRouter([
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
  ]);

  return <RouterProvider router={router} />;
};

export default App;
