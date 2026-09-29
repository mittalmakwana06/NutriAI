import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function FoodAnalysis() {
  const [foodText, setFoodText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Image File Handling
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Handler
  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!foodText && !imagePreview) {
      setError('Khane ki photo ya naam enter karein.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/foods/analyze',
        {
          foodInput: foodText,
          imageBase64: imagePreview,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Food analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fa-container">
      <style>{`
        .fa-container {
          min-height: 100vh;
          background-color: #0f172a;
          color: #f8fafc;
          padding: 24px;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .fa-card {
          max-width: 700px;
          margin: 0 auto;
          background-color: #1e293b;
          border: 1px solid #334155;
          border-radius: 12px;
          padding: 24px;
        }
        .btn-back {
          background-color: #334155;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          margin-bottom: 16px;
        }
        .input-group {
          margin-bottom: 20px;
        }
        .input-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          color: #cbd5e1;
        }
        .input-group input[type="text"] {
          width: 100%;
          background-color: #0f172a;
          border: 1px solid #334155;
          padding: 10px;
          border-radius: 8px;
          color: white;
          box-sizing: border-box;
        }
        .btn-submit {
          width: 100%;
          padding: 12px;
          background-color: #10b981;
          color: #022c22;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
        }
        .result-box {
          margin-top: 24px;
          border-top: 1px solid #334155;
          padding-top: 20px;
        }
        .macro-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin: 16px 0;
        }
        .macro-item {
          background-color: #0f172a;
          padding: 12px;
          border-radius: 8px;
          text-align: center;
        }
        .macro-val {
          font-size: 18px;
          font-weight: 700;
          color: #10b981;
        }
      `}</style>

      <button className="btn-back" onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>

      <div className="fa-card">
        <h2>🍲 Food Analysis</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>
          Khane ki photo upload karein ya text me likhein, AI calories & nutrients calculate kar dega.
        </p>

        <form onSubmit={handleAnalyze}>
          <div className="input-group">
            <label>Food Item / Dish Name</label>
            <input
              type="text"
              placeholder="e.g. 2 Butter Roti with Paneer Tikka"
              value={foodText}
              onChange={(e) => setFoodText(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Upload Food Photo (Optional)</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{ width: '100px', height: '100px', marginTop: '10px', borderRadius: '8px', objectFit: 'cover' }}
              />
            )}
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '14px' }}>{error}</p>}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Analyzing Food...' : 'Analyze Food'}
          </button>
        </form>

        {/* Results Display */}
        {result && (
          <div className="result-box">
            <h3>{result.foodName}</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>Portion: {result.portionSize}</p>

            <div className="macro-grid">
              <div className="macro-item">
                <div className="macro-val">{result.calories}</div>
                <div style={{ fontSize: '12px' }}>Calories</div>
              </div>
              <div className="macro-item">
                <div className="macro-val">{result.protein}g</div>
                <div style={{ fontSize: '12px' }}>Protein</div>
              </div>
              <div className="macro-item">
                <div className="macro-val">{result.carbs}g</div>
                <div style={{ fontSize: '12px' }}>Carbs</div>
              </div>
              <div className="macro-item">
                <div className="macro-val">{result.fat}g</div>
                <div style={{ fontSize: '12px' }}>Fat</div>
              </div>
            </div>

            <p><strong>Rating:</strong> {result.healthRating}</p>
            <p style={{ fontSize: '14px', color: '#cbd5e1' }}>{result.summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}