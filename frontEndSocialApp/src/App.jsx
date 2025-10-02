import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import Signup from "./SignUp/signup";
import Login from "./Login/login";
import Home from "./Home/home";
import ProtectedRoute from "./protectedRoutes/ProtectedRoute";
import ProtectedRouteForHome from "./protectedRoutes/ProtectedRouteForHome";
import VerifyOtp from "./SignUp/verifyOtp";
import CreatePost from "./Home/createPost/create-post";

function App() {
  const [count, setCount] = useState(0);

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
