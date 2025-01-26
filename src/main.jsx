import React from "react";

import "./index.css";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "./pages/Auth/SignIn/SignIn.jsx";
import Homepage from "./pages/Homepage/Homepage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
