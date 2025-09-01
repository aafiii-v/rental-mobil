import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import Booking from './pages/Booking.jsx';
import About from './pages/About.jsx';
import Car from './pages/Car.jsx';
import Profile from './pages/Profile.jsx';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import Manager from './pages/Manager.jsx';
import FormAddCar from './pages/FormAddCar.jsx';

// Wrapper untuk route yang membutuhkan login
const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },

  // Semua route yang butuh autentikasi
  {
    path: "/",
    element: (
      <RequireAuth>
        <App />
      </RequireAuth>
    ),
    children: [
      {
        path: "",
        element: <Home />
      },        // default route (Home)
      {
        path: "booking",
        element: <Booking />
      },
      {
        path: "about",
        element: <About />
      },
      {
        path: "car",
        element: <Car />
      },
      {
        path: "profile",
        element: <Profile />
      },
      {
        path: "manager",
        element: <Manager/>
      },
      {
        path: "form-add-car",
        element: <FormAddCar/>
      },
    ]
  },

  // fallback route
  { path: "*", element: <Navigate to="/login" replace /> },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);