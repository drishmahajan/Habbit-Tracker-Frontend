// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../utils/api";
import { useAuth } from "../context/Authcontext";
import Input from "../Components/ui/input";
import StarBorder from "../Components/ui/StarBorder";
import Particles from "../Components/ui/Particles";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");
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
    setLoading(true);

    console.log("Logging in with:", { email, password }); // Debug log

    try {
      const res = await loginUser({ email, password });
      login(res.data.user); // Match backend response shape
      navigate("/"); // Redirect to dashboard/homepage
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      toast.error(msg);
      console.error("Login failed:", err); // Error debug
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <Particles
          particleColors={["#ffffff", "#8B5CF6", "#EC4899"]}
          particleCount={120}
          particleSpread={15}
          speed={0.2}
          particleBaseSize={80}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, -150, 0],
            y: [0, 120, 0],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4"
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-300">Sign in to continue your habit journey</p>
          </motion.div>

          {/* Login Form */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/30 shadow-2xl"
          >
            <div className="space-y-6">
              {/* Email Input */}
              <motion.div
                variants={itemVariants}
                className="relative"
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField("")}
                    placeholder="Enter your email"
                    required
                    className={`w-full pl-12 pr-4 py-4 bg-gray-900/50 text-white placeholder-gray-400 border rounded-xl focus:outline-none transition-all duration-300 ${
                      focusedField === "email"
                        ? "border-purple-500 ring-2 ring-purple-500/30"
                        : "border-gray-600 hover:border-purple-400"
                    }`}
                  />
                </div>
              </motion.div>

              {/* Password Input */}
              <motion.div
                variants={itemVariants}
                className="relative"
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField("")}
                    placeholder="Enter your password"
                    required
                    className={`w-full pl-12 pr-12 py-4 bg-gray-900/50 text-white placeholder-gray-400 border rounded-xl focus:outline-none transition-all duration-300 ${
                      focusedField === "password"
                        ? "border-purple-500 ring-2 ring-purple-500/30"
                        : "border-gray-600 hover:border-purple-400"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                variants={itemVariants}
                className="pt-4"
              >
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${
                    loading
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 shadow-lg hover:shadow-purple-500/30"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Signing in...
                      </motion.div>
                    ) : (
                      <motion.span
                        key="signin"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Sign In
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            </div>
          </motion.form>

          {/* Links */}
          <motion.div
            variants={itemVariants}
            className="mt-8 text-center space-y-4"
          >
            <div className="flex items-center justify-center space-x-4">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent flex-1"></div>
              <span className="text-gray-400 text-sm">or</span>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent flex-1"></div>
            </div>
            
            <div className="space-y-3">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Create new account
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  to="/forgot-password"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Forgot password?
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            variants={itemVariants}
            className="mt-8 text-center"
          >
            <p className="text-gray-500 text-sm">
              Start your journey to better habits today ✨
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
