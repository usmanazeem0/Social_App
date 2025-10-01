import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";

import "./App.css";
import Signup from "./SignUp/signup";
import Login from "./Login/login";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
      {/* Default route -> Signup */}
      <Route path="/" element={<Navigate to="/signup" />} />

      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
