import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout";
import Profile from "./routes/Profile";
import Home from "./routes/home";
import Login from "./routes/login";
import CreateAccount from "./routes/create-account";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/login",
    element:<Login/>
  },
  {
    path: "/create-account",
  element:<CreateAccount/>  
  }
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      {/* 위에 만든 router를 전달해줌 */}
    </>
  );
}

export default App;
