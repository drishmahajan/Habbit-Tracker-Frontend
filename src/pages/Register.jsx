import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    const minLength = pwd.length >= 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    
    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      isValid: minLength && hasUpper && hasLower && hasNumber
    };
  };

  const passwordStrength = validatePassword(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    if (!passwordStrength.isValid) {
      setError("Password doesn't meet requirements");
      setLoading(false);
      return;
    }

    try {
      const res = await registerUser({ email, password });
      localStorage.setItem("token", res.data.token);

      // Set a flag to show toast on login page
      localStorage.setItem("registrationSuccess", "true");

      // Redirect to login page
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && email && email.includes("@")) {
      setStep(2);
    } else if (step === 1) {
      setError("Please enter a valid email address");
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

  const slideVariants = {
    enter: { x: 100, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        {/* Floating orbs */}
        <motion.div
          animate={{
            x: [0, 200, 0],
            y: [0, -150, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -180, 0],
            y: [0, 100, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-600/30 to-cyan-600/30 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-lg"
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
              className="inline-block p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-6"
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-2">
              Join Habit Forge
            </h1>
            <p className="text-gray-300">Create your account and start building better habits</p>
            
            {/* Progress Steps */}
            <div className="flex items-center justify-center mt-6 space-x-4">
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                step >= 1 ? "bg-purple-500" : "bg-gray-600"
              }`}></div>
              <div className={`w-8 h-1 rounded-full transition-all duration-300 ${
                step >= 2 ? "bg-purple-500" : "bg-gray-600"
              }`}></div>
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                step >= 2 ? "bg-purple-500" : "bg-gray-600"
              }`}></div>
            </div>
          </motion.div>

          {/* Registration Form */}
          <motion.div
            variants={itemVariants}
            className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/30 shadow-2xl"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-6">Let's start with your email</h3>
                      
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
                          placeholder="Enter your email address"
                          required
                          className={`w-full pl-12 pr-4 py-4 bg-gray-900/50 text-white placeholder-gray-400 border rounded-xl focus:outline-none transition-all duration-300 ${
                            focusedField === "email"
                              ? "border-purple-500 ring-2 ring-purple-500/30"
                              : "border-gray-600 hover:border-purple-400"
                          }`}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={nextStep}
                      className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
                    >
                      Continue
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-white">Create your password</h3>
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          ← Back
                        </button>
                      </div>

                      {/* Password Input */}
                      <div className="mb-4">
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
                            placeholder="Create a strong password"
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
                      </div>

                      {/* Password Strength Indicator */}
                      {password && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mb-4 p-4 bg-gray-900/50 rounded-xl border border-gray-700"
                        >
                          <div className="text-sm text-gray-300 mb-3">Password Requirements:</div>
                          <div className="space-y-2">
                            {[
                              { key: 'minLength', label: 'At least 8 characters', check: passwordStrength.minLength },
                              { key: 'hasUpper', label: 'One uppercase letter', check: passwordStrength.hasUpper },
                              { key: 'hasLower', label: 'One lowercase letter', check: passwordStrength.hasLower },
                              { key: 'hasNumber', label: 'One number', check: passwordStrength.hasNumber },
                            ].map(({ key, label, check }) => (
                              <div key={key} className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                  check ? 'bg-green-500' : 'bg-gray-600'
                                }`}>
                                  {check && (
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
                                <span className={`text-sm ${check ? 'text-green-400' : 'text-gray-400'}`}>
                                  {label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Confirm Password Input */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onFocus={() => setFocusedField("confirmPassword")}
                            onBlur={() => setFocusedField("")}
                            placeholder="Confirm your password"
                            required
                            className={`w-full pl-12 pr-12 py-4 bg-gray-900/50 text-white placeholder-gray-400 border rounded-xl focus:outline-none transition-all duration-300 ${
                              focusedField === "confirmPassword"
                                ? "border-purple-500 ring-2 ring-purple-500/30"
                                : "border-gray-600 hover:border-purple-400"
                            } ${
                              confirmPassword && password !== confirmPassword ? "border-red-500" : ""
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                          >
                            {showConfirmPassword ? (
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
                        {confirmPassword && password !== confirmPassword && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-400 text-sm mt-2"
                          >
                            Passwords don't match
                          </motion.p>
                        )}
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading || !passwordStrength.isValid || password !== confirmPassword}
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                      className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${
                        loading || !passwordStrength.isValid || password !== confirmPassword
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 shadow-lg hover:shadow-purple-500/30"
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
                            Creating account...
                          </motion.div>
                        ) : (
                          <motion.span
                            key="create"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center gap-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            Create Account
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

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
            
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Already have an account? Sign in
              </Link>
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.div
            variants={itemVariants}
            className="mt-8 text-center"
          >
            <p className="text-gray-500 text-sm">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;