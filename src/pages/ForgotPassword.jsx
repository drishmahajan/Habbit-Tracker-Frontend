import { useState } from "react";
import { toast } from "react-toastify";
import { sendPasswordResetEmail } from "../utils/api";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      toast.error("Please enter a valid email.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(trimmedEmail);
      toast.success("Password reset email sent! Check your inbox.");
      setEmailSent(true);
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset email");
      console.error("Reset email error:", err);
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
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        
        {/* Floating elements */}
        <motion.div
          animate={{
            x: [0, 150, 0],
            y: [0, -100, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/6 w-48 h-48 bg-gradient-to-r from-blue-600/30 to-cyan-600/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -120, 0],
            y: [0, 80, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/3 right-1/6 w-64 h-64 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 rounded-full blur-3xl"
        />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
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
              className="inline-block p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6"
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </motion.div>
            
            <AnimatePresence mode="wait">
              {!emailSent ? (
                <motion.div
                  key="forgot-header"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent mb-2">
                    Forgot Password?
                  </h1>
                  <p className="text-gray-300">No worries! Enter your email and we'll send you a reset link</p>
                </motion.div>
              ) : (
                <motion.div
                  key="sent-header"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">
                    Email Sent! 📧
                  </h1>
                  <p className="text-gray-300">Check your inbox for the password reset link</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Form Card */}
          <motion.div
            variants={itemVariants}
            className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/30 shadow-2xl"
          >
            <AnimatePresence mode="wait">
              {!emailSent ? (
                <motion.form
                  key="forgot-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                          </svg>
                        </motion.div>
                      </div>
                      <input
                        type="email"
                        className={`w-full pl-12 pr-4 py-4 bg-gray-900/50 text-white placeholder-gray-400 border rounded-xl focus:outline-none transition-all duration-300 ${
                          focusedField === "email"
                            ? "border-blue-500 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/20"
                            : "border-gray-600 hover:border-blue-400"
                        }`}
                        placeholder="Enter your email address"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField("")}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${
                      loading
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-blue-500/30"
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
                          Sending Email...
                        </motion.div>
                      ) : (
                        <motion.span
                          key="send"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          Send Reset Link
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="success-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center space-y-6"
                >
                  {/* Success Animation */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center"
                  >
                    <motion.svg
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </motion.svg>
                  </motion.div>

                  <div>
                    <p className="text-gray-300 mb-4">
                      We've sent a password reset link to your email address. 
                      Please check your inbox and follow the instructions.
                    </p>
                    <p className="text-sm text-gray-400">
                      Don't see the email? Check your spam folder or try again.
                    </p>
                  </div>

                  <motion.button
                    onClick={() => setEmailSent(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-medium hover:from-gray-700 hover:to-gray-800 transition-all"
                  >
                    Send Another Email
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Back to Login Link */}
          <motion.div
            variants={itemVariants}
            className="mt-8 text-center"
          >
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent flex-1"></div>
              <span className="text-gray-400 text-sm">or</span>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent flex-1"></div>
            </div>
            
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Login
              </Link>
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.div
            variants={itemVariants}
            className="mt-8 text-center"
          >
            <p className="text-gray-500 text-sm">
              Remember your password? <Link to="/login" className="text-blue-400 hover:text-blue-300">Sign in here</Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;