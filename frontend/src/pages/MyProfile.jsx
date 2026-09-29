import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyProfile.css";

function MyProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!savedUser || !token) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(savedUser));

    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/profiles", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(response.data.data);
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const formatValue = (value) => {
    if (!value) return "--";

    return value
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (!user || loading) {
    return <div className="profile-loading">Loading...</div>;
  }

  return (
    <div className="my-profile-page">
      <div className="profile-page-header">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>

        <h1>My Profile</h1>
        <p>View and manage your personal health information</p>
      </div>

      {/* Account Information */}
      <section className="profile-section">
        <h2>👤 Account Information</h2>

        <div className="profile-grid">
          <div className="profile-info">
            <span>Name</span>
            <strong>{user.name}</strong>
          </div>

          <div className="profile-info">
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>

          <div className="profile-info">
            <span>Mobile</span>
            <strong>{user.mobile || "--"}</strong>
          </div>
        </div>
      </section>

      {/* Health, Fitness & Diet Information */}
      {profile ? (
        <>
          {/* Health Information */}
          <section className="profile-section">
            <h2>❤️ Health Information</h2>

            <div className="profile-grid">
              <div className="profile-info">
                <span>Age</span>
                <strong>{profile.age} years</strong>
              </div>

              <div className="profile-info">
                <span>Gender</span>
                <strong>{formatValue(profile.gender)}</strong>
              </div>

              <div className="profile-info">
                <span>Height</span>
                <strong>{profile.height} cm</strong>
              </div>

              <div className="profile-info">
                <span>Weight</span>
                <strong>{profile.weight} kg</strong>
              </div>
            </div>
          </section>

          {/* Fitness Information */}
          <section className="profile-section">
            <h2>💪 Fitness Information</h2>

            <div className="profile-grid">
              <div className="profile-info">
                <span>Activity Level</span>
                <strong>{formatValue(profile.activityLevel)}</strong>
              </div>

              <div className="profile-info">
                <span>Fitness Goal</span>
                <strong>{formatValue(profile.fitnessGoal)}</strong>
              </div>

              <div className="profile-info">
                <span>Fitness Level</span>
                <strong>{formatValue(profile.fitnessLevel)}</strong>
              </div>

              <div className="profile-info">
                <span>Workout Days</span>
                <strong>{profile.workoutDays} days/week</strong>
              </div>

              <div className="profile-info">
                <span>Workout Location</span>
                <strong>{formatValue(profile.workoutLocation)}</strong>
              </div>
            </div>
          </section>

          {/* Diet Information */}
          <section className="profile-section">
            <h2>🥗 Diet Information</h2>

            <div className="profile-grid">
              <div className="profile-info">
                <span>Diet Type</span>
                <strong>{formatValue(profile.dietType)}</strong>
              </div>

              <div className="profile-info">
                <span>Allergies</span>
                <strong>
                  {profile.allergies?.length
                    ? profile.allergies.join(", ")
                    : "None"}
                </strong>
              </div>

              <div className="profile-info">
                <span>Dietary Restrictions</span>
                <strong>
                  {profile.dietaryRestrictions?.length
                    ? profile.dietaryRestrictions.join(", ")
                    : "None"}
                </strong>
              </div>
            </div>
          </section>

          <button
            className="edit-profile-btn"
            onClick={() => navigate("/profile-setup")}
          >
            ✏️ Edit Profile
          </button>
        </>
      ) : (
        <section className="profile-section empty-profile">
          <h2>Complete Your Profile</h2>
          <p>Your health profile has not been created yet.</p>

          <button
            onClick={() => navigate("/profile-setup")}
            className="complete-profile-btn"
          >
            Complete Profile
          </button>
        </section>
      )}
    </div>
  );
}

export default MyProfile;