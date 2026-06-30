import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import MainLayout from "../layouts/MainLayout";

const Login = () => {
  const navigate = useNavigate();

  const { login } =
    useContext(AuthContext);

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState("");

  const handleChange = (e) => {
    setError("");
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data =
        await loginUser(formData);

      login(
        data,
        data.token
      );

      toast.success(
        "Login successful"
      );

      if (data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/animals");
      }
    } catch (error) {
      const message =
        error.response?.data
          ?.message ||
        "Login failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-center items-center min-h-[80vh]">

        <form
          onSubmit={
            handleSubmit
          }
          className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md"
        >

          <h2 className="text-3xl font-bold text-center mb-6">
            Login
          </h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={
              formData.email
            }
            onChange={
              handleChange
            }
            className="w-full border p-3 rounded mb-4"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={
              formData.password
            }
            onChange={
              handleChange
            }
            className="w-full border p-3 rounded mb-4"
          />

          {error && (
            <div className="text-red-600 text-sm mb-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white py-3 rounded transition-colors"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center mt-4 text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-orange-500 hover:underline"
            >
              Register
            </Link>
          </p>

        </form>
      </div>
    </MainLayout>
  );
};

export default Login;
