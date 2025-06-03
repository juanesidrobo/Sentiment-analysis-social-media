import React, { useState } from "react";
import SentimentForm from "../components/SentimentForm";
import {
  SentimentResponse,
  sentimentService,
} from "../services/sentimentService";
import "../Styles/SentimentAnalysis.css";

const SentimentAnalysisPage: React.FC = () => {
  const [result, setResult] = useState<SentimentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getSentimentColor = (sentiment: string): string => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return "#4CAF50";
      case "negative":
        return "#F44336";
      case "neutral":
        return "#FF9800";
      default:
        return "#2196F3";
    }
  };

  const handleAnalyze = async (text: string) => {
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const response = await sentimentService.analyzeSentiment(text);
      setResult(response);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sentiment-analysis-container">
      <div
        className={`sentiment-analysis-card ${result ? "expanded-card" : ""}`}
      >
        <h1 className="title">Sentiment Analysis</h1>
        <p className="subtitle">Enter Review:</p>

        <SentimentForm onSubmit={handleAnalyze} loading={loading} />

        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
          </div>
        )}

        {result && (
          <div className="results-section">
            <div className="result-card">
              <div className="sentiment-result">
                <h2
                  className="sentiment-label"
                  style={{ color: getSentimentColor(result.sentiment) }}
                >
                  {result.sentiment.toUpperCase()} ({(result.confidence * 100).toFixed(1)}%)
                </h2>
              </div>

              <div className="metrics-grid">
                <div className="metric-item">
                  <span className="metric-label">Sentiment:</span>
                  <span className="metric-value">
                    {result.sentiment}
                  </span>
                </div>

                <div className="metric-item">
                  <span className="metric-label">Confidence:</span>
                  <span className="metric-value">
                    {(result.confidence * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="metric-item">
                  <span className="metric-label">Method:</span>
                  <span className="metric-value">
                    {result.method}
                  </span>
                </div>

                {/* Solo mostrar polarity y subjectivity si existen */}
                {result.polarity !== undefined && (
                  <div className="metric-item">
                    <span className="metric-label">Polarity:</span>
                    <span className="metric-value">
                      {result.polarity.toFixed(3)}
                    </span>
                  </div>
                )}

                {result.subjectivity !== undefined && (
                  <div className="metric-item">
                    <span className="metric-label">Subjectivity:</span>
                    <span className="metric-value">
                      {result.subjectivity.toFixed(3)}
                    </span>
                  </div>
                )}
              </div>

              <div className="analysis-explanation">
                <h3>Analysis Details:</h3>
                <ul>
                  <li>
                    <strong>Sentiment:</strong> {result.sentiment} - Overall emotional tone
                  </li>
                  <li>
                    <strong>Confidence:</strong> {(result.confidence * 100).toFixed(1)}% - How certain the model is
                  </li>
                  <li>
                    <strong>Method:</strong> {result.method} - Analysis technique used
                  </li>
                  {result.polarity !== undefined && (
                    <li>
                      <strong>Polarity:</strong> Ranges from -1 (most negative) to 1 (most positive)
                    </li>
                  )}
                  {result.subjectivity !== undefined && (
                    <li>
                      <strong>Subjectivity:</strong> Ranges from 0 (objective) to 1 (subjective)
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SentimentAnalysisPage;