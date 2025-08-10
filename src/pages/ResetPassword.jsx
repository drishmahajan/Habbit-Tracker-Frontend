import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "../utils/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      toast.success("Password reset successfully. You can now login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="space-y-4 w-80 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold text-center">Reset Password</h2>
        <input
          type="password"
          className="w-full p-2 border rounded"
          placeholder="New Password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded cursor-pointer disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
