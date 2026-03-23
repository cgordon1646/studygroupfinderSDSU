import { createBrowserRouter } from "react-router-dom";
import Landing from "../pages/Landing";
import SignIn from "../pages/SignIn"
import Error from "../pages/Error";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Error />,
    children: [
      { index: true, element: <Landing /> },
      { path: "signin", element: <SignIn /> }
    ],
  },
]);