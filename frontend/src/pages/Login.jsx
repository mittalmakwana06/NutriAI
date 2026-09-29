import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true);

      const response = await API.post(
        "/users/login",
        formData
      );

      localStorage.setItem(
        "token",
        response.data.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.data)
      );

      navigate("/dashboard");

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-container">

        {/* Left Side */}
        <div className="auth-info">

          <div className="brand">
            🥗 NutriAI
          </div>

          <h1>
            Welcome
            <br />
            Back!
          </h1>

          <p>
            Continue your healthy journey with
            personalized nutrition and fitness guidance.
          </p>

          <div className="feature">
            <span>🥗</span>
            <div>
              <strong>Healthy Nutrition</strong>
              <small>Make better food choices</small>
            </div>
          </div>

          <div className="feature">
            <span>💪</span>
            <div>
              <strong>Fitness Goals</strong>
              <small>Stay active and consistent</small>
            </div>
          </div>

          <div className="feature">
            <span>❤️</span>
            <div>
              <strong>Better Lifestyle</strong>
              <small>Build healthy daily habits</small>
            </div>
          </div>

        </div>

        {/* Login Form */}
        <div className="auth-form-container">

          <div className="auth-form">

            <div className="mobile-brand">
              🥗 NutriAI
            </div>

            <h2>Welcome Back</h2>

            <p className="auth-subtitle">
              Login to continue to your dashboard
            </p>

            <form onSubmit={handleSubmit}>

              <label>Email Address</label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              {message && (
                <div className="error-message">
                  {message}
                </div>
              )}

              <button
                className="auth-button"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Logging in..."
                  : "Login"}
              </button>

            </form>

            <p className="auth-footer">
              Don't have an account?{" "}
              <Link to="/register">Create Account</Link>
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;