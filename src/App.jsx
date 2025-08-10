import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/DashBoard";
import Settings from "./pages/Settings";
import SplashScreen from "./pages/SplashScreen";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const LoginRedirectIfAuth = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/" /> : <Login />;
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) return <SplashScreen />;

  return (
    <AuthProvider>
      <Router>
        <nav className="p-4 bg-gray-900 text-white flex gap-4">
          <Link to="/">Dashboard</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/settings">Settings</Link>
          <Link to="/forgot-password">Forgot Password</Link>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginRedirectIfAuth />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>

        <ToastContainer position="top-center" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;
