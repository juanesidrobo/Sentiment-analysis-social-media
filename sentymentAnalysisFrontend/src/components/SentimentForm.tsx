import React, { useState } from "react";

type Props = {
  onSubmit: (text: string) => void;
  loading: boolean;
};

const SentimentForm: React.FC<Props> = ({ onSubmit, loading }) => {
  const [inputText, setInputText] = useState("");

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    onSubmit(inputText);
  };

  return (
    <div className="input-section">
      <textarea
        className="text-input"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter your text here..."
        rows={6}
        disabled={loading}
      />

      <button
        className="analyze-button"
        onClick={handleAnalyze}
        disabled={loading || !inputText.trim()}
      >
        {loading ? "Analyzing..." : "Analyze Sentiment"}
      </button>
    </div>
  );
};

export default SentimentForm;
