import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();

  const [unitSystem, setUnitSystem] = useState("metric");
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("dark");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    // LocalStorage se saved settings load karein
    const savedSettings = JSON.parse(localStorage.getItem("appSettings"));
    if (savedSettings) {
      setUnitSystem(savedSettings.unitSystem || "metric");
      setNotifications(savedSettings.notifications ?? true);
      const currentTheme = savedSettings.theme || "dark";
      setTheme(currentTheme);
      applyTheme(currentTheme);
    } else {
      applyTheme("dark");
    }
  }, []);

  // Theme application logic
  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    if (newTheme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
      document.body.style.backgroundColor = "#f8fafc";
      document.body.style.color = "#0f172a";
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
      document.body.style.backgroundColor = "#020617";
      document.body.style.color = "#f8fafc";
    }
  };

  const handleThemeChange = (e) => {
    const selectedTheme = e.target.value;
    setTheme(selectedTheme);
    applyTheme(selectedTheme);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    const settingsData = { unitSystem, notifications, theme };
    localStorage.setItem("appSettings", JSON.stringify(settingsData));
    
    setSaveMessage("Settings saved successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear session & cache?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  const isLight = theme === "light";

  return (
    <div className={`min-h-screen p-4 sm:p-8 flex flex-col items-center transition-colors duration-300 ${
      isLight ? "bg-slate-100 text-slate-900" : "bg-slate-950 text-slate-100"
    }`}>
      
      {/* Header */}
      <div className="w-full max-w-2xl mb-6 flex items-center justify-between">
        <Link
          to="/dashboard"
          className={`text-xs font-semibold px-4 py-2.5 rounded-xl border transition ${
            isLight 
              ? "bg-white hover:bg-slate-200 text-slate-700 border-slate-300" 
              : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800"
          }`}
        >
          ← Back to Dashboard
        </Link>
        <span className="text-xs font-semibold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          Preferences
        </span>
      </div>

      {/* Main Settings Card */}
      <div className={`w-full max-w-2xl border rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md transition-colors duration-300 ${
        isLight ? "bg-white border-slate-200" : "bg-slate-900/80 border-slate-800"
      }`}>
        <h2 className={`text-2xl font-black ${isLight ? "text-slate-900" : "text-white"}`}>⚙️ App Settings</h2>
        <p className={`text-xs mt-1 mb-6 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
          Manage your health metrics preference, notifications, and session.
        </p>

        {saveMessage && (
          <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs text-center font-medium">
            {saveMessage}
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="space-y-5">
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
              isLight ? "text-slate-700" : "text-slate-300"
            }`}>
              Measurement Unit
            </label>
            <select
              value={unitSystem}
              onChange={(e) => setUnitSystem(e.target.value)}
              className={`w-full border rounded-xl px-4 py-3 text-sm outline-none ${
                isLight 
                  ? "bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500" 
                  : "bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500"
              }`}
            >
              <option value="metric">Metric (Kilograms, Centimeters)</option>
              <option value="imperial">Imperial (Pounds, Feet/Inches)</option>
            </select>
          </div>

          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
              isLight ? "text-slate-700" : "text-slate-300"
            }`}>
              Theme Mode
            </label>
            <select
              value={theme}
              onChange={handleThemeChange}
              className={`w-full border rounded-xl px-4 py-3 text-sm outline-none cursor-pointer ${
                isLight 
                  ? "bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500" 
                  : "bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500"
              }`}
            >
              <option value="dark">🌙 Dark Mode</option>
              <option value="light">☀️ Light Mode</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="notif"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
            <label htmlFor="notif" className={`text-xs cursor-pointer ${isLight ? "text-slate-700" : "text-slate-300"}`}>
              Enable daily health & workout reminders
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition mt-4 text-sm"
          >
            Save Settings
          </button>
        </form>

        <div className={`mt-8 pt-6 border-t ${isLight ? "border-slate-200" : "border-slate-800"}`}>
          <h3 className="text-sm font-bold text-red-500 mb-1">⚠️ Danger Zone</h3>
          <p className="text-xs text-slate-500 mb-3">Clear local app cache or reset current user session.</p>
          <button
            onClick={handleClearData}
            className="w-full bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-500 font-semibold py-2.5 rounded-xl text-xs transition"
          >
            Clear Cache & Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;