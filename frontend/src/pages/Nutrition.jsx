import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Nutrition() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchNutrition = async () => {
  setLoading(true);
  setError('');
  try {
    const token = localStorage.getItem('token');
    // Cache bust karne ke liye timestamp query parameter add karein
    const res = await axios.get(`http://localhost:5000/api/nutrition/recommendation?t=${Date.now()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setData(res.data);
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to load recommendations.');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchNutrition();
  }, []);

  return (
    <div className="nutri-page">
      <style>{`
        .nutri-page {
          min-height: 100vh;
          background-color: #0f172a;
          color: #f8fafc;
          padding: 24px;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .nutri-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .btn-back {
          background-color: #334155;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
        }
        .btn-refresh {
          background-color: #10b981;
          color: #022c22;
          font-weight: 600;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
        }
        .macro-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }
        .macro-card {
          background-color: #1e293b;
          border: 1px solid #334155;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }
        .macro-value {
          font-size: 28px;
          font-weight: 700;
          color: #10b981;
          margin-top: 8px;
        }
        .meals-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .meal-card {
          background-color: #1e293b;
          border: 1px solid #334155;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .meal-tag {
          font-size: 12px;
          color: #10b981;
          font-weight: 600;
          text-transform: uppercase;
        }
        .meal-title {
          font-size: 18px;
          font-weight: 600;
          margin: 4px 0;
        }
        .meal-portion {
          font-size: 14px;
          color: #94a3b8;
        }
        .meal-stats {
          text-align: right;
          font-size: 14px;
        }
        .tip-box {
          background-color: #064e3b;
          border: 1px solid #10b981;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        }
      `}</style>

      <div className="nutri-header">
        <div>
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </button>
          <h1 style={{ marginTop: '12px', fontSize: '24px' }}>🍎 AI Nutrition Plan</h1>
        </div>
        <button className="btn-refresh" onClick={fetchNutrition} disabled={loading}>
          {loading ? 'Generating...' : 'Refresh Meal Plan'}
        </button>
      </div>

      {loading && <p>Generating your customized nutrition plan with AI...</p>}
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}

      {data && !loading && (
        <>
          {data.nutritionTip && (
            <div className="tip-box">
              💡 <strong>Nutritionist Tip:</strong> {data.nutritionTip}
            </div>
          )}

          {/* Daily Targets */}
          <div className="macro-grid">
            <div className="macro-card">
              <div>Daily Calories</div>
              <div className="macro-value">{data.dailyTargets?.calories} kcal</div>
            </div>
            <div className="macro-card">
              <div>Protein Target</div>
              <div className="macro-value">{data.dailyTargets?.proteinGrams} g</div>
            </div>
            <div className="macro-card">
              <div>Carbs Target</div>
              <div className="macro-value">{data.dailyTargets?.carbsGrams} g</div>
            </div>
            <div className="macro-card">
              <div>Fat Target</div>
              <div className="macro-value">{data.dailyTargets?.fatGrams} g</div>
            </div>
          </div>

          {/* Meals List */}
          <h2>Recommended Today's Meals</h2>
          <div className="meals-section">
            {data.meals?.map((meal, index) => (
              <div key={index} className="meal-card">
                <div>
                  <span className="meal-tag">{meal.mealType}</span>
                  <div className="meal-title">{meal.title}</div>
                  <div className="meal-portion">{meal.portion}</div>
                </div>
                <div className="meal-stats">
                  <div>🔥 {meal.calories} kcal</div>
                  <div>💪 {meal.protein}g Protein</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}