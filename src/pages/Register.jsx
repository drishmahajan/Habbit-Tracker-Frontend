import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../utils/api";
import Input from "../Components/ui/input";
import Button from "../Components/ui/button";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await registerUser({ email, password });
      localStorage.setItem("token", res.data.token);

      // Send confirmation email
      await sendConfirmationEmail(email);

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

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="space-y-4 w-80 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold text-center">Register</h2>
        {error && <div className="text-red-500 text-sm">{error}</div>}

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
        <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>
      </form>
    </div>
  );
};

export default Register;
