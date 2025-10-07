import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChatPage from "./pages/ChatPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
function App() {

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            {/* <ChatPage /> */}
            ChatPage
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  )
}

export default App;