import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ExerciseRecommendation = () => {
  const [calories, setCalories] = useState('');
  const [goal, setGoal] = useState('Weight Loss');
  const [fitnessLevel, setFitnessLevel] = useState('Beginner');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleRecommend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/exercise/recommend',
        {
          calories: Number(calories) || 300,
          goal,
          fitnessLevel,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(res.data);
    } catch (err) {
      console.error('Exercise Recommendation Error:', err);
      setError(err.response?.data?.message || 'Recommendation generate karne me error aaya.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 flex flex-col items-center font-sans">
      
      {/* Top Header */}
      <div className="w-full max-w-4xl mb-6 flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 px-4 py-2.5 rounded-xl border border-slate-800 transition shadow-sm"
        >
          ← Back to Dashboard
        </Link>
        <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          AI Exercise Engine
        </span>
      </div>

      {/* Main Grid Container */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Panel: Form Input Card */}
        <div className="md:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-white">Workout Plan</h2>
            <p className="text-xs text-slate-400 mt-1">
              Apne calories aur goals enter karke AI workout routine generate karein.
            </p>
          </div>

          <form onSubmit={handleRecommend} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Target Calories (kcal)
              </label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="e.g. 350"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 outline-none transition text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Fitness Goal
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3 text-slate-100 outline-none transition text-sm cursor-pointer"
              >
                <option value="Weight Loss">🔥 Weight Loss</option>
                <option value="Muscle Building">💪 Muscle Building</option>
                <option value="Endurance">⚡ Endurance</option>
                <option value="General Fitness">🧘 General Fitness</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Fitness Level
              </label>
              <select
                value={fitnessLevel}
                onChange={(e) => setFitnessLevel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3 text-slate-100 outline-none transition text-sm cursor-pointer"
              >
                <option value="Beginner">🟢 Beginner</option>
                <option value="Intermediate">🟡 Intermediate</option>
                <option value="Advanced">🔴 Advanced</option>
              </select>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-bold py-3.5 rounded-xl transition shadow-lg shadow-emerald-500/10 cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  <span>Generating Routine...</span>
                </>
              ) : (
                <span>Get Workout Plan</span>
              )}
            </button>
          </form>
        </div>

        {/* Right Panel: Output Result Card */}
        <div className="md:col-span-7">
          {result ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
              
              {/* Header Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Recommended Plan</span>
                  <h3 className="text-xl font-bold text-white mt-1">{result.workoutTitle}</h3>
                </div>

                <div className="flex gap-2">
                  <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-center">
                    <p className="text-[9px] text-slate-500 uppercase font-semibold">Duration</p>
                    <p className="text-xs font-bold text-slate-200">{result.durationMinutes} mins</p>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-center">
                    <p className="text-[9px] text-slate-500 uppercase font-semibold">Est. Burn</p>
                    <p className="text-xs font-bold text-emerald-400">{result.estimatedCaloriesBurned} kcal</p>
                  </div>
                </div>
              </div>

              {/* Exercises List */}
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Exercise Breakdown</h4>
              <div className="space-y-3">
                {result.exercises?.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950/70 border border-slate-800/80 p-4 rounded-2xl flex items-center justify-between hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </div>
                      <div>
                        <h5 className="font-semibold text-slate-100 text-sm">{item.name}</h5>
                        <p className="text-[11px] text-slate-500">Rest: {item.restSeconds} sec</p>
                      </div>
                    </div>

                    <span className="bg-slate-900 border border-slate-800 text-xs font-bold text-emerald-400 px-3 py-1.5 rounded-lg">
                      {item.sets} Sets × {item.reps}
                    </span>
                  </div>
                ))}
              </div>

              {/* Safety Tip */}
              {result.tips && (
                <div className="mt-6 bg-emerald-950/20 border border-emerald-800/30 rounded-2xl p-4 text-xs text-emerald-300 flex items-start gap-2">
                  <span>💡</span>
                  <p><strong>Pro Tip:</strong> {result.tips}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl p-10 text-center flex flex-col items-center justify-center min-h-[380px]">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl mb-3 text-slate-500">
                🏋️
              </div>
              <h3 className="text-base font-semibold text-slate-300">No Routine Generated</h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Left form mein parameters set karke "Get Workout Plan" par click karein.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ExerciseRecommendation;