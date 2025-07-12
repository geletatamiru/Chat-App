import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChatPage from "./pages/Chatpage";

import "./App.css";
function App() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route path="/" element={token ? <ChatPage /> : <Navigate to="/login" />} />
      <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!token ? <Signup /> : <Navigate to="/" />} />
    </Routes>
  )
}

export default App;