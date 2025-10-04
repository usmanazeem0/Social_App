import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState } from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import Signup from "./SignUp/signup";
import VerifyOtp from "./SignUp/verifyOtp";
import Login from "./Login/login";
import Home from "./Home/home";
import CreatePost from "./createPost/create-post";

import ProtectedRoute from "./protectedRoutes/ProtectedRoute";
import ProtectedRouteForHome from "./protectedRoutes/ProtectedRouteForHome";

function App() {
  const [count, setCount] = useState(0);
  const location = useLocation();

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        {/* Default route -> Signup */}
        <Route path="/" element={<Navigate to="/signup" />} />

        <Route path="/signup" element={<Signup />} />

        <Route
          path="/verify-otp"
          element={
            <ProtectedRoute>
              <VerifyOtp />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />

        {/* Home route */}
        <Route
          path="/home"
          element={
            <ProtectedRouteForHome>
              <Home />
            </ProtectedRouteForHome>
          }
        />

        <Route
          path="/create-post"
          element={
            <ProtectedRouteForHome>
              <CreatePost />
            </ProtectedRouteForHome>
          }
        />
      </Routes>
    </>
  );
}

export default App;
