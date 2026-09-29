import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    age: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/users", {
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        age: Number(formData.age),
        password: formData.password,
      });

      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.data)
      );

      navigate("/dashboard");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Registration failed"
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
            Start Your Healthy
            <br />
            Journey
          </h1>

          <p>
            Get personalized nutrition and fitness
            recommendations based on your profile.
          </p>

          <div className="feature">
            <span>🍎</span>
            <div>
              <strong>Smart Nutrition</strong>
              <small>Personalized food recommendations</small>
            </div>
          </div>

          <div className="feature">
            <span>💪</span>
            <div>
              <strong>Fitness Guidance</strong>
              <small>Exercise recommendations for you</small>
            </div>
          </div>

          <div className="feature">
            <span>📊</span>
            <div>
              <strong>Track Your Progress</strong>
              <small>Keep your health journey organized</small>
            </div>
          </div>
        </div>

        {/* Register Form */}
        <div className="auth-form-container">

          <div className="auth-form">

            <div className="mobile-brand">
              🥗 NutriAI
            </div>

            <h2>Create Account</h2>

            <p className="auth-subtitle">
              Create your account to get started
            </p>

            <form onSubmit={handleSubmit}>

              <label>Full Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label>Mobile Number</label>

              <input
                type="tel"
                name="mobile"
                placeholder="Enter mobile number"
                value={formData.mobile}
                onChange={handleChange}
                required
              />

              <label>Email Address</label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <label>Age</label>

              <input
                type="number"
                name="age"
                placeholder="Enter your age"
                value={formData.age}
                onChange={handleChange}
                min="1"
                max="120"
                required
              />

              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <label>Confirm Password</label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
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
                  ? "Creating Account..."
                  : "Create Account"}
              </button>

            </form>

            <p className="auth-footer">
              Already have an account?{" "}
              <Link to="/login">Login</Link>
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;