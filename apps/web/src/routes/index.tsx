import { createBrowserRouter } from "react-router-dom";
import Landing from "../pages/Landing";
import SignIn from "../pages/SignIn";
import CreateAccount from "../pages/CreateAccount";
import ClassBrowser from "../pages/ClassBrowser";
import Error from "../pages/Error";
import { RequireAuth } from "../components/auth/RequireAuth";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Error />,
    children: [
      { index: true, element: <Landing /> },
      { path: "signin", element: <SignIn /> },
      { path: "signup", element: <CreateAccount /> },
      {
        path: "classes",
        element: (
          <RequireAuth>
            <ClassBrowser />
          </RequireAuth>
        ),
      },
    ],
  },
]);