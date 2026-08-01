import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChatPage from "./pages/ChatPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import PublicRoute from "./components/PublicRoute";
function App() {

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/signup" element={ 
        <PublicRoute>
          <Signup />
        </PublicRoute>
      } />
    </Routes>
  )
}

export default App;