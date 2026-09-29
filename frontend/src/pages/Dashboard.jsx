import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!savedUser || !token) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(savedUser));

    // Get health profile from backend
    const getProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/profiles",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Express backend data structure check
        setProfile(response.data?.data || response.data);
      } catch (error) {
        console.error("Profile fetch error:", error);

        if (error.response?.status === 404) {
          setProfile(null);
        }
      } finally {
        setProfileLoading(false);
      }
    };

    getProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Helper values for Stats (Profile data standard BMR/Macro fallback)
  const caloriesGoal = profile?.dailyCalories || profile?.targetCalories || (profile?.weight ? Math.round(profile.weight * 28) : 2000);
  const proteinGoal = profile?.proteinGoal || (profile?.weight ? Math.round(profile.weight * 1.6) : 112);
  const waterIntake = profile?.waterIntake || (profile?.weight ? (profile.weight * 0.035).toFixed(1) : 2.5);

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">

      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="mobile-logo">
          🥗 NutriAI
        </div>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </header>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeMenu}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>

        <div className="logo">
          🥗 <span>NutriAI</span>
        </div>

        <div className="menu">

          <button
            className="menu-item active"
            onClick={closeMenu}
          >
            🏠 Dashboard
          </button>

          <button
            className="menu-item"
            onClick={() => {
              closeMenu();
              navigate("/my-profile");
            }}
          >
            👤 My Profile
          </button>

          <button
            onClick={() => navigate('/nutrition')}
            className="sidebar-btn menu-item"
          >
            🍎 Nutrition
          </button>

          <button
            className="menu-item"
            onClick={() => navigate('/FoodAnalysis')}
          >
            🥗 Food Analysis
          </button>

          <button
            className="menu-item"
            onClick={() => navigate('/ExerciseRecommendation')}
          >
            💪 Exercise
          </button>

          <button
            className="menu-item"
            onClick={() => navigate('/Settings')}
          >
            ⚙️ Settings
          </button>

        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </aside>

      {/* Main Content */}
      <main className="main-content">

        {/* Topbar */}
        <header className="topbar">

          <div className="welcome">
            <h1>
              Welcome, {user.name} 👋
            </h1>

            <p>
              Your personalized health dashboard
            </p>
          </div>

          <div className="profile">

            <div className="avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{user.name}</strong>
              <small>{user.email}</small>
            </div>

          </div>

        </header>

        {/* Dynamic Stats Section */}
        <section className="stats">

          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div onClick={() => navigate('/my-profile')} className="cursor-pointer">
              <p>Daily Calories</p>
              <h2>{profileLoading ? "..." : `${caloriesGoal} kcal`}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🥩</div>
            <div onClick={() => navigate('/my-profile')} className="cursor-pointer">
              <p>Protein Goal</p>
              <h2>{profileLoading ? "..." : `${proteinGoal} g`}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💧</div>
            <div onClick={() => navigate('/my-profile')} className="cursor-pointer">
              <p>Water Intake</p>
              <h2>{profileLoading ? "..." : `${waterIntake} L`}</h2>
            </div>
          </div>

        </section>

        {/* Quick Actions */}
        <section className="quick-section">

          <h2>Quick Actions</h2>

          <div className="action-grid">

            <button className="action-card" onClick={() => navigate('/nutrition')}>
              <span>🍎</span>
              <div>
                <h3>Nutrition Recommendation</h3>
                <p>Get personalized nutrition advice</p>
              </div>
            </button>

            <button className="action-card" onClick={() => navigate('/FoodAnalysis')}>
              <span>🥗</span>
              <div>
                <h3>Food Analysis</h3>
                <p>Analyze your food and calories</p>
              </div>
            </button>

            <button className="action-card" onClick={() => navigate('/ExerciseRecommendation')}>
              <span>💪</span>
              <div>
                <h3>Exercise Recommendations</h3>
                <p>Get customized workouts based on your calorie target</p>
              </div>
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;