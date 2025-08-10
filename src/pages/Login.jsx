// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Input from "../Components/ui/input";
import StarBorder from "../Components/ui/StarBorder";
import Particles from "../Components/ui/Particles";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const registered = localStorage.getItem("registrationSuccess");
    if (registered) {
      toast.success("Registration successful. Please login.");
      localStorage.removeItem("registrationSuccess");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Logging in with:", { email, password }); // ✅ Debug log

    try {
      const res = await loginUser({ email, password });
      login(res.data.user); // Match backend response shape
      navigate("/"); // Redirect to dashboard/homepage
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      toast.error(msg);
      console.error("Login failed:", err); // ✅ Error debug
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex justify-center items-center bg-gradient-to-br from-gray-800 to-black text-white">
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Particles
          particleColors={["#ffffff", "#8B5CF6"]}
          particleCount={150}
          particleSpread={10}
          speed={0.15}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="z-10 w-80 bg-black/60 p-8 rounded-xl shadow-2xl border border-purple-600 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-purple-400">Login</h2>

        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />

        <StarBorder
          as="button"
          type="submit"
          className="w-full cursor-pointer"
          color="cyan"
          speed="4s"
        >
          Login
        </StarBorder>

        <div className="text-sm text-gray-300 mt-3 text-center space-y-2">
          <Link to="/register" className="text-purple-400 hover:underline block">
            ➕ Create an account
          </Link>
          <Link to="/forgot-password" className="text-blue-300 hover:underline block">
            🔑 Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
