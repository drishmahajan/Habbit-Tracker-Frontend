import { useState } from "react";
import { toast } from "react-toastify";
import { sendPasswordResetEmail } from "../utils/api";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

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
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset email");
      console.error("Reset email error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-80 bg-white p-6 rounded shadow"
        noValidate
      >
        <h2 className="text-xl font-semibold text-center">Forgot Password</h2>
        <input
          type="email"
          className="w-full p-2 border rounded"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded cursor-pointer disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Email"}
        </button>
        <Link
          to="/login"
          className="block text-center text-sm text-blue-600 hover:underline"
        >
          Back to Login
        </Link>
      </form>
    </div>
  );
};

export default ForgotPassword;
